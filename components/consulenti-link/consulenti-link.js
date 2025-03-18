if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('consulenti-link', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initConsulentiLink(element, data);
       }
    });
   }
   (function() {
     function initConsulentiLink(element, data) {
        const button = element.querySelector('.toggleButton');
        const container = element.querySelector('.popup-container');
        const icon = element.querySelector('.icon');

        if (!button || !container || !icon) {
          console.warn('Missing required elements for consulenti-link component');
          return;
      }
    
        button.addEventListener('click', function() {
            container.classList.toggle('hidden'); 
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
     }
     
     // Initialize all headers on page load
     document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('.consulenti-link').forEach(element => initConsulentiLink(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initConsulentiLink = initConsulentiLink;
   })();