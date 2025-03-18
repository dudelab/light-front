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

        if (!button || !container) {
          console.warn('Elementi necessari non trovati nel DOM');
          return;
      }
    
        button.addEventListener('click', function() {
            container.classList.toggle('hidden'); 
            this.classList.toggle('disabled');
            //this.disabled = true;
        });

        const resultButton = element.querySelector("#result-button");
        if (!resultButton) {
          console.warn('Result button non trovato');
          return;
        }
        resultButton.addEventListener('click', function(){
          const select1 = element.querySelector('#InputDim');
          const select2 = element.querySelector('#InputInt');

          if (!select1 || !select2) {
            console.error('Elementi select non trovati');
            return;
          }

          const select1Value = select1.value;
          const select2Value = select2.value;
          
          let result = null;
          try{
            result = data.incentivi[select1Value][select2Value];
          }
          catch(e){}

          const resultContainer = element.querySelector('.popup .result');
          if (!resultContainer) {
            console.error('Container risultato non trovato');
            return;
          }
          resultContainer.innerText = result ? ": " + result :"";
          
          
        });
     }
     
     // Initialize all headers on page load
     document.addEventListener('DOMContentLoaded', () => {
        const jsonObj = document.querySelector('.json-incentivo');
        const dataObject = jsonObj.getAttribute('data-object');
        const data = JSON.parse(dataObject);
       document.querySelectorAll('.contact-incentivo').forEach(element => initContactIncentivo(element, data));
     });
     
     // Expose initialization function for dynamic usage
     window.initContactIncentivo = initContactIncentivo;
   })();