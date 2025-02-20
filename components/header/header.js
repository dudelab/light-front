if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('header', {
        beforeMount(element, data) {
            this.data = data;
        },
        mounted(element, data) {
            initHeader(element, data);
        }
    });
}

(function() {
    function initHeader(element, data) {
        const $element = $(element);

        // Helper functions for menu state management
        const closeMenuItems = () => $element.find('.menu-item').removeClass('active open');
        const closeLanguageSelector = () => $element.find('.language-selector').removeClass('open');
        const closeMobileMenu = () => $element.find('.mobile-menu').removeClass('show');
        
        const openMenuItem = ($item) => $item.addClass('active open');
        const openLanguageSelector = () => $element.find('.language-selector').addClass('open');
        const openMobileMenu = () => $element.find('.mobile-menu').addClass('show');
        
        const toggleMobileMenu = () => {
            const $mobileMenu = $element.find('.mobile-menu');
            closeMenuItems();
            closeLanguageSelector();
            
            if ($mobileMenu.hasClass('show')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        };
        
        // Mobile menu toggle
        $element.find('.menu-toggle').on('click', toggleMobileMenu);
        
        // Menu items - both desktop and mobile
        $element.find('.menu-item > a').on('click', (e) => {
            e.preventDefault();
            const $parent = $(e.currentTarget).parent();
            
            // If has submenu, toggle it
            if ($parent.find('.submenu').length > 0) {
                if (!$parent.hasClass('open')) {
                    closeLanguageSelector();
                    closeMenuItems();
                    openMenuItem($parent);
                } else {
                    closeMenuItems();
                }
            }
        });
        
        // Language selector
        const $selector = $element.find('.language-selector');
        $selector.on('click', (e) => {
            e.stopPropagation();
            if (!$selector.hasClass('open')) {
                closeMenuItems();
                openLanguageSelector();
            } else {
                closeLanguageSelector();
            }
        });
        
        $element.find('.language-dropdown li').on('click', (e) =>
            $selector.find('span').text($(e.currentTarget).text()));
        
        // Click outside
        $(document).on('click', e => {
            const $target = $(e.target);
            if (!$target.closest('.menu-item').length) {
                closeMenuItems();
            }
            if (!$target.closest('.language-selector').length) {
                closeLanguageSelector();
            }
            if (!$target.closest('.mobile-menu').length && !$target.closest('.menu-toggle').length) {
                closeMobileMenu();
            }
        });

        // Store cleanup function
        element._cleanup = () => {
            $element.find('.menu-toggle, .menu-item > a, .language-selector, .language-dropdown li').off();
            $(document).off('click');
        };
    }

    // Initialize all headers on page load
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.header').forEach(element => initHeader(element));
    });

    // Expose initialization function for dynamic usage
    window.initHeader = initHeader;
})();