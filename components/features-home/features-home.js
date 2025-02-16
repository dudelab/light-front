(function() {
  ComponentRegistry.register('features-home', {
      beforeMount($element, data) {
          this.scrollAmount = 0;
      },
      
      mounted($element, data) {
          // Setup carousel navigation
          this.setupCarousel($element);
      },
      
      setupCarousel($element) {
          const $container = $element.find('.features-container');
          const $prevBtn = $element.find('.prev');
          const $nextBtn = $element.find('.next');
          $container.find(".card").last().addClass("last-item");
          
          
          // Get card width including gap
          const getCardWidth = () => {
              const $card = $container.find('.card').first();
              return $card.outerWidth(true); // Includes margins/gap
          };
          
          $prevBtn.on('click', () => {
              this.scrollAmount = Math.max(0, this.scrollAmount - getCardWidth());
              $container.animate({ scrollLeft: this.scrollAmount }, 300);
          });
          
          $nextBtn.on('click', () => {
              const maxScroll = $container[0].scrollWidth - $container[0].clientWidth;
              this.scrollAmount = Math.min(maxScroll, this.scrollAmount + getCardWidth());
              $container.animate({ scrollLeft: this.scrollAmount }, 300);
          });
      },
      
      beforeDestroy($element) {
          // Clean up event listeners
          $element.find('.prev, .next').off();
      }
  });
})();