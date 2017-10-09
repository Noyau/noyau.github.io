function Ambient(width = 128, height = 72) {
    this.player = null;  
    this.width  = width;
    this.height = height;  
}

Ambient.current = null;
Ambient.url     = "https://www.youtube.com/embed/videoseries?list=PL5gu-IlPASadeOQN5rLHzriWEsnRPnenp";

Ambient.prototype = {
    load: function(url) {
        var placeholder = document.getElementById('ambient');

        if(placeholder !== null) {
            this.width  = placeholder.width;
            this.height = placeholder.height;
        }

        this.player = new YT.Player('ambient', {
            width:  this.width,
            height: this.height,
            playerVars: {
                listType:   'playlist',
                list:       'PL5gu-IlPASadeOQN5rLHzriWEsnRPnenp',
                autoplay:   1,
                loop:       1,
                rel:        0,
                showinfo:   0,
                controls:   0,
                modestbranding: 1,
            },
            events: {
                'onReady':  this.onPlayerReady,
                'onError':  this.onPlayerError,
            },
        })
    },
    onPlayerReady: function(e) {
        var count = e.target.getPlaylist().length;
        var index = Core.Math.random(0, count);
        e.target.playVideoAt(index);
        e.target.setShuffle(true);
    },
    onPlayerError: function(e) {
        console.log(e);
        console.log("Failed to load video %s", e.target.getVideoUrl());
        setTimeout(function() { e.target.nextVideo(); }, 1000);
    },
};

function onYouTubeIframeAPIReady() {
    Ambient.current = new Ambient();
    Ambient.current.load(Ambient.url);
}