function Ambient(width = 128, height = 72) {
    this.player = null;  
    this.width  = width;
    this.height = height;  
}

Ambient.current = null;
Ambient.url     = "https://www.youtube.com/embed/videoseries?list=PL5gu-IlPASadeOQN5rLHzriWEsnRPnenp";

Ambient.prototype = {
    load: function(url) {
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
            },
        })
    },
    onPlayerReady: function(e) {
        e.target.setShuffle(true);
        e.target.playVideo();
    },
};

function onYouTubeIframeAPIReady() {
    Ambient.current = new Ambient();
    Ambient.current.load(Ambient.url);
}