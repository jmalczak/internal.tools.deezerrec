DeezerRec.Player = function (appId, rootUrl) {
    var self = this;

    self.appId = appId;
    self.rootUrl = rootUrl;

    self.channelUrl = rootUrl + '/Web/Views/Include.html';

    self.user = ko.observable(undefined);
    self.userUrl = ko.observable(undefined);

    self.initialized = ko.observable(undefined);
    self.authenticated = ko.observable(undefined);

    // Needed only to add tracks when Add is clicked
    self.currentAlbum = ko.observable(undefined);

    self.currentTrack = ko.observable(undefined);
    self.currentTrackProgress = ko.observable('0%');
    self.tracksToRecord = ko.observableArray([]);
    self.trackNumber = ko.observable(0);

    self.recoringSession = ko.observable(false);
    self.recordingInProgress = ko.observable(false);
    self.playingInProgress = ko.observable(false);

    self.songStarted = false;

    self.init = function () {

        $("#searchKey").kendoAutoComplete({
            dataTextField: "fullName",
            select: function (e) {
                window.Player.currentAlbum(this.dataItem(e.item.index()).item);
            },
            dataSource: {
                schema: {
                    data: function (response) {
                        var convertedData = [];

                        $.each(response.data, function (i, item) {
                            convertedData.push({ fullName: item.artist.name + ' - ' + item.title, item: item });
                        });

                        return convertedData;
                    }
                },
                serverFiltering: true,
                transport: {
                    read: {
                        type: "GET",
                        url: "http://api.deezer.com/search/album?output=jsonp&limit=15",
                        dataType: "jsonp"
                    },
                    parameterMap: function (data) {
                        return { q: data.filter.filters[0].value };
                    }
                }
            }
        });

        $.blockUI({
            message: null,
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'default'
            }
        });

        window.DZ.init({
            appId: self.appId,
            channelUrl: self.channelUrl,
            player: {
                onload: function () {

                    window.DZ.Event.subscribe('player_position', self.playerPositionEvent);

                    self.initialized(true);
                }
            }
        });
    };

    self.logIn = function () {
        window.DZ.login(function (response) {
            if (response.authResponse) {
                window.DZ.api('/user/me', function (userResponse) {
                    self.user(userResponse.name);
                    self.userUrl(userResponse.link);

                    if (userResponse.name != undefined) {
                        self.authenticated(true);
                        $.unblockUI();
                        $('#startPlaying').removeAttr("disabled");
                        $('#endRecording').removeAttr("disabled");
                    }
                });
            }
        },
        { perms: 'basic_access,email' });
    };

    self.playerPositionEvent = function (e) {

        var position = (e[0] / e[1]) * 100;

        if (!isNaN(position)) {
            self.currentTrackProgress(position.toFixed(0) + '%');
        }

        if (e[0] > 0 && e[1] > 0) {
            self.songStarted = true;
        }

        console.log(e);
        console.log(self.songStarted);
        console.log(self.playingInProgress());

        if (e[0] == 0 && e[1] > 0 && self.songStarted == true && self.playingInProgress() == true) {
            self.playNext();
            self.songStarted = false;
        }
    };

    self.playNext = function () {

        self.playingInProgress(false);

        if (self.tracksToRecord().length > self.trackNumber() + 1) {
            self.currentTrack(self.tracksToRecord()[self.trackNumber() + 1]);
            self.trackNumber(self.trackNumber() + 1);

            if (self.recoringSession()) {
                self.stopInternal(function () {
                    self.songStarted = false;
                    self.playAndRecord();
                });
            } else {
                self.stopInternal(function () {
                    self.songStarted = false;
                    self.play();
                });
            }

        } else {
            self.stop();
        }
    };

    self.play = function () {
        self.startPlaying(false);
    };

    self.playAndRecord = function () {
        self.recoringSession(true);
        self.startPlaying(true);
    };

    self.pause = function () {
        self.stopInternal();
        self.recoringSession(false);
    };

    self.stop = function () {
        self.songStarted = false;

        if (self.recoringSession()) {
            self.stopInternal();
        }

        window.DZ.player.seek(99.9);

        self.currentTrack(undefined);
        self.trackNumber(0);
        self.recoringSession(false);
        self.playingInProgress(false);
    };

    self.next = function () {
        self.playNext();
    };

    self.prev = function () {
        self.stopInternal();
        self.playingInProgress(false);

        var previousTrackNumber = self.trackNumber() == 0 ? self.trackNumber() : self.trackNumber() - 1;

        if (self.tracksToRecord().length > previousTrackNumber) {
            self.trackNumber(previousTrackNumber);
            self.currentTrack(self.tracksToRecord()[previousTrackNumber]);
        }

        if (self.recoringSession()) {
            self.playAndRecord();
        } else {
            self.play();
        }
    };

    self.stopInternal = function (callback) {

        window.DZ.player.pause();
        console.log('test');

        if (self.recordingInProgress()) {
            $.ajax({
                type: "POST",
                url: self.rootUrl + '/End',
                success: function () {
                    window.DZ.player.pause();
                    self.recordingInProgress(false);
                    if (callback != undefined) callback();
                },
            });
        }
    };

    self.startPlaying = function (recordTrack) {

        if (self.tracksToRecord().length == 0) {
            return;
        }

        if (self.currentTrack() == undefined) {
            self.trackNumber(0);
            self.currentTrack(self.tracksToRecord()[0]);
        }

        if (recordTrack) {
            $.ajax({
                type: "POST",
                url: self.rootUrl + '/Start',
                data: { Album: self.currentTrack().album.title, Title: self.currentTrack().track.title, Artist: self.currentTrack().album.artist.name },
                success: function() {
                    self.playInternal();
                    self.recordingInProgress(true);
                },
                async: false
        });
        } else {
            self.playInternal();
        }
    },

    self.playInternal = function () {
        if (!self.playingInProgress()) {
            window.DZ.player.playTracks([self.currentTrack().track.id]);
        } else {
            window.DZ.player.play();
        }

        self.playingInProgress(true);
    };

    self.addCurrentAlbum = function () {
        var url = 'http://api.deezer.com/album/' + self.currentAlbum().id + '?output=jsonp';

        $.ajax({
            type: "GET",
            dataType: "JSONP",
            url: url,
            success: function (fullAlbumData) {
                $.each(fullAlbumData.tracks.data, function (i, item) {
                    self.tracksToRecord.push({ album: self.currentAlbum(), track: item });
                });
            }
        });
    };

    self.removeTrack = function (trackObject) {
        self.tracksToRecord.remove(trackObject);
    };
};

$(document).ready(function () {

    window.Player = new DeezerRec.Player('135291', $('body').data("service-url"));
    ko.applyBindings(window.Player);

    window.Player.init();
});