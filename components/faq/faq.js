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

       element.querySelectorAll('.toggle').forEach(toggle=>{
        
          const myDiv = element.querySelector(`#dropdown-${toggle.id}`);
          const icon = element.querySelector(`#toggleIcon-${toggle.id}`);
          
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