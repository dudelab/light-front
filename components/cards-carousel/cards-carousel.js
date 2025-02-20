(function() {
    ComponentRegistry.register('cards-carousel', {
        beforeMount(element, data) {
            this.scrollAmount = 0;
        },
        
        mounted(element, data) {
            const container = element.querySelector('.cards-carousel-container');
            const types = element.querySelector('.cards-carousel-types');
            
            // Setup carousel navigation
            this.setupCarouselNavigation(container, element);
            
            // Setup type switching
            this.setupTypeSwitch(element, types, data);
            
            // Initialize with first type's content
            if (data?.types?.length > 0) {
                const firstType = data.types[0];
                
                // Mark first type as active
                types.querySelector('.cards-carousel-type')?.classList.add('active');
                
                // Set initial loaded type
                container.dataset.loadedType = firstType.name;
                
                // Load initial cards
                this.updateCards(container, firstType.items);
            }
        },
        
        setupCarouselNavigation(container, element) {
            const prevBtn = element.querySelector('.prevBtn');
            const nextBtn = element.querySelector('.nextBtn');
            
            const getCardWidth = () => {
                const card = container.querySelector('.card-item');
                return card.offsetWidth + 20; // Include gap
            };
            
            const handlePrevClick = () => {
                this.scrollAmount = Math.max(0, this.scrollAmount - getCardWidth());
                this.animateScroll(container, this.scrollAmount);
            };
            
            const handleNextClick = () => {
                const maxScroll = container.scrollWidth - container.clientWidth;
                this.scrollAmount = Math.min(maxScroll, this.scrollAmount + getCardWidth());
                this.animateScroll(container, this.scrollAmount);
            };
            
            prevBtn?.addEventListener('click', handlePrevClick);
            nextBtn?.addEventListener('click', handleNextClick);
            
            // Store event listeners for cleanup
            this._cleanup = {
                prevClick: handlePrevClick,
                nextClick: handleNextClick
            };
        },
        
        setupTypeSwitch(element, types, data) {
            const handleTypeClick = (e) => {
                e.preventDefault();
                const typeElement = e.target.closest('.cards-carousel-type');
                if (!typeElement) return;
                
                const typeName = typeElement.textContent.trim();
                const typeLink = typeElement.dataset.link;
                
                // Update active state
                types.querySelectorAll('.cards-carousel-type').forEach(el => {
                    el.classList.remove('active');
                });
                typeElement.classList.add('active');
                
                // Update "View All" link
                const link = element.querySelector('.cards-carousel-link');
                const linkText = element.querySelector('.cards-carousel-link .text');
                if (link) link.href = typeLink;
                if (linkText) linkText.textContent = `Tutti i ${typeName.toLowerCase()}`;
                
                // Only reload if type changed
                const container = element.querySelector('.cards-carousel-container');
                if (container.dataset.loadedType === typeName) return;
                
                // Update loaded type
                container.dataset.loadedType = typeName;
                
                // Reset scroll
                this.scrollAmount = 0;
                container.scrollLeft = 0;
                
                // Find type data and update content
                const typeData = data.types.find(t => t.name === typeName);
                if (typeData) {
                    this.updateCards(container, typeData.items);
                }
            };
            
            types?.addEventListener('click', handleTypeClick);
            
            // Store event listener for cleanup
            this._cleanup = {
                ...this._cleanup,
                typeClick: handleTypeClick
            };
        },
        
        updateCards(container, items) {
            container.innerHTML = '';
            
            items.forEach(item => {
                const cardHtml = `
                    <div class="card-item">
                        <div class="card-item-image" style="background-image: url(${item.image})">
                            <div class="card-item-image-tags">
                                ${(item.imageTag || []).map(tag => `
                                    <span class="card-item-image-tag">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="card-item-infos">
                            <div class="card-item-tag-container">
                                ${item.date ? `
                                    <div class="card-item-date-c">
                                        <div class="card-item-date">
                                            <i class="fa-solid fa-calendar"></i> ${item.date}
                                        </div>
                                    </div>
                                ` : ''}
                                <div class="card-item-tags">
                                    ${item.tag ? `
                                        <span class="card-item-tag">${item.tag}</span>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="card-item-title">${item.description}</div>
                            <a class="card-item-link" href="${item.link}">
                                Leggi <i class="fa-solid fa-arrow-up rotate-45"></i>
                            </a>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHtml);
            });
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
                const prevBtn = element.querySelector('.prevBtn');
                const nextBtn = element.querySelector('.nextBtn');
                const types = element.querySelector('.cards-carousel-types');
                
                if (prevBtn && this._cleanup.prevClick) {
                    prevBtn.removeEventListener('click', this._cleanup.prevClick);
                }
                if (nextBtn && this._cleanup.nextClick) {
                    nextBtn.removeEventListener('click', this._cleanup.nextClick);
                }
                if (types && this._cleanup.typeClick) {
                    types.removeEventListener('click', this._cleanup.typeClick);
                }
            }
        }
    });
})();