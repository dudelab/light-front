
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
        document.querySelectorAll('.cards-carousel').forEach(carousel => new initCardsCarousel(carousel));
    });
})();

class initCardsCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.currentType = this.getCurrentType();
        this.typeButtons = carousel.querySelectorAll('.type');
        if (!this.typeButtons || this.typeButtons.length === 0) {
            console.warn('Nessun pulsante di tipo trovato nel carosello');
            return;
        }
        this.typeLinks = [];

        this.typeButtons.forEach((b) => {
            const typeLink = b.getAttribute("data-link");
            const typeCtaText = b.getAttribute("data-link-text");
            this.typeLinks.push({ link: typeLink, text: typeCtaText});

            b.addEventListener('click', this.changeType.bind(this))
        })
        this.updateActiveButton();
        this.filterTypes();
        this.updateCta();
    }

    changeType (button) {
        const newValue = button.target.getAttribute("data-link-type") || 0;
        this.setCurrentType(newValue);
        this.updateActiveButton();
        this.filterTypes();
        this.updateCta();
    }

    getCurrentType () {
        const carouselLink = this.carousel.querySelector('[data-current-type]')
        let currentType = "0";
        if (carouselLink) currentType = carouselLink.getAttribute("data-current-type");
        return currentType
    }

    setCurrentType (value) {
        const carouselLink = this.carousel.querySelector('[data-current-type]')
        if (!carouselLink) {
            console.warn('Elemento data-current-type non trovato nel carosello');
            return;
        }
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

    updateCta () {
        if (!this.typeLinks[this.currentType]?.link) return;
        const ctaTag = this.carousel.querySelector('.header .link');
        if (!ctaTag) {
            console.warn('Elemento CTA link non trovato nel carosello');
            return;
        }
        const ctaTextTag = ctaTag.querySelector('.text');
        if (!ctaTextTag) {
            console.warn('Elemento testo CTA non trovato nel carosello');
            return;
        }
        ctaTag.href = this.typeLinks[this.currentType].link;
        ctaTextTag.innerHTML = this.typeLinks[this.currentType].text;
    }

    filterTypes () {
        const allSlides = this.carousel.querySelectorAll('[data-type]');
        if (!allSlides || allSlides.length === 0) {
            console.warn('Nessun elemento con attributo data-type trovato nel carosello');
            return;
        }
        allSlides.forEach((group) => {
            const currentType = group.getAttribute("data-type");
            console.log()
            if (currentType !== this.currentType) {
                group.style.display = 'none';
                group.classList.remove('container');
                group.classList.add('container-inactive');
            }
            if (currentType === this.currentType) {
                group.style.display = 'flex';
                group.classList.remove('container-inactive');
                group.classList.add('container');
            }
        })
        new CardsCarousel(this.carousel);
    }

}

class CardsCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.container = carousel.querySelector('.container');
        if (!this.container) {
            console.warn('Contenitore non trovato nel carosello');
            return;
        }
        this.prevBtn = carousel.querySelector('.prev');
        if (!this.prevBtn) {
            console.warn('Pulsante precedente non trovato nel carosello');
            return;
        }
        this.nextBtn = carousel.querySelector('.next');
        if (!this.nextBtn) {
            console.warn('Pulsante successivo non trovato nel carosello');
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