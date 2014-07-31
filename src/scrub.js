/* globals jQuery, requestAnimationFrame, window */

/*

██╗   ██╗███████╗███████╗     █████╗ ██╗     ██╗         ███████╗██╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔════╝    ██╔══██╗██║     ██║         ██╔════╝██║██║   ██║██╔════╝
██║   ██║███████╗█████╗      ███████║██║     ██║         █████╗  ██║██║   ██║█████╗
██║   ██║╚════██║██╔══╝      ██╔══██║██║     ██║         ██╔══╝  ██║╚██╗ ██╔╝██╔══╝
╚██████╔╝███████║███████╗    ██║  ██║███████╗███████╗    ██║     ██║ ╚████╔╝ ███████╗
 ╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═══╝  ╚══════╝

Author: Zachary Brown <zeebz91@gmail.com>
Author URI: http://useallfive.com/

Description: Map page scroll progress to a video timeline.
Package URL: https://github.com/UseAllFive/scrub.js

*/
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    $.fn.scrub = function(options) {
        var $container;
        var $contentBody;
        var $self;
        var containerHeight;
        var contentBodyHeight;
        var extMimeMap;
        var opts;
        var video;
        var videoDuration;

        extMimeMap = {
            mov: 'video/mp4',
            mp4: 'video/mp4',
            ogg: 'video/ogg',
            ogv: 'video/ogg',
            webm: 'video/webm'
        };

        function _init() {
            opts = $.extend({}, $.fn.scrub.defaults, options);
            video = $self.get(0);
            $container = opts.container instanceof $ ? opts.container : $(opts.container);
            containerHeight = $container.outerHeight();
            $contentBody = opts.contentBody instanceof $ ? opts.contentBody : $(opts.contentBody);
            contentBodyHeight = $contentBody.outerHeight();

            video.addEventListener('loadedmetadata', function() {
                videoDuration = video.duration;
                $container.scroll(
                    window.requestAnimationFrame ?
                    function() {
                        requestAnimationFrame(seekBackgroundVideo);
                    } : seekBackgroundVideo
                );
                $self.trigger('loaded');
            });

            if (opts.preload) {
                preload();
            } else {
                video.src = getPlayableVideoUrl();
            }

            $container.resize(function() {
                containerHeight = $container.outerHeight();
            });
            $contentBody.resize(function() {
                contentBodyHeight = $contentBody.outerHeight();
            });
        }

        function getMimeType(url) {
            return extMimeMap[url.split('.').pop()];
        }

        function getPlayableVideoUrl() {
            var i;
            var len;
            var url;
            var urls;

            urls = opts.urls;
            len = urls.length;

            for (i = 0; i < len; i+=1) {
                url = urls[i];
                if (video.canPlayType(getMimeType(url))) {
                    return url;
                }
            }

            throw new Error('Unable to play any of the urls provided');
        }

        function preload() {
            var request = new XMLHttpRequest();
            var url;

            request.onload = function() {
                video.src = URL.createObjectURL(request.response);
            };

            url = getPlayableVideoUrl();

            request.open('GET', url);
            request.responseType = 'blob';
            request.send();
        }

        function seekBackgroundVideo() {
            var scrollPercentage;
            var seekTo;

            scrollPercentage = $container.scrollTop() / (contentBodyHeight - containerHeight);
            seekTo = videoDuration * scrollPercentage;
            video.currentTime = seekTo;
        }

        $self = this;
        _init();
    };

    $.fn.scrub.defaults = {
        preload: true,
        container: $(window),
        contentBody: $(document),
        urls: []
    };
}));
