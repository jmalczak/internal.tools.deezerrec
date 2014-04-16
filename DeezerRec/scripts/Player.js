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

                }
            }
        });

        window.DZ.login(function (response) {
            if (response.authResponse) {
                window.DZ.api('/user/me', function (userResponse) {
                    self.Common.setContent('userName', userResponse.name);
                    self.startRecording();
                });
            } else {
                self.Common.setContent('userName', 'Unauthorized');
            }
        },
        { perms: 'basic_access,email' });
    };

    self.startRecording = function () {
        window.DZ.Event.subscribe('current_track', self.currentTrackEvent);
        window.DZ.Event.subscribe('player_position', self.playerPositionEvent);

        window.DZ.player.playTracks([76255054, 76266758], false);

        setTimeout(function () {
            window.DZ.player.play();
            loggedIn = true;
        }, 1000);
    };

    self.currentTrackEvent = function (track) {
        self.Common.setContent('track', track.track.album.title + ' - ' + track.track.title);

        if (loggedIn) {
            $.get("http://localhost:8080/Start/" + track.track.title + "/" + track.track.album.title, function () {
            });
        }
    };

    self.playerPositionEvent = function (e) {

        var position = (e[0] / e[1]) * 100;

        if (!isNaN(position)) {
            self.Common.setContent('position', position.toFixed(0) + '%');
        }

        if (e[0] > 0 && e[1] > 0) {
            currentSongStarted = true;
        }

        if (currentSongStarted) {
        }

        if (e[0] == 0 && e[1] > 0 && currentSongStarted == true) {

            $.get("http://localhost:8080/End", function () {
            });

            currentSongStarted = false;
        }
    };
};