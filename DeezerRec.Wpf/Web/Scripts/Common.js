DeezerRec.Common = function () {
    var self = this;

    self.log = function(message) {
        self.setContent('console', document.getElementById('console').innerHTML + ' ' + message);
    };

    self.setContent = function(placeHolder, text) {
        document.getElementById(placeHolder).innerHTML = text;
    };
};