if (typeof ComponentRegistry !== 'undefined') {
  ComponentRegistry.register('hero-1', {
     mounted(element) {
       initHero1(element);
     }
  });
 }
 (function() {
   
   document.addEventListener('DOMContentLoaded', () => {
     document.querySelectorAll('.hero-1').forEach(element => initHero1(element));
   });
 })();
 function initHero1(element, data) {
    element.querySelectorAll('a[href^="#"]').forEach(anchor => {
      
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
 }