if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('contact-hero', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initContactHero(element, data);
       }
    });
   }
   (function() {
     function initContactHero(element, data) {
        element.querySelectorAll('a[href^="#"]').forEach(anchor => {
          
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
     }
     
     // Initialize all headers on page load
     document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('.contact-hero').forEach(element => initContactHero(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initContactHero = initContactHero;
   })();