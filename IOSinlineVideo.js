'use strict';

var InlineVideo = function (elem, canvas, id)
{
    var video = null;
    var videoCanvas = null;
    var videoContext = null;
    var container = null;
    var inlineVideo = null;

    // global
    var lastTime;
    var newSize;

    // private
    (function init()
    {
        var ratio = {
            w: (id == 'game' ? 21 : 16),
            h: 9
        };

        newSize = Utils.ratioCalc(ratio.w, ratio.h, window.innerWidth, window.innerHeight);

        // set video
        video = elem;

        video.width = newSize.w;
        video.height = newSize.h;

        // replace the video with inlineVideo element
        inlineVideo = document.createElement('inlineVideo');
        inlineVideo.id = 'inlinevideo-' + id;
        $(inlineVideo).addClass('inlineVideoContainer ontop');
        $(elem).replaceWith(inlineVideo);
        container = $(inlineVideo);

        // set canvas
        videoCanvas = canvas;
        videoCanvas.width = video.width;
        videoCanvas.height = video.height;
        videoCanvas.id = 'inlinecanvas-' + id;
        $(videoCanvas).addClass('inlineVideoPlayer');
        videoContext = videoCanvas.getContext('2d');

        videoCanvas.style.width = newSize.w * 2;
        videoCanvas.style.height = newSize.h * 2;

        // Initiate video event listeners
        initEvents();

        // Init load on the video
        initializePlayer();
    })();

    this.remove = function ()
    {
        this.pauseVideo();
        videoCanvas.remove();
        container.remove();
    };

    this.updateVideoPosition = function (left, top)
    {
        videoCanvas.style.left = left + "px";
        videoCanvas.style.top = top + "px";
    };

    this.playVideo = function ()
    {
        lastTime = Date.now();
        video.animationRequest = requestAnimationFrame(loop);
    };

    this.pauseVideo = function ()
    {
        cancelAnimationFrame(video.animationRequest);
        video.animationRequest = null;
    };

    this.getCurrentTime = function ()
    {
        return video.currentTime;
    };

    this.getDuration = function ()
    {
        return video.duration;
    };

    this.continueVideo = function ()
    {
        site.overlay.hideOverlay();
        this.playVideo();
    };

    this.resetVideoTime = function ()
    {
        video.currentTime = 0;
    };

    this.mute = function ()
    {
        video.muted = true;
    };

    /*
    * Could trigger some event with the id
    */
    function videoEndHandler()
    {
    }

    function initializePlayer()
    {
        // resize & inject our video player into the dom
        var player = [videoCanvas];
        container.width(video.width).height(video.height).append(player);
    }

    function handleProgress()
    {
        var end = video.buffered.end(0);
        var sofar = parseInt(((end / video.duration) * 100));
    }

    function handlePlayButtonClicked()
    {
        lastTime = Date.now();
        video.animationRequest = requestAnimationFrame(loop);
    }

    function handlePauseButtonClicked()
    {
        cancelAnimationFrame(video.animationRequest);
    }

    function renderFrame(elapsed)
    {
        video.currentTime = video.currentTime + elapsed;

        var width = newSize.w || w;
        var height = newSize.h || h;

        videoContext.drawImage(video, 0, 0, width, height);
    }

    function loop()
    {
        var time = Date.now();
        var elapsed = (time - lastTime) / 1000;

        // render
        if (elapsed >= ((1000 / 25) / 1000)) {
            renderFrame(elapsed);
            lastTime = time;
        }

        // if we are at the end of the video stop
        var currentTime = (Math.round(parseFloat(video.currentTime) * 10000) / 10000);
        var duration = (Math.round(parseFloat(video.duration) * 10000) / 10000);
        if (currentTime >= duration) {
            videoEndHandler();
            return;
        }

        video.animationRequest = requestAnimationFrame(loop);
    }


    /**
     * Set events
     */
    function initEvents()
    {
        // events
        video.onloadstart = function ()
        {

        }; // fires when the loading starts

        /*
        * Could trigger some event to check status
        */
        video.addEventListener('timeupdate', function ()
        {
        });

        video.onloadedmetadata = function ()
        {

        }; //  when we have metadata about the video
        video.onloadeddata = function ()
        {

        }; // when we have the first frame
        video.onprogress = function ()
        {
            handleProgress(arguments);
        };
    }
};
