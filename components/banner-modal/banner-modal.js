if (typeof ComponentRegistry !== 'undefined') {
  ComponentRegistry.register('banner-modal', {
      mounted(element, data) {
          new initBannerModal(element);
      }
  });
}

(function() {
  document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.banner-modal').forEach(banner => new initBannerModal(banner));
  });
})();


class initBannerModal {
  constructor(banner) {
    this.banner = banner;
    this.modalOverlay = banner.querySelector('.modal-overlay');
    if (!this.modalOverlay) {
      console.warn('Modal overlay element not found');
      return;
    }
    this.showModalButton = banner.querySelectorAll('.toggleModal');
    this.closeModalButton = banner.querySelectorAll('.closeModal');
    if (this.showModalButton.length === 0) {
      console.warn('No toggle modal buttons found');
      return;
    }

    if (this.closeModalButton.length === 0) {
      console.warn('No close modal buttons found');
      return;
    }

    this.showModalButton.forEach(butt => butt.addEventListener('click', this.openModal.bind(this)));
    this.closeModalButton.forEach(butt => butt.addEventListener('click', this.closeModal.bind(this)));

    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('fade-in')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modalOverlay.classList.add('fade-in');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.modalOverlay.classList.remove('fade-in');
    document.body.style.overflow = ''; // Restore scrolling
  }
}