scrub.js ![](logo.png)
==================
Map scroll progress to a video timeline. As seen on http://useallfive.com/process/.

## Examples
[Video mapped to document scroll](https://useallfive.github.io/scrub.js/document-example.html)

[Video mapped to div scroll](https://useallfive.github.io/scrub.js/inside-div-example.html)


# Usage

## Options
* **`preload`**: Download the entire video file into browser memory, and use its object URL as the video source. Yields best scrubbing performance.
    * default: `true`
* **`container`**: The viewable 'window' of the scrollable content.
    * default: `$(window)` 
* **`contentBody`**: The scrollable content body within `container`.
    * default: `$(document)` 
* **`urls`**: Array of video asset URLs.
    * default: `[]` 

## Setup
### Include plugin after jQuery.
```html
<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="dist/scrub.min.js"></script>
```

### Add video element. (Minimum markup)
```html
<!-- ... -->
<video id="background"></video>
<!-- ... -->
```

# Code samples
### Map video `currentTime` to document scroll progress (default)
[Working example](https://useallfive.github.io/scrub.js/document-example.html)

Javascript
```javascript
var $video = $('#background');
$video.scrub({
    urls: [
        'aboutBg.mov',
        'aboutBg.ogv'
    ]
});
```

### Map video `currentTime` to an element's scroll progress.
[Working example](https://useallfive.github.io/scrub.js/inside-div-example.html)

Example scrollable div markup
```html
<html>
  <head>
    <style type="text/css">
      #container {
        overflow: scroll;
      }
    </style>
  </head>
  <!-- ... -->
    <video id="background"></video>
    <!-- Scrollable container (with overflow scroll) -->
    <div id="container">
        <!-- Scrollable content body -->
        <div id="content"></div>
    </div>
    <!-- ... -->
```

Javascript
```javascript
var $video = $('#background');
$video.scrub({
    container: '#container',
    contentBody: '#content',
    urls: [
        'aboutBg.mov',
        'aboutBg.ogv'
    ]
});
```

### Video ready event
The jQuery selector on which the plugin was called will trigger a `loaded` event once scrubbing functionality has been bound. Be sure to bind to the `loaded` event before calling `scrub()` to ensure that the loaded event doesn't fire before the custom event is bound.
```javascript
// Assume #loading is some div containing a loading indicator
var $loading = $('#loading');
var $video = $('#video');
// Bind to the `loaded` event before calling scrub to ensure that the 
// loaded event doesn't fire before the custom event is bound.
$video.on('loaded', function() {
    $loading.hide();
    $video.show();
});
// ...
$video.scrub({ // ...
```
