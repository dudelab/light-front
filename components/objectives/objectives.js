if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('objectives', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initobjectives(element, data);
       }
    });
   }
   (function() {
     function initobjectives(element, data) {

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
       document.querySelectorAll('.objectives').forEach(element => initobjectives(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initobjectives = initobjectives;
   })();