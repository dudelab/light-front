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
      // Helper functions for menu state management
      const closeMenuItems = () => element.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active', 'open'));
      const closeLanguageSelector = () => element.querySelectorAll('.language-selector').forEach(selector => selector.classList.remove('open'));
      const closeMobileMenu = () => element.querySelectorAll('.mobile-menu').forEach(menu => menu.classList.remove('show'));
      const openMenuItem = (item) => item.classList.add('active', 'open');
      const openLanguageSelector = () => element.querySelectorAll('.language-selector').forEach(selector => selector.classList.add('open'));
      const openMobileMenu = () => element.querySelectorAll('.mobile-menu').forEach(menu => menu.classList.add('show'));
      const toggleMobileMenu = () => {
        const mobileMenu = element.querySelector('.mobile-menu');
        closeMenuItems();
        closeLanguageSelector();
        if (mobileMenu.classList.contains('show')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      };
      
      // Mobile menu toggle
      element.querySelector('.menu-toggle').addEventListener('click', toggleMobileMenu);
      
      // Menu items - both desktop and mobile
      element.querySelectorAll('.menu-item > a').forEach(menuItem => {
        menuItem.addEventListener('click', (e) => {
          e.preventDefault();
          const parent = e.currentTarget.parentNode;
          
          // If has submenu, toggle it
          if (parent.querySelectorAll('.submenu').length > 0) {
            if (!parent.classList.contains('open')) {
              closeLanguageSelector();
              closeMenuItems();
              openMenuItem(parent);
              if (!isElementVisible(e.currentTarget)) setTimeout(parent.scrollIntoView(), 100)
            } else {
              closeMenuItems();
            }
          }
        });
      });

      function isElementVisible(element) {
        const { top, left, bottom, right } = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
        return (
          (top > 0 && top < viewportHeight) ||
          (bottom > 0 && bottom < viewportHeight)
        ) &&
          (
            (left > 0 && left < viewportWidth) ||
            (right > 0 && right < viewportWidth)
          );
      }
       
      // Language selector
      const selector = element.querySelector('.language-selector');
      if (selector) {
        selector.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!selector.classList.contains('open')) {
            closeMenuItems();
            openLanguageSelector();
          } else {
            closeLanguageSelector();
          }
        });
        
        element.querySelectorAll('.language-dropdown li').forEach(item => {
          item.addEventListener('click', (e) => {
            selector.querySelector('span').textContent = e.currentTarget.getAttribute('data-lang');
          });
        });
      }
      
      // Click outside
      const documentClickHandler = (e) => {
        const target = e.target;
        
        if (!target.closest('.menu-item')) {
          closeMenuItems();
        }
        
        if (!target.closest('.language-selector')) {
          closeLanguageSelector();
        }
        
        if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
          closeMobileMenu();
        }
      };
      
      document.addEventListener('click', documentClickHandler);
      
      // Store cleanup function
      element._cleanup = () => {
        element.querySelector('.menu-toggle').removeEventListener('click', toggleMobileMenu);
        
        element.querySelectorAll('.menu-item > a').forEach(menuItem => {
          menuItem.removeEventListener('click', null);
        });
        
        if (selector) {
          selector.removeEventListener('click', null);
          element.querySelectorAll('.language-dropdown li').forEach(item => {
            item.removeEventListener('click', null);
          });
        }
        
        document.removeEventListener('click', documentClickHandler);
       };
     }
     
    // Initialize all headers on page load
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.header').forEach(element => initHeader(element));
    });
    
    // Expose initialization function for dynamic usage
    window.initHeader = initHeader;
   })();