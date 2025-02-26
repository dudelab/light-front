
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('comments', {
        mounted(element, data) {
            new CommentSliderCarousel(element);
        }
    });
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[comments-carousel]').forEach(carousel => new CommentSliderCarousel(carousel));
    });
})();

class CommentSliderCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.slidesContainer = carousel.querySelector('[comments-carousel-container]');
        this.currentSlide = 0;
        this.numSlides = this.slidesContainer.children.length;

        const prevBtn = carousel.querySelector('.prevBtn');
        const nextBtn = carousel.querySelector('.nextBtn');

        prevBtn.addEventListener('click', this.handlePrevClick.bind(this))
        nextBtn.addEventListener('click', this.handleNextClick.bind(this))
    }
  

    handlePrevClick(){
        if(this.currentSlide === 0) this.currentSlide = this.numSlides - 1;
        else this.currentSlide--;
        
        this.carousel.style.setProperty('--current-slide', this.currentSlide);
    }


    handleNextClick(){
        if(this.currentSlide == this.numSlides -1) this.currentSlide = 0;
        else this.currentSlide++;
        this.carousel.style.setProperty('--current-slide', this.currentSlide);
    }
  

}