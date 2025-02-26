if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('contact-incentivo', {
       beforeMount(element, data) {
         this.data = data;
       },
       mounted(element, data) {
         initContactIncentivo(element, data);
       }
    });
   }
   (function() {
     function initContactIncentivo(element, data) {
        const button = element.querySelector('#calculate-button');
        const container = element.querySelector('.popup-container');
    
        button.addEventListener('click', function() {
            container.classList.toggle('hidden'); 
            this.classList.toggle('disabled');
            this.disabled = true;
        });

        const resultButton = element.querySelector("#result-button");
        resultButton.addEventListener('click', function(){
          const select1Value = element.querySelector('#InputDim').value;
          const select2Value = element.querySelector('#InputInt').value;
          
          let result = null;
          try{
            result = data.incentivi[select1Value][select2Value];
          }
          catch(e){}
          
          element.querySelector('.popup .title').innerText = result ? "Verifica agevolazioni: " +  result : "Nessun risultato trovato";
        });
     }
     
     // Initialize all headers on page load
     document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('.contact-incentivo').forEach(element => initContactIncentivo(element));
     });
     
     // Expose initialization function for dynamic usage
     window.initContactIncentivo = initContactIncentivo;
   })();