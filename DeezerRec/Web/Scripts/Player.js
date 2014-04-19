DeezerRec.Player = function (appId, rootUrl) {
    var self = this;

    self.appId = appId;
    self.rootUrl = rootUrl;

    self.channelUrl = rootUrl + '/Web/Views/Include.html';
    self.Common = new DeezerRec.Common();

    self.user = ko.observable(undefined);
    self.initialized = ko.observable(undefined);

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

    self.logIn = function() {
        window.DZ.login(function(response) {
            if (response.authResponse) {
                window.DZ.api('/user/me', function(userResponse) {
                    self.user(userResponse.name);

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
            url:  self.rootUrl + '/End',
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

        if (self.album.tracks.data.length > self.albumTrackId) {

            self.currentTrack(self.album.tracks.data[self.albumTrackId]);

            $.ajax({
                type: "POST",
                url: self.rootUrl + '/Start',
                data: { Album: self.album.title, Title: self.currentTrack().title, Artist: self.album.artist.name },
                success: function () {

                    $('#album').text(self.album.title);
                    $('#artist').text(self.album.artist.name);

                    self.albumTrackId++;
                    window.DZ.player.playTracks([self.currentTrack().id]);
                }
            });
        }
    },

    self.startRecording = function () {
        if (self.currentAlbum() != undefined) {

            var url = 'http://api.deezer.com/album/' + self.currentAlbum().id + '?output=jsonp';

            $.ajax({
                type: "GET",
                dataType: "JSONP",
                url: url,
                success: function (album) {

                    debugger;

                    self.album = album;
                    self.albumTrackId = 0;
                    self.processAlbum();
                }
            });
        }
    };

    self.setCurrentAlbumId = function (album) {
        self.currentAlbum(album.object);
    };
};

var deezerAlbums = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,

    remote: {
        url: 'http://api.deezer.com/search/album?output=jsonp&q=%QUERY&callback=?&limit=15',
        ajax: $.ajax({
            type: 'GET', dataType: 'jsonp', jsonp: 'jsonp'
        }),
        filter: function (d) {
            var albums = [];

            $.each(d.data, function (index, value) {
                albums.push({ index: index, value: value.artist.name + ' - ' + value.title, object: value });
            });

            return albums;
        }
    }
});

$(document).ready(function () {

    window.Player = new DeezerRec.Player('135291', $('body').data("service-url"));
    deezerAlbums.initialize();
    ko.applyBindings(window.Player);

    window.Player.init();

    $('#logIn').click(function () {
        window.Player.logIn();
    });

    $("#startRecording").click(function () {
        window.Player.startRecording();
    });

    $("#endRecording").click(function () {
        window.Player.stopRecording();
    });

    $('#albumId').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'albums',
        displayKey: 'value',
        source: deezerAlbums.ttAdapter()
    });

    $(document).on('typeahead:selected', function (event, object) {
        window.Player.setCurrentAlbumId(object);
    });
});