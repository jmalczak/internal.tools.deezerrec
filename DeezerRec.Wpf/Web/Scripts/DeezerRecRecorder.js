DeezerRec.Recorder = function (rootUrl) {
    var self = this;

    self.rootUrl = rootUrl;

    self.start = function (track, callback) {
        $.ajax({
            type: "POST",
            url: self.rootUrl + '/Start',
            data: { Album: track.album.title, Title: track.track.title, Artist: track.album.artist.name },
            success: function () {
                callback();
            },
            async: false
        });
    };

    self.stop = function(callback) {
        $.ajax({
            type: "POST",
            url: self.rootUrl + '/End',
            success: function () {
                callback();
            },
        });
    };
};