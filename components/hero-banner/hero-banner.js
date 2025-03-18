
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('hero-banner', {
        mounted(element, data) {
            new CardsCarouselTechnology(element);
        }
    });
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.content .card-container').forEach(carousel => new CardsCarouselTechnology(carousel));
    });
})();

class CardsCarouselTechnology {
    constructor(carousel) {
        this.carousel = carousel;
        this.container = carousel.querySelector('[carousel-container]');
        if (!this.container) {
            console.warn('Elemento container non trovato nel carousel');
            return;
        }
        this.prevBtn = carousel.querySelector('.prevBtn');
        this.nextBtn = carousel.querySelector('.nextBtn');
        if (!this.prevBtn || !this.nextBtn) {
            console.warn('Pulsanti di navigazione non trovati nel carousel');
            return;
        }
        this.scrollAmount = 0;

        this.prevBtn.addEventListener('click', this.prevClickHandler.bind(this));
        this.nextBtn.addEventListener('click', this.nextClickHandler.bind(this));
    }


    getCardWidth () {
        const card = this.container.querySelector('.card');
        if (!card) return 0;

        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const marginLeft = parseFloat(cardStyle.marginLeft);
        const marginRight = parseFloat(cardStyle.marginRight);
        
        return cardWidth + marginLeft + marginRight;
    };

    animateScroll (element, targetScroll) {
        const startPosition = element.scrollLeft;
        const distance = targetScroll - startPosition;
        const duration = 200;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            element.scrollLeft = startPosition + distance * easeInOutCubic;
            
            if (elapsedTime < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    };

    prevClickHandler () {
        this.scrollAmount = Math.max(0, this.scrollAmount - this.getCardWidth());
        this.animateScroll(this.container, this.scrollAmount);
    };
    
    nextClickHandler () {
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        this.scrollAmount = Math.min(maxScroll, this.scrollAmount + this.getCardWidth());
        this.animateScroll(this.container, this.scrollAmount);
    };
    
    
}