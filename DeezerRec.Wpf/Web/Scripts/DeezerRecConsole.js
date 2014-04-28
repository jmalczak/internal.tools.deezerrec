DeezerRec.Console = function () {
    var self = this;

    self.consoleDivId = 'console';

    self.log = function (message) {
        if (self.getMode() == 'DEBUG') {
            self.writeMessage(message);
        }
    };

    self.error = function(message) {
        self.writeMessage(message);
    };

    self.writeMessage = function(message) {
        self.setContent(self.consoleDivId, message + '<br />' + document.getElementById(self.consoleDivId).innerHTML);
    };

    self.setContent = function(placeHolder, text) {
        document.getElementById(placeHolder).innerHTML = text;
    };

    self.getMode = function() {
        return $('body').data('mode');
    };
};