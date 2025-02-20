// # USAGE:
// Add 'animate' class to wrapper to activate the component animation
// you can adjust the config to change the animated component appearance (this won't have any effect without the 'animate' class on the wrapper)
// you can pass a config to overwrite the default one via the data-config='{ "key": "value" }' attribute on the wrapper

if (typeof ComponentRegistry !== 'undefined') {
    ComponentRegistry.register('logo-strip', {
        mounted(element, data) {
            initLogoStrip(element);
        }
    });
}

(function() {
    // Default configuration
    const defaultConfig = {
        speed: 1,
        height: '50px',
        size: 0.7,
        spacing: 30
    };

    function initLogoStrip(wrapper) {
        // Check if element should be animated
        if (!wrapper?.classList?.contains('animate')) return;

        // Get or parse configuration
        let config = {...defaultConfig};
        const configAttr = wrapper.getAttribute('data-config');
        if (configAttr) {
            try {
                const customConfig = JSON.parse(configAttr);
                config = {...config, ...customConfig};
            } catch (e) {
                console.warn('Invalid config format, using defaults');
            }
        }

        let isPaused = false;
        let lastTime = 0;
        let isAnimating = false;

        // Find the items container
        const logoStrip = wrapper.querySelector('.items');
        if (!logoStrip) return;
        
        logoStrip.style.height = config.height;

        // Store original HTML
        const originalHTML = logoStrip.innerHTML;

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        logoStrip.innerHTML = '';
        logoStrip.appendChild(canvas);

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.overflow = 'hidden';

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let items = [];
        let totalWidth = 0;

        // Function to extract items from static HTML
        function getItemsFromHTML() {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = originalHTML;
            
            return Array.from(tempContainer.querySelectorAll('.item')).map(item => {
                const img = item.querySelector('img');
                const link = item.querySelector('a');
                return {
                    image: img.src,
                    url: link ? link.href : null,
                    name: img.alt
                };
            });
        }

        // Get items either from data attribute or static HTML
        const partnersAttr = wrapper.getAttribute('data-partners');
        const partners = partnersAttr ? JSON.parse(partnersAttr) : getItemsFromHTML();

        // Load all images
        const imagePromises = partners.map(partner => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ img, url: partner.url });
                img.onerror = reject;
                img.src = partner.image;
                img.alt = partner.name;
                img.title = partner.name;
            });
        });

        Promise.all(imagePromises)
            .then(loadedItems => {
                items = loadedItems.map(item => ({
                    ...item,
                    x: 0,
                    width: 0,
                    height: 0
                }));

                arrangeItems();
                if (!isAnimating) {
                    isAnimating = true;
                    requestAnimationFrame(draw);
                }
            })
            .catch(error => {
                console.error('Error loading images:', error);
                logoStrip.innerHTML = originalHTML;
            });

        function arrangeItems() {
            totalWidth = 0;
            const maxHeight = canvas.height * 0.8;
            
            items.forEach(item => {
                const aspectRatio = item.img.width / item.img.height;
                item.height = maxHeight * config.size / 1.6;
                item.width = maxHeight * aspectRatio * config.size / 1.6;
                item.x = totalWidth;
                totalWidth += item.width + config.spacing;
            });

            // Create duplicates
            const duplicateCount = Math.ceil(canvas.width / totalWidth) + 3;
            const originalCount = items.length;
            
            for (let i = 0; i < duplicateCount; i++) {
                for (let j = 0; j < originalCount; j++) {
                    const original = items[j];
                    items.push({
                        ...original,
                        x: original.x + totalWidth * (i + 1)
                    });
                }
            }
        }

        function draw(timestamp) {
            if (!lastTime) lastTime = timestamp;

            const elapsed = timestamp - lastTime;
            lastTime = timestamp;

            const movement = Math.min(elapsed, 16.667) * ((config.speed * 60) / 1000);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const dpr = window.devicePixelRatio || 1;
            const yOffset = ((canvas.height / dpr) - items[0].height) / 2;
            
            items.forEach(item => {
                ctx.drawImage(item.img, item.x, yOffset, item.width, item.height);
                
                if (!isPaused) {
                    item.x -= movement;
                    if (item.x + item.width < 0) {
                        const rightmostItem = items.reduce((a, b) => (a.x > b.x ? a : b));
                        item.x = rightmostItem.x + rightmostItem.width + config.spacing;
                    }
                }
            });

            if (wrapper.classList.contains('animate')) {
                requestAnimationFrame(draw);
            } else {
                logoStrip.innerHTML = originalHTML;
                isAnimating = false;
            }
        }

        // Event Listeners
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const canvasX = x * (canvas.width / (rect.width * dpr));
            const canvasY = y * (canvas.height / (rect.height * dpr));
            
            const yOffset = ((canvas.height / dpr) - items[0].height) / 2;
            
            canvas.style.cursor = 'default';
            
            const clickedItem = items.find(item => 
                canvasX >= item.x && 
                canvasX <= item.x + item.width &&
                canvasY >= yOffset &&
                canvasY <= yOffset + item.height
            );
            
            if (clickedItem && clickedItem.url) {
                canvas.style.cursor = 'pointer';
                canvas.onclick = () => window.open(clickedItem.url, '_blank');
            } else {
                canvas.onclick = null;
            }
        });

        canvas.addEventListener('mouseenter', () => {
            isPaused = true;
            lastTime = 0;
        });

        canvas.addEventListener('mouseleave', () => {
            isPaused = false;
            lastTime = 0;
        });

        // Store cleanup function
        wrapper._cleanup = () => {
            window.removeEventListener('resize', resizeCanvas);
            if (logoStrip) {
                logoStrip.innerHTML = originalHTML;
            }
        };
    }

    // Initialize all logo strips on page load
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.logo-strip').forEach(initLogoStrip);
    });

    // Expose initialization function for dynamic usage
    window.initLogoStrip = initLogoStrip;
})();