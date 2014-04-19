DeezerRec.Player = function (appId, rootUrl) {
    var self = this;

    self.appId = appId;
    self.rootUrl = rootUrl;

    self.channelUrl = rootUrl + '/Web/Views/Include.html';
    self.Common = new DeezerRec.Common();

    self.user = ko.observable(undefined);
    self.userUrl = ko.observable(undefined);

    self.initialized = ko.observable(undefined);
    self.authenticated = ko.observable(undefined);

    self.tracksToRecord = ko.observableArray([]);

    self.trackNumber = ko.observable(0);
    self.currentAlbum = ko.observable(undefined);
    self.currentTrack = ko.observable(undefined);

    var currentSongStarted = false;

    self.init = function () {

        window.DZ.init({
            appId: self.appId,
            channelUrl: self.channelUrl,
            player: {
                onload: function () {

                    window.DZ.Event.subscribe('current_track', self.currentTrackEvent);
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

                    self.authenticated(true);

                    $.unblockUI();
                    $('#startRecording').removeAttr("disabled");
                    $('#endRecording').removeAttr("disabled");
                });
            }
        },
        { perms: 'basic_access,email' });
    };

    self.playerPositionEvent = function (e) {

        var position = (e[0] / e[1]) * 100;

        if (!isNaN(position)) {
            console.log(position.toFixed(0) + '%');
        }

        if (e[0] > 0 && e[1] > 0) {
            currentSongStarted = true;
        }

        console.log(e);

        if (e[0] == 0 && e[1] > 0 && currentSongStarted == true) {

            self.stopRecordingAndPlayNext();
            currentSongStarted = false;
        }
    };

    self.stopRecordingAndPlayNext = function () {
        $.ajax({
            type: "POST",
            url: self.rootUrl + '/End',
            success: function () {
                self.processAlbum();
            }
        });
    };


    self.stopRecording = function () {
        $.ajax({
            type: "POST",
            url: self.rootUrl + '/End',
            success: function () {
                alert('Stopped');
            }
        });
    };

    self.processAlbum = function () {
        if (self.tracksToRecord().length > self.trackNumber()) {

            var trackObject = self.tracksToRecord()[self.trackNumber()];
            self.currentTrack(trackObject.track);

            $.ajax({
                type: "POST",
                url: self.rootUrl + '/Start',
                data: { Album: trackObject.album.title, Title: self.currentTrack().title, Artist: trackObject.album.artist.name },
                success: function () {

                    self.trackNumber(self.trackNumber() + 1);
                    window.DZ.player.playTracks([self.currentTrack().id]);
                }
            });
        }
    },

    self.setCurrentAlbum = function () {
        var url = 'http://api.deezer.com/album/' + self.currentAlbum.id + '?output=jsonp';

        $.ajax({
            type: "GET",
            dataType: "JSONP",
            url: url,
            success: function (fullAlbumData) {
                $.each(fullAlbumData.tracks.data, function (i, item) {
                    self.tracksToRecord.push({ album: self.currentAlbum, track: item });
                });

                console.log(self.tracksToRecord());
            }
        });
    };
};

$(document).ready(function () {

    window.Player = new DeezerRec.Player('135291', $('body').data("service-url"));
    ko.applyBindings(window.Player);

    window.Player.init();

    $('#addAlbum').click(function () {
        window.Player.setCurrentAlbum();
    });

    $('#logIn').click(function () {
        window.Player.logIn();
    });

    $("#startRecording").click(function () {
        window.Player.processAlbum();
    });

    $("#endRecording").click(function () {
        window.Player.stopRecording();
    });

    $("#searchKey").kendoAutoComplete({
        dataTextField: "fullName",
        select: function (e) {
            window.Player.currentAlbum = this.dataItem(e.item.index()).item;
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
                    url: "http://api.deezer.com/search/album?output=jsonp&callback=?&limit=15",
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
});