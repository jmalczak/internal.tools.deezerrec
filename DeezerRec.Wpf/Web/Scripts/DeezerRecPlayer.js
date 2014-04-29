DeezerRec.Player = function (rootUrl, deezerWrapper, deezerAutoComplete, deezerRecorder) {
    var self = this;

    self.rootUrl = rootUrl;
    self.deezerWrapper = deezerWrapper;
    self.deezerAutoComplete = deezerAutoComplete;
    self.deezerRecorder = deezerRecorder;

    self.deezerAutoComplete.selectEvent = function (selectedItem) {
        self.viewModel.currentAlbum(selectedItem);
    };

    self.deezerWrapper.init(function () {
        self.deezerWrapper.setEvent('player_position', self.playerPositionEvent);
    });

    self.viewModel = {
        loggedInUser: ko.observable(undefined),
        currentAlbum: ko.observable(undefined),
        currentTrack: ko.observable(undefined),
        currentTrackProgress: ko.observable('0%'),
        tracksToRecord: ko.observableArray([]),
        recoringSession: ko.observable(false),
        recordingInProgress: ko.observable(false),
        playingInProgress: ko.observable(false),
        songStarted: ko.observable(false),
        showConsole: ko.observable(false)
    }

    self.viewModel.currentTrack.subscribe(function (newValue) {
        if (newValue != undefined) $('[data-track-id="' + newValue.track.id + '"]').toggleClass("list-group-item-info");
    });

    self.viewModel.currentTrack.subscribe(function (oldValue) {
        if (oldValue != undefined) $('[data-track-id="' + oldValue.track.id + '"]').toggleClass("list-group-item-info");
    }, null, "beforeChange");

    self.showConsole = function() {
        self.viewModel.showConsole(!self.viewModel.showConsole());
    };

    self.logIn = function () {
        self.deezerWrapper.logIn(function () {
            self.deezerWrapper.getUserData(function (response) {

                if (response.name != undefined) {
                    self.viewModel.loggedInUser(response);
                    $.unblockUI();
                } else {
                    self.viewModel.loggedInUser(undefined);
                }
            });
        });
    };

    self.play = function () {
        if (self.viewModel.tracksToRecord().length == 0) return;
        if (self.viewModel.currentTrack() == undefined) self.viewModel.currentTrack(self.viewModel.tracksToRecord()[0]);

        var startPlaying = function () {

            self.viewModel.songStarted(false);

            if (!self.viewModel.playingInProgress()) {
                self.deezerWrapper.playTracks([self.viewModel.currentTrack().track.id]);
            } else {
                self.deezerWrapper.play();
            }

            self.viewModel.songStarted(false);
            self.viewModel.playingInProgress(true);
        };

        if (self.viewModel.recoringSession()) {
            self.deezerRecorder.start(self.viewModel.currentTrack(), function () {
                self.viewModel.recordingInProgress(true);
                startPlaying();
            });
        } else {
            startPlaying();
        }
    };

    self.playAndRecord = function () {
        self.viewModel.recoringSession(true);
        self.play();
    };

    self.pause = function () {
        self.stopRecording();
    };

    self.stop = function (callbackAfterStop) {
        self.viewModel.songStarted(false);

        var stopPlaying = function () {
            self.deezerWrapper.pause();
            self.viewModel.currentTrackProgress(0);
            self.viewModel.currentTrack(undefined);
            self.viewModel.playingInProgress(false);
        };

        if (self.viewModel.recoringSession()) {
            self.stopRecording(function () {
                stopPlaying();
                if (callbackAfterStop != undefined && typeof (callbackAfterStop) == "function") callbackAfterStop();
            });
        } else {
            stopPlaying();
            if (callbackAfterStop != undefined && typeof (callbackAfterStop) == "function") callbackAfterStop();
        }
    };

    self.stopRecording = function (callback) {
        self.deezerWrapper.pause();

        if (self.viewModel.recordingInProgress()) {
            self.deezerRecorder.stop(function () {
                self.viewModel.recordingInProgress(false);
                self.viewModel.recoringSession(false);

                if (callback != undefined) callback();
            });
        }
    };

    self.prev = function () {
        var recordingSession = self.viewModel.recoringSession();
        var playingInProgress = self.viewModel.playingInProgress();

        var trackIndex = 0;

        if (self.viewModel.currentTrack() != undefined) {
            trackIndex = self.viewModel.tracksToRecord().indexOf(self.viewModel.currentTrack());

            if (trackIndex > 0) {
                trackIndex--;
            } else {
                return;
            }
        }

        self.stop(function () {
            self.viewModel.currentTrack(self.viewModel.tracksToRecord()[trackIndex]);
            self.viewModel.songStarted(false);

            if (playingInProgress) {
                if (recordingSession) {
                    self.playAndRecord();
                } else {
                    self.play();
                }
            }
        });
    };

    self.next = function () {
        self.playNext();
    };

    self.playNext = function () {
        var recordingSession = self.viewModel.recoringSession();
        var playingInProgress = self.viewModel.playingInProgress();

        var trackIndex = 0;

        if (self.viewModel.currentTrack() != undefined) {
            trackIndex = self.viewModel.tracksToRecord().indexOf(self.viewModel.currentTrack());

            if (trackIndex < self.viewModel.tracksToRecord().length - 1) {
                trackIndex++;
            } else {
                return;
            }
        }

        self.stop(function () {

            self.viewModel.currentTrack(self.viewModel.tracksToRecord()[trackIndex]);
            self.viewModel.songStarted(false);

            if (playingInProgress) {
                if (recordingSession) {
                    self.playAndRecord();
                } else {
                    self.play();
                }
            }
        });
    };

    self.playerPositionEvent = function (e) {
        var position = (e[0] / e[1]) * 100;

        if (position > 0 && self.viewModel.playingInProgress() && self.viewModel.songStarted() == false) {
            self.viewModel.songStarted(true);
        } else if (position == 0 && self.viewModel.playingInProgress() && self.viewModel.songStarted()) {
            self.viewModel.songStarted(false);
            self.playNext();
        }

        if (!isNaN(position)) {
            self.viewModel.currentTrackProgress(position.toFixed(0) + '%');
        }
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