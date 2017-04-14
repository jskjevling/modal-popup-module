/* global Element */

(function () {
  'use strict';

  var modal = {
    /* The HTML element that will contain our modal content */
    modalBlock: document.querySelector('.ngbf-modal-popup'),
    /* The title area for the modal */
    modalTitle: document.querySelector('.ngbf-modal-popup-title'),
    /* The content area for the modal */
    modalContent: document.querySelector('.ngbf-modal-popup-content'),
    /* Boolean to track visibility, not currently used, but here in case */
    modalIsVisible: false,
    /* The calling element that triggered the modal */
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
    /* Method for handling styling when modal is shown */
    fadeModal: function fadeModal () {
      this.modalBlock.style.display = 'block';
      this.modalBlock.style.zIndex = '999999';
      this.modalBlock.style.opacity = '1';
      this.modalIsVisible = true;
    },
    /* Reset to defaults, remove inline styling */
    resetModal: function resetModal () {
      this.modalTitle.innerHTML = '';
      this.modalContent.innerHTML = '';
      this.modalBlock.style.display = '';
      this.modalBlock.style.zIndex = '';
      this.modalIsVisible = false;
    },
    /* Wait for transition to complete before resetting modal */
    hideModal: function hideModal () {
      this.modalBlock.style.opacity = '';
      setTimeout(this.resetModal.bind(this), 500);
    },
    /* Verify the type of element being clicked, and if it's a modal element, show the modal */
    triggerModal: function triggerModal (e) {
      this.modalElement = e.target.closest('.modal-element');
      if (this.modalElement) {
        this.showModal(this.modalElement, e);
      }
    },
    /* Use the data attributes to populate the modal with the intended content */
    showModal: function showModal (target, e) {
      var modalTitle = target.getAttribute('data-modal-title');
      var hoverContent = target.getAttribute('data-hover-content');
      var modalContent = target.getAttribute('data-modal-content');
      if (modalTitle && hoverContent && !modalContent) {
        this.modalTitle.innerHTML = modalTitle;
        this.modalContent.innerHTML = hoverContent;
        this.fadeModal();
      } else if (modalTitle && modalContent) {
        this.modalTitle.innerHTML = modalTitle;
        this.modalContent.innerHTML = modalContent;
        this.fadeModal();
      }
    },
    /* Verify that the clicked element is the close button, if so, clear the modal */
    clearModal: function clearModal (e) {
      this.closeButton = e.target.closest('.ngbf-modal-popup-close');
      if (this.closeButton) {
        this.hideModal();
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
