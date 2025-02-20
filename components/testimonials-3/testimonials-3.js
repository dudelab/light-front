
if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('testimonials-3', {
        beforeMount(element, data) {
            this.data = data;
        },
        mounted(element, data) {
            initTestimonials3(element, data);
        }
    });
}

(function() {
    function initTestimonials3(element, data) {
        const $element = $(element);        

        const $testimonials = $element.find('.testimonial');
        

        $testimonials.each(function(index) {
            if (index % 2 !== 0) {

                $(this).addClass('reversed');
            }
        });
        
    }

    // Initialize all headers on page load
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.testimonials-3').forEach(element => initTestimonials3(element));
    });

    // Expose initialization function for dynamic usage
    window.initTestimonials3 = initTestimonials3;
})();
