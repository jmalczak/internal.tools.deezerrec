DeezerRec.Player = function (appId, channelUrl) {
    var self = this;

    self.appId = appId;
    self.channelUrl = channelUrl;
    self.Common = new DeezerRec.Common();

    var currentSongStarted = false;
    var loggedIn = false;

    self.init = function () {

        window.DZ.init({
            appId: self.appId,
            channelUrl: self.channelUrl,
            player: {
                onload: function () {

                    window.DZ.Event.subscribe('current_track', self.currentTrackEvent);
                    window.DZ.Event.subscribe('player_position', self.playerPositionEvent);

                    window.DZ.login(function (response) {
                        if (response.authResponse) {
                            window.DZ.api('/user/me', function (userResponse) {
                                $("#loggedInSpan").show();
                                $('#userName').text(userResponse.name);
                            });
                        }
                    },
                    { perms: 'basic_access,email' });
                }
            }
        });
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
            url: 'http://localhost:8080/End',
            success: function () {
                self.processAlbum();
            }
        });
    };


    self.stopRecording = function () {
        $.ajax({
            type: "POST",
            url: 'http://localhost:8080/End',
            success: function () {
                alert('Stopped');
            }
        });
    };

    self.processAlbum = function () {

        if (self.album.tracks.data.length > self.albumTrackId) {

            self.currentTrack = self.album.tracks.data[self.albumTrackId];

            $.ajax({
                type: "POST",
                url: 'http://localhost:8080/Start',
                data: { Album: self.album.title, Title: self.currentTrack.title, Artist: self.album.artist.name },
                success: function () {

                    $('#album').text(self.album.title);
                    $('#artist').text(self.album.artist.name);
                    $('#title').text(self.currentTrack.title);

                    self.albumTrackId++;
                    window.DZ.player.playTracks([self.currentTrack.id]);
                }
            });
        }
    },

    self.startRecording = function () {
        var albumId = $('#albumId').val();
        var url = 'http://api.deezer.com/album/' + albumId + '?output=jsonp';

        $.ajax({
            type: "GET",
            dataType: "JSONP",
            url: url,
            success: function (album) {
                self.album = album;
                self.albumTrackId = 0;
                self.processAlbum();
            }
        });
    };
};

window.Player = new DeezerRec.Player('135291', 'http://localhost:8080/Web/Views/Include.html');

$(document).ready(function () {

    $('#logIn').click(function () {
        window.Player.init();
    });

    $("#startRecording").click(function () {
        window.Player.startRecording();
    });

    $("#endRecording").click(function () {
        window.Player.stopRecording();
    });
});