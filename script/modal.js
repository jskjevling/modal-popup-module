/* global Element */

(function () {
  'use strict';

  var modal = {
    modalBlock: document.querySelector('.ngbf-modal-popup'),
    modalTitle: document.querySelector('.ngbf-modal-popup-title'),
    modalContent: document.querySelector('.ngbf-modal-popup-content'),
    modalIsVisible: false,
    modalElement: {},

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
    /* Bind the listeners to the document for delegation */
    bindListeners: function bindListeners () {
      document.addEventListener('click', this.triggerModal.bind(this), false);
      document.addEventListener('click', this.clearModal.bind(this), false);
    },
    fadeModal: function fadeModal () {
      this.modalBlock.style.opacity = '1';
    },
    triggerModal: function triggerModal (e) {
      this.modalElement = e.target.closest('.modal-element');
      if (this.modalElement) {
        this.showModal(this.modalElement, e);
      }
    },
    showModal: function showModal (target, e) {
      var modalTitle = target.getAttribute('data-modalTitle');
      var modalContent = target.getAttribute('data-modalContent');
      this.modalTitle.innerHTML = modalTitle;
      this.modalContent.innerHTML = modalContent;
      this.modalBlock.style.display = 'block';
      this.modalBlock.style.zIndex = '999999';
      this.fadeModal();
    },
    clearModal: function clearModal (target, e) {
      this.closeButton = e.target.closest('.ngbf-modal-popup-close');
      if (this.modalIsVisible) {
        this.modalTitle.innerHTML = '';
        this.modalContent.innerHTML = '';
        this.modalBlock.style.display = 'none';
        this.modalBlock.style.zIndex = '-1';
        this.modalBlock.style.opacity = '0';
        this.modalIsVisible = false;
      }
    },
    /* Initialization steps */
    initialize: function initialize () {
      this.polyfills();
      this.bindListeners();
    }
  };

  modal.initialize();
}());
