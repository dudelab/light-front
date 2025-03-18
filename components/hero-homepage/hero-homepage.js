
if (typeof ComponentRegistry !== 'undefined') {
  ComponentRegistry.register('hero-homepage', {
      mounted(element, data) {
          new HeroHomepageCarousel(element.querySelectorAll('[data-carousel]')[0]);
      }
  });
}

(function() {
  document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.hero-homepage [data-carousel]').forEach(carousel => new HeroHomepageCarousel(carousel));
  });
})();


class HeroHomepageCarousel {
  constructor(carousel) {
    this.carousel = carousel;
    this.slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
    this.paginationContainer = carousel.querySelector('[data-carousel-pagination]');
    if (!this.slidesContainer) {
      console.warn('Missing [data-carousel-slides-container] element in carousel');
      return;
    }
    if (!this.paginationContainer) {
      console.warn('Missing [data-carousel-pagination] element in carousel');
      return;
    }
    this.currentSlide = 0;
    this.numSlides = this.slidesContainer.children.length;
    this.autoScrollInterval = null;

    // this.createDots();
    this.loadDots();
    this.updateSlide();
    this.updateActiveDot();

    this.paginationContainer.addEventListener('click', this.handleDotClick.bind(this));

  }

  createDots() {
    this.paginationContainer.innerHTML = '';
    for (let i = 0; i < this.numSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      dot.innerHTML ='<i class="fa-solid fa-rocket"></i>'
      this.paginationContainer.appendChild(dot);
    }
  }

  loadDots() {
    const dots = this.paginationContainer.querySelectorAll('.carousel-dot i')
    if (!dots || dots.length === 0) {
      console.warn('No dots found in pagination container');
      return;
    }
    this.paginationContainer.innerHTML = '';
    for (let i = 0; i < this.numSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      dot.innerHTML = `<i class="${dots[i].className}" style="pointer-events: none;"></i>`;
      this.paginationContainer.appendChild(dot);
    }
  }

  updateActiveDot() {
    const dots = this.paginationContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove('active');
    }
    dots[this.currentSlide].classList.add('active');
  }

  handleDotClick(event) {
    if (event.target.classList.contains('carousel-dot')) {
      const dots = this.paginationContainer.children;
      for (let i = 0; i < dots.length; i++) {
        if (dots[i] === event.target) {
          this.currentSlide = i;
          this.updateSlide();
          this.updateActiveDot();
        }
      }
    }
  }

  updateSlide() {
    const slides = this.slidesContainer.children;
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
    }
    slides[this.currentSlide].classList.add('active');
  }
}