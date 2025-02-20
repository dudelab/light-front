(function() {
    ComponentRegistry.register('header', {
        beforeMount(element, data) { 
            this.data = data; 
        },

        mounted(element, data) {
            this.element = element;

            // Mobile menu toggle
            const menuToggle = this.element.querySelector('.menu-toggle');
            const mobileMenu = this.element.querySelector('.mobile-menu');
            menuToggle?.addEventListener('click', () => {
                mobileMenu?.classList.toggle('show');
            });

            // Menu items
            const menuItems = this.element.querySelectorAll('.menu-item > a');
            menuItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const parent = e.currentTarget.parentElement;
                    
                    // Remove active/open from all menu items
                    this.element.querySelectorAll('.menu-item').forEach(item => {
                        item.classList.remove('active', 'open');
                    });

                    // Add active/open to clicked item if not already open
                    if (!parent.classList.contains('open')) {
                        parent.classList.add('active', 'open');
                    }
                });
            });

            // Language selector
            const selector = this.element.querySelector('.language-selector');
            selector?.addEventListener('click', (e) => {
                e.stopPropagation();
                selector.classList.toggle('open');
            });

            // Language dropdown items
            const languageItems = this.element.querySelectorAll('.language-dropdown li');
            const selectorSpan = selector?.querySelector('span');
            languageItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (selectorSpan) {
                        selectorSpan.textContent = item.textContent;
                    }
                });
            });

            // Click outside handlers
            const handleOutsideClick = (e) => {
                // Close menu items if clicked outside
                if (!e.target.closest('.menu-item')) {
                    this.element.querySelectorAll('.menu-item').forEach(item => {
                        item.classList.remove('active', 'open');
                    });
                }

                // Close language selector if clicked outside
                if (!e.target.closest('.language-selector') && selector) {
                    selector.classList.remove('open');
                }
            };

            document.addEventListener('click', handleOutsideClick);

            // Store event listeners for cleanup
            this._cleanup = () => {
                menuToggle?.removeEventListener('click', () => {});
                menuItems.forEach(item => item.removeEventListener('click', () => {}));
                selector?.removeEventListener('click', () => {});
                languageItems.forEach(item => item.removeEventListener('click', () => {}));
                document.removeEventListener('click', handleOutsideClick);
            };
        },

        beforeDestroy() {
            // Clean up all event listeners
            if (this._cleanup) {
                this._cleanup();
            }
        }
    });
})();