
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

// class HeroHomepageCarousel {
//   constructor(carousel) {
//       this.carousel = carousel;
//       this.slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
//       this.paginationContainer = carousel.querySelector('[data-carousel-pagination]');
//       this.currentSlide = 0;
//       this.numSlides = this.slidesContainer.children.length;

//       this.createDots();
//       this.updateActiveDot();

//       this.paginationContainer.addEventListener('click', this.handleDotClick.bind(this));

//       // this.enableAutoScroll();
//   }

//   createDots() {
//       this.paginationContainer.innerHTML = '';
//       for (let i = 0; i < this.numSlides; i++) {
//       const dot = document.createElement('div');
//       dot.classList.add('carousel-dot');
//       this.paginationContainer.appendChild(dot);
//       }
//   }

//   updateActiveDot() {
//       const dots = this.paginationContainer.children;
//       for (let i = 0; i < dots.length; i++) {
//       dots[i].classList.remove('active');
//       }
//       dots[this.currentSlide].classList.add('active');
//   }

//   handleDotClick(event) {
//       if (event.target.classList.contains('carousel-dot')) {
//           // this.resetAutoScroll();
//           const dots = this.paginationContainer.children;
//           for (let i = 0; i < dots.length; i++) {
//               if (dots[i] === event.target) {
//               this.currentSlide = i;
//               this.carousel.style.setProperty('--current-slide', this.currentSlide);
//               this.updateActiveDot();
//               }
//           }
//       }
//   }

//   enableAutoScroll() {
//       this.autoScrollInterval = setInterval(this.autoScroll.bind(this), 4000); // Scroll every 4 seconds
//   }

//   autoScroll() {
//       this.currentSlide = (this.currentSlide + 1) % this.numSlides;
//       this.carousel.style.setProperty('--current-slide', this.currentSlide);
//       this.updateActiveDot();
//   }

//   resetAutoScroll() {
//       clearInterval(this.autoScrollInterval);
//       this.enableAutoScroll();
//   }
// }


class HeroHomepageCarousel {
  constructor(carousel) {
    this.carousel = carousel;
    this.slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
    this.paginationContainer = carousel.querySelector('[data-carousel-pagination]');
    this.currentSlide = 0;
    this.numSlides = this.slidesContainer.children.length;
    this.autoScrollInterval = null;

    this.createDots();
    this.updateSlide();
    this.updateActiveDot();

    this.paginationContainer.addEventListener('click', this.handleDotClick.bind(this));

  }

  createDots() {
    for (let i = 0; i < this.numSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
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