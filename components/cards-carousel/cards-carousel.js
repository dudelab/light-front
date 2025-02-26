
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('cards-carousel', {
        mounted(element, data) {
            new initCardsCarousel(element);
            // new CardsCarousel(element);
        }
    });
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.cards-carousel .carousel-wrapper').forEach(carousel => new CardsCarousel(carousel));
    });
})();

class initCardsCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.currentType = this.getCurrentType();
        this.typeButtons = carousel.querySelectorAll('.cards-carousel-type');

        this.typeButtons.forEach((b) => {
            b.addEventListener('click', this.changeType.bind(this))
        })
        this.updateActiveButton();
        this.filterTypes();
    }

    changeType (button) {
        const newValue = button.target.getAttribute("data-link-type");
        this.setCurrentType(newValue);
        this.updateActiveButton();
        this.filterTypes();
    }

    getCurrentType () {
        const carouselLink = this.carousel.querySelector('[data-current-type]')
        const currentType = carouselLink.getAttribute("data-current-type");
        return currentType
    }

    setCurrentType (value) {
        const carouselLink = this.carousel.querySelector('[data-current-type]')
        carouselLink.setAttribute("data-current-type", value);
        this.currentType = value;
    }

    updateActiveButton () {
        this.typeButtons.forEach((button) => {
            const buttonType = button.getAttribute("data-link-type");
            button.classList.remove('active')
            if (buttonType === this.currentType) {
                button.classList.add('active')
            }
        })
    }

    filterTypes () {
        const allSlides = this.carousel.querySelectorAll('[data-type]');
        allSlides.forEach((group) => {
            const currentType = group.getAttribute("data-type");
            console.log()
            if (currentType !== this.currentType) {
                group.style.display = 'none';
                group.classList.remove('cards-carousel-container');
                group.classList.add('cards-carousel-container-inactive');
            }
            if (currentType === this.currentType) {
                group.style.display = 'flex';
                group.classList.remove('cards-carousel-container-inactive');
                group.classList.add('cards-carousel-container');
            }
        })
        new CardsCarousel(this.carousel);
    }

}

class CardsCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.container = carousel.querySelector('.cards-carousel-container');
        this.prevBtn = carousel.querySelector('.prev');
        this.nextBtn = carousel.querySelector('.next');
        this.scrollAmount = 0;

        this.prevBtn.addEventListener('click', this.prevClickHandler.bind(this));
        this.nextBtn.addEventListener('click', this.nextClickHandler.bind(this));
    }


    getCardWidth () {
        const card = this.container.querySelector('.card-item');
        if (!card) return 0;
        
        // Calculate full width including margins
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
    
    // Next button click handler
    nextClickHandler () {
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        this.scrollAmount = Math.min(maxScroll, this.scrollAmount + this.getCardWidth());
        this.animateScroll(this.container, this.scrollAmount);
    };
    
    
}