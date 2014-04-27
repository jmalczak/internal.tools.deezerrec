$(document).ready(function () {

    if (window.DeezerRecConsole == undefined) {
        window.DeezerRecConsole = new DeezerRec.Console();
        window.onerror = window.DeezerRecConsole.log;
    }

    if (window.DeezerRecWrapper == undefined) {
        window.DeezerRecWrapper = new DeezerRec.Wrapper('135291', $('body').data("service-url"));
    }

    if (window.DeezerRecPlayer == undefined) {
        window.DeezerAutoComplete = new DeezerRec.AutoComplete(window.DeezerRecWrapper);
        window.DeezerRecPlayer = new DeezerRec.Player($('body').data("service-url"), window.DeezerRecWrapper, window.DeezerAutoComplete , new DeezerRec.Recorder($('body').data("service-url")));
    }

    ko.applyBindings(window.DeezerRecPlayer);
    window.DeezerAutoComplete.init();
    
    $.blockUI({ message: null, overlayCSS: { backgroundColor: '#000', opacity: 0.6, cursor: 'default' } });
});

