DeezerRec.Console = function () {
    var self = this;

    self.consoleDivId = 'console';

    self.log = function(message) {
        self.setContent(consoleDivId, document.getElementById(consoleDivId).innerHTML + ' ' + message);
    };

    self.setContent = function(placeHolder, text) {
        document.getElementById(placeHolder).innerHTML = text;
    };
};