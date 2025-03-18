if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('faq', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initFaq(element, data);
       }
    });
   }
   (function() {
     function initFaq(element, data) {

       const toggles = element.querySelectorAll('.toggle');
       if (!toggles || toggles.length === 0) {
        console.warn('Nessun elemento toggle trovato nella FAQ');
        return;
      }
       toggles.forEach(toggle=>{
        
          const myDiv = element.querySelector(`#dropdown-${toggle.id}`);
          const icon = element.querySelector(`#toggleIcon-${toggle.id}`);
          if (!myDiv || !icon) {
            console.warn(`Elementi correlati non trovati per il toggle con ID: ${toggle.id}`);
            return;
          }
          
            toggle.addEventListener('click', function() {
                myDiv.classList.toggle('visible');
                icon.classList.toggle('fa-plus');
                icon.classList.toggle('fa-minus');
            });
        })
     }
     
     // Initialize all headers on page load
     document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('.faq').forEach(element => initFaq(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initFaq = initFaq;
   })();