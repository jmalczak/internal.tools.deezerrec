$(document).ready(function () {

    if (window.DeezerRecConsole == undefined) {
        window.DeezerRecConsole = new DeezerRec.Console();
        window.onerror = window.DeezerRecConsole.log;
    }

    if (window.DeezerRecWrapper == undefined) {
        window.DeezerRecWrapper = new DeezerRec.Wrapper('135291', $('body').data("service-url"));
    }

    if (window.DeezerRecAutoComplete == undefined) {
        window.DeezerRecAutoComplete = new DeezerRec.AutoComplete(window.DeezerRecWrapper);
        window.DeezerRecAutoComplete.init();
    }

    if (window.DeezerRecPlayer == undefined) {
        window.DeezerRecPlayer = new DeezerRec.Player($('body').data("service-url"), window.DeezerRecWrapper, window.DeezerRecAutoComplete, new DeezerRec.Recorder($('body').data("service-url")));

        ko.applyBindings(window.DeezerRecPlayer);
        $.blockUI({ message: null, overlayCSS: { backgroundColor: '#000', opacity: 0.6, cursor: 'default' } });
    }
});

