var helper = {
    pickRandomNumber: function (max, min) {
        if (!min) min = 0;
        return Math.floor(Math.random() * (max - (min + 1)));
    },
    getFilename: function (url) {
        return url.substring(url.lastIndexOf('/') + 1);
    },
    cleanURL: function (url) {
        var modifiers = [
            {
                o: "&amp;",
                n: "&"
            }
        ];
        for (var i =0; i < modifiers.length; i++) {
            while(url.indexOf(modifiers[i].o) > -1) {
                console.log('changing url');
                url = url.replace(modifiers[i].o, modifiers[i].n);
            }
        }
        return url;
    }
}

module.exports = helper;
