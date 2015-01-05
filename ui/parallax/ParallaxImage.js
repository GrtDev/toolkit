/**
 * Created by gfokke on 25/11/14.
 */

function ParallaxImage(image, container, strengthPerc) {

    var _image      = image;
    var _container  = container;
    var _strengthPerc = strengthPerc || .25;
    var _boundingRect;

    _image.style.height = 100 + 100 * (_strengthPerc * 2) + '%';
    _image.style.top = -_strengthPerc * 100 + '%';

    this.update = function () {
        _boundingRect = _container.getBoundingClientRect();

        // check if element is within viewport
        if (true || _boundingRect.top <= window.innerHeight && _boundingRect.bottom >= 0) {

            _image.style.transform = 'translate3D(0px,' + _boundingRect.top * _strengthPerc + 'px,0px)';
        }
    }

    this.destruct = function () {
        //TODO
    }
}

module.exports = ParallaxImage;