var imgur = {
    generateOpts: function (code, album) {
        var url;
        if (album) {
            url = "https://api.imgur.com/3/album/"+code+"/images";
        } else {
            url = "https://api.imgur.com/3/image/"+code;
        }
        return {
            url: url,
            headers: {
                'Authorization': 'Client-ID 905f8623e29ae6a'
            }
        }
    }
}

module.exports = imgur;
