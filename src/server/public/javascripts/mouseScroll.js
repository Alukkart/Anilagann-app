(function() {

    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.getElementById('genre-cards').scrollLeft -= (delta*30);
        e.preventDefault();
    }
    if (document.getElementById('genre-cards').addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.getElementById('genre-cards').addEventListener("mousewheel", scrollHorizontally, false);
        // Firefox
        document.getElementById('genre-cards').addEventListener("DOMMouseScroll", scrollHorizontally, false);
    } else {
        // IE 6/7/8
        document.getElementById('genre-cards').attachEvent("onmousewheel", scrollHorizontally, {passive: true});
    }

})();