DeezerRec.Console = function () {
    var self = this;

    self.consoleDivId = 'console';

    self.log = function(message) {
        self.setContent(self.consoleDivId, document.getElementById(self.consoleDivId).innerHTML + ' ' + message + '<br />');
    };

    self.setContent = function(placeHolder, text) {
        document.getElementById(placeHolder).innerHTML = text;
    };
};