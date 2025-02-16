(function() {
    ComponentRegistry.register('header', {
        beforeMount($element, data) { this.data = data; },
        mounted($element, data) {
            this.$element = $element;
            
            // Mobile menu toggle
            this.$element.find('.menu-toggle').on('click', () => 
                this.$element.find('.mobile-menu').toggleClass('show'));

            // Menu items
            this.$element.find('.menu-item > a').on('click', (e) => {
                e.preventDefault();
                const $parent = $(e.currentTarget).parent();
                this.$element.find('.menu-item').removeClass('active open');
                if (!$parent.hasClass('open')) $parent.addClass('active open');
            });

            // Language selector
            const $selector = this.$element.find('.language-selector');
            $selector.on('click', (e) => {
                e.stopPropagation();
                $selector.toggleClass('open');
            });
            this.$element.find('.language-dropdown li').on('click', (e) => 
                $selector.find('span').text($(e.currentTarget).text()));

            // Click outside
            $(document).on('click', e => {
                const $target = $(e.target);
                if (!$target.closest('.menu-item').length) 
                    this.$element.find('.menu-item').removeClass('active open');
                if (!$target.closest('.language-selector').length) 
                    $selector.removeClass('open');
            });
        },
        beforeDestroy() {
            this.$element.find('.menu-toggle, .menu-item > a, .language-selector, .language-dropdown li').off();
            $(document).off('click');
        }
    });
})();