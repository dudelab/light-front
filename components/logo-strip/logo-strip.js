// # USAGE:
// Add 'animate' class to wrapper to activate the component animation
// you can adjust the config to change the animated component appearance (this won't have any effect without the 'animate' class on the wrapper)
// you can pass a config to overwrite the default one via the data-config='{ "key": "value" }' attribute on the wrapper

ComponentRegistry.register('logo-strip', {
    mounted($element, data) {
        // Default configuration
        const config = {
            speed: 1,
            height: '50px',
            size: .7,
            spacing: 30,
            ...data.config  // Override defaults with any provided config
        };

        let isPaused = false;
        let lastTime = 0;
        let isAnimating = false;

        // Only initialize canvas animation if the 'animate' class is present
        if (!$element.hasClass('animate')) return;

        const logoStrip = $element.find(".items")[0];
        if (!logoStrip) return;
        $(logoStrip).css("height", config.height)

        // Store original HTML before we replace it
        const originalHTML = logoStrip.innerHTML;

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        logoStrip.innerHTML = "";
        logoStrip.appendChild(canvas);

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.overflow = "hidden";

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        let items = [];
        let totalWidth = 0;

        // Load all images first
        const imagePromises = data.partners.map(partner => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ img, url: partner.url });
                img.onerror = reject;
                img.src = partner.image;
                img.alt = partner.name;
                img.title = partner.name;
            });
        });

        // Wait for all images to load before starting
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
                // On error, revert to original HTML
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
            if (!lastTime) {
                lastTime = timestamp;
            }

            const elapsed = timestamp - lastTime;
            lastTime = timestamp;

            // Ensure smooth animation with max frame time
            const movement = Math.min(elapsed, 16.667) * ((config.speed * 60) / 1000);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const dpr = window.devicePixelRatio || 1;
            const yOffset = ((canvas.height / dpr) - items[0].height) / 2;
            
            items.forEach(item => {
                ctx.drawImage(item.img, item.x, yOffset, item.width, item.height);
                
                if (!isPaused) {
                    item.x -= movement;
                    if (item.x + item.width < 0) {
                        item.x += totalWidth;
                    }
                }
            });

            // Only continue animation if element still has animate class
            if ($element.hasClass('animate')) {
                requestAnimationFrame(draw);
            } else {
                // If animate class is removed, revert to original HTML
                logoStrip.innerHTML = originalHTML;
                isAnimating = false;
            }
        }

        // Event Listeners
        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            // Get click position in canvas coordinates
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Convert to scaled canvas coordinates
            const canvasX = x * (canvas.width / (rect.width * dpr));
            const canvasY = y * (canvas.height / (rect.height * dpr));
            
            // Use the same yOffset calculation as in the draw function
            const yOffset = ((canvas.height / dpr) - items[0].height) / 2;
            
            canvas.style.cursor = "default";
            
            // Find logo under cursor
            const clickedItem = items.find(item => 
                canvasX >= item.x && 
                canvasX <= item.x + item.width &&
                canvasY >= yOffset &&
                canvasY <= yOffset + item.height
            );
            
            if (clickedItem) {
                canvas.style.cursor = "pointer";
                canvas.onclick = () => window.open(clickedItem.url, "_blank");
            } else {
                canvas.onclick = null;
            }
        });

        canvas.addEventListener("mouseenter", () => {
            isPaused = true;
            lastTime = 0;
        });

        canvas.addEventListener("mouseleave", () => {
            isPaused = false;
            lastTime = 0;
        });

        // Store cleanup info
        canvas._cleanup = {
            resize: resizeCanvas,
            originalHTML: originalHTML
        };
    },

    beforeDestroy($element, data) {
        const canvas = $element.find("canvas")[0];
        if (canvas?._cleanup) {
            window.removeEventListener("resize", canvas._cleanup.resize);
            // Restore original HTML
            const logoStrip = $element.find(".items")[0];
            if (logoStrip) {
                logoStrip.innerHTML = canvas._cleanup.originalHTML;
            }
        }
    }
});