if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('hero-projects', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initHeroProjects(element, data);
       }
    });
   }
   (function() {
     function initHeroProjects(element, data) {
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
       document.querySelectorAll('.hero-hero-projects').forEach(element => initHeroProjects(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initHeroProjects = initHeroProjects;
   })();