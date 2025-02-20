(function() {
    ComponentRegistry.register('cards-carousel', {
        beforeMount(element, data) {
            this.scrollAmount = 0;
        },
        
        mounted(element, data) {
            const $element = $(element)
            const $container = $element.find('.cards-carousel-container');
            const $types = $element.find('.cards-carousel-types');
            
            // Setup carousel navigation
            this.setupCarouselNavigation($container, $element);
            
            // Setup type switching
            this.setupTypeSwitch($element, $types, data);
            
            // Initialize with first type's content
            if (data && data.types && data.types.length > 0) {
                const firstType = data.types[0];
                
                // Mark first type as active
                $types.find('.cards-carousel-type').first().addClass('active');
                
                // Set initial loaded type
                $container.data('loaded-type', firstType.name);
                
                // Load initial cards
                this.updateCards($container, firstType.items);
            }
        },
        
        setupCarouselNavigation($container, $element) {
            const $prevBtn = $element.find('.prevBtn');
            const $nextBtn = $element.find('.nextBtn');
            
            const getCardWidth = () => {
                const $card = $container.find('.card-item').first();
                return $card[0].offsetWidth + 20; // Include gap
            };
            
            $prevBtn.on('click', () => {
                this.scrollAmount = Math.max(0, this.scrollAmount - getCardWidth());
                $container.animate({ scrollLeft: this.scrollAmount }, 300);
            });
            
            $nextBtn.on('click', () => {
                const maxScroll = $container[0].scrollWidth - $container[0].clientWidth;
                this.scrollAmount = Math.min(maxScroll, this.scrollAmount + getCardWidth());
                $container.animate({ scrollLeft: this.scrollAmount }, 300);
            });
        },
        
        setupTypeSwitch($element, $types, data) {
            const self = this;
            
            $types.on('click', '.cards-carousel-type', function(e) {
                e.preventDefault();
                const $type = $(this);
                const typeName = $type.text().trim();
                const typeLink = $type.data('link');
                
                // Update active state
                $types.find('.cards-carousel-type').removeClass('active');
                $type.addClass('active');
                
                // Update "View All" link
                const $link = $element.find('.cards-carousel-link');
                $link.attr('href', typeLink);
                $link.find('.text').text(`Tutti i ${typeName.toLowerCase()}`);
                
                // Only reload if type changed
                const $container = $element.find('.cards-carousel-container');
                if ($container.data('loaded-type') === typeName) return;
                
                // Update loaded type
                $container.data('loaded-type', typeName);
                
                // Reset scroll
                self.scrollAmount = 0;
                $container.scrollLeft(0);
                
                // Find type data and update content
                const typeData = data.types.find(t => t.name === typeName);
                if (typeData) {
                    self.updateCards($container, typeData.items);
                }
            });
        },
        
        updateCards($container, items) {
            $container.empty();
            
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
                $container.append(cardHtml);
            });
        },
        
        beforeDestroy(element) {
            // Clean up event listeners
            $(element).find('.prevBtn, .nextBtn, .cards-carousel-type').off();
        }
    });
})();