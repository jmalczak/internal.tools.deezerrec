DeezerRec.Player = function (appId, channelUrl) {
    var self = this;

    self.appId = appId;
    self.channelUrl = channelUrl;
    self.Common = new DeezerRec.Common();

    var currentSongStarted = false;
    var loggedIn = false;

    self.init = function () {
        DZ.init({
            appId: self.appId,
            channelUrl: self.channelUrl,
            player: {
                onload: function () {

                }
            }
        });

        DZ.login(function (response) {
            if (response.authResponse) {
                DZ.api('/user/me', function (userResponse) {
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
        DZ.Event.subscribe('current_track', self.currentTrackEvent);
        DZ.Event.subscribe('player_position', self.playerPositionEvent);

        DZ.player.playTracks([76255054, 76266758], false);

        setTimeout(function () {
            DZ.player.play();
            loggedIn = true;
        }, 1000);
    };

    self.currentTrackEvent = function (track) {
        self.Common.setContent('track', track.track.album.title + ' - ' + track.track.title);

        if (loggedIn) {
            $.get("http://localhost:8080/Start/" + track.track.title + "/" + track.track.album.title, function() {
            });
        }
    };

    self.playerPositionEvent = function(e) {

        var position = (e[0] / e[1]) * 100;

        if (!isNaN(position)) {
            self.Common.setContent('position', position.toFixed(0) + '%');    
        }

        if (e[0] > 0 && e[1] > 0) {
            currentSongStarted = true;
            //log('starting recording <br/>');
        }

        if (currentSongStarted) {
            //log("current: " + e[0] + '<br />');
            //log("total: " + e[1] + '<br />');
        }

        if (e[0] == 0 && e[1] > 0 && currentSongStarted == true) {

            $.get("http://localhost:8080/End", function() {
            });

            currentSongStarted = false;
            //log('finished recording <br />');
        }
    };
};