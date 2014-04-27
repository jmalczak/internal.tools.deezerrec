DeezerRec.Wrapper = function (appId, channelUrl) {
    var self = this;

    self.appId = appId;
    self.channelUrl = channelUrl;

    self.initialized = false;

    self.init = function (callback) {
        window.DZ.init({
            appId: self.appId,
            channelUrl: self.channelUrl,
            player: {
                onload: function () {
                    self.initialized = true;
                    callback();
                }
            }
        });
    };

    self.logIn = function (successCallback) {
        window.DZ.login(function (response) {
            if (response.authResponse) {
                successCallback(response);
            }
        },
        { perms: 'basic_access,email' });
    };

    self.getUserData = function (callback) {
        window.DZ.api('/user/me', function (response) {
            callback(response);
        });
    };

    self.setEvent = function (eventName, callback) {
        window.DZ.Event.subscribe(eventName, callback);
    };

    self.searchAlbums = function (query, callback) {
        window.DZ.api('search/album?output=jsonp&limit=15&q=' + query, function (response) {
            callback(response);
        });
    };

    self.getAlbum = function (id, callback) {
        window.DZ.api('album/' + id, function (response) {
            callback(response);
        });
    };

    self.seek = function(progress) {
        window.DZ.player.seek(progress);
    };

    self.play = function() {
        window.DZ.player.play();
    };

    self.playTracks = function (tracks) {
        window.DZ.player.playTracks(tracks);
    };

    self.pause = function() {
        window.DZ.player.pause();
    };
};