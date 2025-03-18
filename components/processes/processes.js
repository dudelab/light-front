
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('processes', {
        mounted(element, data) {
            new initProcesses(element);
            //new CardsCarousel(element);
        }
    });
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.processes .carousel-wrapper').forEach(carousel => new initProcesses(carousel));
    });
})();

class initProcesses {
    constructor(carousel) {
        this.carousel = carousel;
        this.typeButtons = carousel.querySelectorAll('.type');

        if (!this.typeButtons || this.typeButtons.length === 0) {
            console.warn('Nessun pulsante di tipo (.type) trovato nel carosello');
            return;
        }
        
        this.currentType = this.typeButtons[0].getAttribute("data-link-type");

        this.typeButtons.forEach((b) => {
            b.addEventListener('click', this.changeType.bind(this))
        })
        this.updateActiveButton();
        this.filterTypes();
    }

    changeType (button) {        
        const newValue = button.target.getAttribute("data-link-type") || 0;
        this.currentType = newValue;
        this.updateActiveButton();
        this.filterTypes();
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
        const allTypes = this.carousel.querySelectorAll('[data-type]');
        if (!allTypes || allTypes.length === 0) {
            console.warn('Nessun elemento con attributo data-type trovato nel carosello');
            return;
        }
        allTypes.forEach((group) => {
            const currentType = group.getAttribute("data-type");
            if (currentType !== this.currentType) {
                group.style.display = 'none';
            }
            if (currentType === this.currentType) {
                group.style.display = 'flex';
                const wrapper = group.querySelector(".carousel-wrapper");
                if (!wrapper) {
                    console.warn('Nessun elemento .carousel-wrapper trovato nel gruppo');
                    return;
                }
                new CardsCarouselProcesses(wrapper);
            }
        })
    }

}

class CardsCarouselProcesses {
    constructor(carousel) {
        this.carousel = carousel;
        this.container = carousel.querySelector('.container');
        if (!this.container) {
            console.warn('Nessun elemento .container trovato nel carosello');
            return;
        }
        
        this.prevBtn = carousel.querySelector('.prev');
        if (!this.prevBtn) {
            console.warn('Nessun pulsante .prev trovato nel carosello');
            return;
        }
        this.nextBtn = carousel.querySelector('.next');
        if (!this.nextBtn) {
            console.warn('Nessun pulsante .next trovato nel carosello');
            return;
        }
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