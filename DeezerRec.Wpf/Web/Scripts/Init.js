if (window.DeezerRecConsole == undefined) {
    window.DeezerRecConsole = new DeezerRec.Console();
    window.onerror = window.DeezerRecConsole.log;
}