(function() {
    ComponentRegistry.register('features-home', {
        beforeMount(element, data) {
            this.scrollAmount = 0;
        },

        mounted(element, data) {
            // Setup carousel navigation
            this.setupCarousel(element);
        },

        setupCarousel(element) {
            const container = element.querySelector('.features-container');
            const prevBtn = element.querySelector('.prev');
            const nextBtn = element.querySelector('.next');
            
            // Add last-item class to last card
            const cards = container.querySelectorAll('.card');
            cards[cards.length - 1].classList.add('last-item');

            // Get card width including gap
            const getCardWidth = () => {
                const card = container.querySelector('.card');
                const style = window.getComputedStyle(card);
                const marginLeft = parseFloat(style.marginLeft);
                const marginRight = parseFloat(style.marginRight);
                return card.offsetWidth + marginLeft + marginRight;
            };

            prevBtn?.addEventListener('click', () => {
                this.scrollAmount = Math.max(0, this.scrollAmount - getCardWidth());
                this.animateScroll(container, this.scrollAmount);
            });

            nextBtn?.addEventListener('click', () => {
                const maxScroll = container.scrollWidth - container.clientWidth;
                this.scrollAmount = Math.min(maxScroll, this.scrollAmount + getCardWidth());
                this.animateScroll(container, this.scrollAmount);
            });

            // Store event listeners for cleanup
            this._cleanup = {
                prevClick: prevBtn?.onclick,
                nextClick: nextBtn?.onclick
            };
        },

        // Custom scroll animation function to replace jQuery's animate
        animateScroll(element, targetScroll, duration = 300) {
            const start = element.scrollLeft;
            const change = targetScroll - start;
            const startTime = performance.now();

            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                element.scrollLeft = start + change * easeInOutQuad(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        },

        beforeDestroy(element) {
            // Clean up event listeners
            if (this._cleanup) {
                const prevBtn = element.querySelector('.prev');
                const nextBtn = element.querySelector('.next');
                
                if (prevBtn && this._cleanup.prevClick) {
                    prevBtn.removeEventListener('click', this._cleanup.prevClick);
                }
                if (nextBtn && this._cleanup.nextClick) {
                    nextBtn.removeEventListener('click', this._cleanup.nextClick);
                }
            }
        }
    });
})();