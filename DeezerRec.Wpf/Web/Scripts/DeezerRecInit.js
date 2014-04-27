$(document).ready(function () {

    if (window.DeezerRecConsole == undefined) {
        window.DeezerRecConsole = new DeezerRec.Console();
        window.onerror = window.DeezerRecConsole.log;
    }

    if (window.DeezerRecWrapper == undefined) {
        window.DeezerRecWrapper = new DeezerRec.Wrapper('135291', $('body').data("service-url"));
    }

    if (window.DeezerRecPlayer == undefined) {
        window.DeezerRecPlayer = new DeezerRec.Player($('body').data("service-url"), window.DeezerRecWrapper);
    }

    ko.applyBindings(window.DeezerRecPlayer);

    window.DeezerRecWrapper.init();
    window.DeezerRecPlayer.init();
});

