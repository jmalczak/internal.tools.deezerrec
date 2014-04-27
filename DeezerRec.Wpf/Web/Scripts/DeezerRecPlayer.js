DeezerRec.Player = function (rootUrl, deezerWrapper) {
    var self = this;

    self.rootUrl = rootUrl;
    self.deezerWrapper = deezerWrapper;

    self.autoComplete = new DeezerRec.AutoComplete(deezerWrapper, function (selectedItem) {
        self.viewModel.currentAlbum(selectedItem);
    });

    self.recorder = new DeezerRec.Recorder(self.rootUrl);

    self.viewModel = {
        user: ko.observable(undefined),
        userUrl: ko.observable(undefined),
        initialized: ko.observable(undefined),
        authenticated: ko.observable(undefined),
        currentAlbum: ko.observable(undefined),
        currentTrack: ko.observable(undefined),
        currentTrackProgress: ko.observable('0%'),
        tracksToRecord: ko.observableArray([]),
        trackNumber: ko.observable(0),
        recoringSession: ko.observable(false),
        recordingInProgress: ko.observable(false),
        playingInProgress: ko.observable(false),
        songStarted: false
    }

    self.init = function () {
        self.autoComplete.init();
        $.blockUI({ message: null, overlayCSS: { backgroundColor: '#000', opacity: 0.6, cursor: 'default' } });
        self.deezerWrapper.setEvent('player_position', self.playerPositionEvent);
    };

    self.logIn = function () {
        self.deezerWrapper.logIn(function () {
            self.deezerWrapper.getUserData(function (response) {
                self.viewModel.user(response.name);
                self.viewModel.userUrl(response.link);

                if (response.name != undefined) {
                    self.viewModel.authenticated(true);
                    $.unblockUI();
                    $('#startPlaying').removeAttr("disabled");
                    $('#endRecording').removeAttr("disabled");
                }
            });
        });
    };

    self.playerPositionEvent = function (e) {
        var position = (e[0] / e[1]) * 100;

        if (!isNaN(position)) {
            self.viewModel.currentTrackProgress(position.toFixed(0) + '%');
        }

        if (e[0] > 0 && e[1] > 0) {
            self.viewModel.songStarted = true;
        }

        if (e[0] == 0 && e[1] > 0 && self.viewModel.songStarted == true && self.viewModel.playingInProgress() == true) {
            self.playNext();
            self.viewModel.songStarted = false;
        }
    };

    self.playNext = function () {
        self.viewModel.playingInProgress(false);

        if (self.viewModel.tracksToRecord().length > self.viewModel.trackNumber() + 1) {
            self.viewModel.currentTrack(self.viewModel.tracksToRecord()[self.viewModel.trackNumber() + 1]);
            self.viewModel.trackNumber(self.viewModel.trackNumber() + 1);

            if (self.viewModel.recoringSession()) {
                self.stopInternal(function () {
                    self.viewModel.songStarted = false;
                    self.playAndRecord();
                });
            } else {
                self.stopInternal(function () {
                    self.viewModel.songStarted = false;
                    self.play();
                });
            }

        } else {
            self.stop();
        }
    };

    self.play = function () {
        self.viewModel.startPlaying(false);
    };

    self.playAndRecord = function () {
        self.viewModel.recoringSession(true);
        self.viewModel.startPlaying(true);
    };

    self.pause = function () {
        self.stopInternal();
        self.viewModel.recoringSession(false);
    };

    self.stop = function () {
        self.viewModel.songStarted = false;

        if (self.viewModel.recoringSession()) {
            self.stopInternal();
        }

        self.deezerWrapper.seek(99.9);

        self.viewModel.currentTrack(undefined);
        self.viewModel.trackNumber(0);
        self.viewModel.recoringSession(false);
        self.viewModel.playingInProgress(false);
    };

    self.next = function () {
        self.playNext();
    };

    self.prev = function () {
        self.stopInternal();
        self.viewModel.playingInProgress(false);

        var previousTrackNumber = self.viewModel.trackNumber() == 0 ? self.viewModel.trackNumber() : self.viewModel.trackNumber() - 1;

        if (self.viewModel.tracksToRecord().length > previousTrackNumber) {
            self.viewModel.trackNumber(previousTrackNumber);
            self.viewModel.currentTrack(self.viewModel.tracksToRecord()[previousTrackNumber]);
        }

        if (self.viewModel.recoringSession()) {
            self.playAndRecord();
        } else {
            self.play();
        }
    };

    self.stopInternal = function (callback) {

        self.deezerWrapper.pause();
        console.log('test');

        if (self.viewModel.recordingInProgress()) {
            self.recorder.stop(function () {
                self.deezerWrapper.pause();
                self.viewModel.recordingInProgress(false);
                if (callback != undefined) callback();
            });
        }
    };

    self.startPlaying = function (recordTrack) {
        if (self.viewModel.tracksToRecord().length == 0) {
            return;
        }

        if (self.viewModel.currentTrack() == undefined) {
            self.viewModel.trackNumber(0);
            self.viewModel.currentTrack(self.viewModel.tracksToRecord()[0]);
        }

        if (recordTrack) {
            self.recorder.start(self.viewModel.currentTrack(), function () {
                self.playInternal();
                self.viewModel.recordingInProgress(true);
            });
        } else {
            self.playInternal();
        }
    },

    self.playInternal = function () {
        if (!self.viewModel.playingInProgress()) {
            self.deezerWrapper.playTracks([self.viewModel.currentTrack().track.id]);
        } else {
            self.deezerWrapper.play();
        }

        self.viewModel.playingInProgress(true);
    };

    self.addCurrentAlbum = function () {
        self.deezerWrapper.getAlbum(self.viewModel.currentAlbum().id, function (response) {
            $.each(response.tracks.data, function (i, item) {
                self.viewModel.tracksToRecord.push({ album: self.viewModel.currentAlbum(), track: item });
            });
        });
    };

    self.removeTrack = function (trackObject) {
        self.viewModel.tracksToRecord.remove(trackObject);
    };
};