/* global Element */

(function () {
  'use strict';

  var hover = {
    /* The body element that the hover text will be appended to */
    docBody: document.querySelector('body'),
    /* Holds the dimensions from the edges of the target element to the edge of the viewport */
    surrDimensions: {},
    /* Holds the widest and tallest dimension around the related link or button in the viewport */
    maxDimensions: {},
    /* A debugging tool to visually see the dimensions that are being chosen for hoverText placement */
    rulers: {},
    /* Is the mouse still in hover state, used for check after delay */
    isHovering: false,
    /* Track whether or not the hovertext is actually shown, used for clear method */
    hoverIsVisible: false,
    /* The hoverText element built by the triggerHover method, we keep a reference so we can
     * remove the hoverText on mouseOut */
    hoverElement: {},
    /* Delay hovertext display by this amount (milliseconds) */
    waitTime: 2000,
    /* If set to true, use the mouse coordinates instead of the target element position */
    useMouseCoords: false,

    polyfills: function polyfills () {
      /* We need to make sure Element.matches is implemented, so we use this polyfill */
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
          };
      }
       // closest polyfill
      Element.prototype.closest = Element.prototype.closest ||
        function (selector) {
          var el = this;

          while (el.matches && !el.matches(selector)) el = el.parentNode;
          return el.matches ? el : null;
        };
    },
    /* Received boolean from the event listener to determine cursor hover state and call the appropriate action */
    toggleHover: function toggleHover (hoverState, e) {
      var hoverElement = e.target.closest('.hover-element');
      if (hoverElement) {
        this.isHovering = hoverState;
        if (hoverState) {
          this.triggerHover(hoverElement, e);
        } else {
          this.clearHover(hoverElement, e);
        }
      }
    },
    /* Bind the listeners to the document for delegation */
    bindListeners: function bindListeners () {
      document.addEventListener('mouseover', this.toggleHover.bind(this, true), false);
      document.addEventListener('mouseout', this.toggleHover.bind(this, false), false);
      document.addEventListener('click', this.toggleHover.bind(this, false), false);
    },
    /* The hover text uses CSS transitions for animation, so by applying a solid opacity, we fade it onscreen */
    fadeHover: function fadeHover () {
      this.hoverElement.style.opacity = '1';
    },
    /* Helper function. Tests two dimensions and returns the larger of the two */
    testPoints: function testPoints (p1, p2) {
      return p1 > p2 ? p1 : p2;
    },
    /* Method for calculating the distance to viewport bounds from the target element, used for placing hoverText */
    findMax: function findMax (eTop, eLeft, eBottom, eRight, viewWidth, viewHeight) {
      return {
        max: {
          width: this.testPoints(eLeft, (viewWidth - eRight)),
          height: this.testPoints(eTop, (viewHeight - eBottom))
        },
        surr: {
          top: eTop,
          left: eLeft,
          bottom: viewHeight - eBottom,
          right: viewWidth - eRight
        }
      };
    },
    /* Mount and display the hover text */
    mountHover: function mountHover (target, relativePosition, w, h) {
      if (this.isHovering) {
        this.docBody.appendChild(this.hoverElement);
        this.hoverElement.style.display = 'block';
        /* Calculate where the text will fit best and position accordingly. First, compare the max width value
         * against the space to the left of the target element to see if that's the widest dimension */
        if (this.maxDimensions.width === relativePosition.left) {
          /* Make sure the text will fit in the available space, but place it at the left viewport edge
           * if it exceeds the available space. */
          if (this.maxDimensions.width >= this.hoverElement.offsetWidth) {
            /* Text will fit, so align right edge to left edge of target element */
            this.hoverElement.style.left = (this.maxDimensions.width - this.hoverElement.offsetWidth).toString() + 'px';
          } else {
            /* Text won't fit, align to viewport left */
            this.hoverElement.style.left = '0';
          }
        } else {
          /* Right space is widest dimension, so check if text will fit */
          if (this.maxDimensions.width >= this.hoverElement.offsetWidth) {
            /* Text will fit, so we align left edge to the right edge of target element */
            this.hoverElement.style.left = Math.floor(relativePosition.right).toString() + 'px';
          } else {
            /* Text won't fit, so we align the right edge to the right edge of the viewport */
            this.hoverElement.style.left = (w - this.hoverElement.offsetWidth).toString() + 'px';
          }
        }
        /* Check if the top space is the tallest dimension */
        if (this.maxDimensions.height === relativePosition.top) {
          /* Top is tallest, see if text will fit */
          if (this.maxDimensions.height >= this.hoverElement.offsetHeight) {
            /* Text fits, so position above the target element */
            this.hoverElement.style.top = (this.maxDimensions.height - this.hoverElement.offsetHeight).toString() + 'px';
          } else {
            /* Text does not fit, so position at top of viewport */
            this.hoverElement.style.top = '0';
          }
        } else {
          /* Bottom is tallest, see if test will fit */
          if (this.maxDimensions.height >= this.hoverElement.offsetHeight) {
            /* Text will fit, so position hoverText below target element */
            this.hoverElement.style.top = Math.floor(relativePosition.bottom).toString() + 'px';
          } else {
            /* Text won't fit, so position at the bottom of the viewport */
            this.hoverElement.style.top = (h - this.hoverElement.offsetHeight).toString() + 'px';
          }
        }
        setTimeout(this.fadeHover.bind(this), 100);
        this.hoverIsVisible = true;
      }
    },
    /* Called on mouseOver when target element matches a link or button with associated hover text */
    triggerHover: function triggerHover (target, e) {
      var relativePosition = {};
      if (this.useMouseCoords) {
        relativePosition = {
          top: e.clientY,
          left: e.clientX,
          bottom: e.clientY + 1,
          right: e.clientX + 1
        };
      } else {
        relativePosition = target.getBoundingClientRect();
      }
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      var hoverText = target.getAttribute('data-hover-content');

      /* Calculate dimensions and max dimensions */
      var returnValues = this.findMax(relativePosition.top, relativePosition.left, relativePosition.bottom, relativePosition.right, w, h);
      /* Apply results for later reference by mountHover method */
      this.maxDimensions = returnValues.max;
      this.surrDimensions = returnValues.surr;
      /* Generate the hoverText element */
      this.hoverElement = document.createElement('div');
      this.hoverElement.innerHTML = hoverText;
      this.hoverElement.classList.add('hover-block');
      /* After the specified wait time, show the hoverText */
      setTimeout(this.mountHover.bind(this, target, relativePosition, w, h), this.waitTime);
    },
    /* Remove the hover text on mouseOut */
    clearHover: function clearHover (target, e) {
      if (this.hoverIsVisible) {
        this.docBody.removeChild(this.hoverElement);
        this.hoverIsVisible = false;
      }
    },
    /* Initialization steps */
    initialize: function initialize () {
      this.polyfills();
      this.bindListeners();
    }
  };

  hover.initialize();
}());
