/* /marquee.js */

/**
 * MarqueeKit
 * A high-performance JavaScript class to create a smooth, customizable marquee of images.
 * Optimizations include minimized DOM interactions, hardware acceleration, efficient event handling,
 * and good memory management.
 *
 * Read START_HERE.md for instructions
 */

class MarqueeKit {
    constructor(selector, options = {}) {
        // Default options with user overrides
        this.options = {
            images: [],
            speed: 100,
            height: 300,
            imageWidth: 250,
            gap: 20,
            pauseOnHover: false,
            reverse: false,
            imageScale: 1,
            borderRadius: 8,
            ...options
        };

        // Get the container element
        this.container = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        if (!this.container) {
            console.error('MarqueeKit: Container element not found');
            return;
        }

        // Animation state variables
        this.isAnimating = false;
        this.lastTimestamp = null;
        this.currentTranslate = 0;
        this.contentWidth = 0;
        this.animationFrame = null;
        this.targetSpeed = this.options.speed;
        this.currentSpeed = this.options.speed;

        // Event handlers for cleanup
        this.boundAnimate = this.animate.bind(this);
        this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);

        // Initialize the marquee
        this.init();
    }

    /**
     * Initialize the marquee by setting up the container,
     * creating the content, calculating dimensions, and starting the animation.
     */
    init() {
        this.setupContainer();
        this.createContent();
    }

    /**
     * Set up the container styles and classes.
     */
    setupContainer() {
        // Add a class for styling
        this.container.classList.add('marquee-container');
        // Set the container height
        this.container.style.height = `${this.options.height}px`;
        // Hide overflow to keep the marquee contained
        this.container.style.overflow = 'hidden';
        // Position relative for absolute positioning of the track
        this.container.style.position = 'relative';

        // **Create loading overlay**
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.classList.add('marquee-loading');

        // **Append loading overlay to the container**
        this.container.appendChild(this.loadingOverlay);
    }

    /**
     * Create the marquee content by duplicating images for seamless looping.
     */
    createContent() {
        // Create the track element
        this.track = document.createElement('div');
        this.track.classList.add('marquee-track');

        // Create image items
        this.items = this.options.images.map(src => {
            const item = document.createElement('div');
            item.classList.add('marquee-item');
            item.style.marginRight = `${this.options.gap}px`;

            const img = document.createElement('img');
            img.src = src;
            img.classList.add('marquee-image');
            img.loading = 'lazy';

            // Apply width, border radius, and transition properties dynamically
            img.style.width = `${this.options.imageWidth}px`;
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.style.backfaceVisibility = 'hidden';
            img.style.transform = 'translateZ(0)';
            img.style.transition = 'transform 0.3s ease';
            img.style.borderRadius = `${this.options.borderRadius}px`; // Apply border radius

            item.appendChild(img);
            return item;
        });

        // Add hover effect dynamically
        this.container.addEventListener('mouseover', (event) => {
            if (event.target.classList.contains('marquee-image')) {
                event.target.style.transform = `scale(${this.options.imageScale})`;
            }
        });

        this.container.addEventListener('mouseout', (event) => {
            if (event.target.classList.contains('marquee-image')) {
                event.target.style.transform = 'scale(1)';
            }
        });

        // Append items and clones to track for seamless scrolling
        this.items.forEach(item => this.track.appendChild(item));
        this.itemsClone = this.items.map(item => item.cloneNode(true));
        this.itemsClone.forEach(item => this.track.appendChild(item));

        // Append track to container
        this.container.appendChild(this.track);

        // Append items and clones to track for seamless scrolling
        this.items.forEach(item => this.track.appendChild(item.cloneNode(true)));
        this.items.forEach(item => this.track.appendChild(item.cloneNode(true)));
        this.items.forEach(item => this.track.appendChild(item.cloneNode(true)));
        this.items.forEach(item => this.track.appendChild(item.cloneNode(true)));


        // Wait for images to load before starting animation
        this.waitForImages().then(() => {
            if (this.loadingOverlay) {
                this.container.removeChild(this.loadingOverlay);
                this.loadingOverlay = null;
            }

            this.calculateDimensions();
            this.setupIntersectionObserver();
            this.setupEventListeners();
            this.startAnimation();
        });
    }

    /**
 * Public method to set the border radius of the images.
 * @param {number} radius - The border radius value in pixels.
 */
    setBorderRadius(radius) {
        this.options.borderRadius = radius;
        const images = this.container.querySelectorAll('.marquee-image');
        images.forEach(img => {
            img.style.borderRadius = `${radius}px`;
        });
    }

    /**
     * Wait for all images to load to ensure accurate dimension calculations.
     */

    waitForImages() {
        const images = this.container.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            return new Promise(resolve => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = img.onerror = resolve;
                }
            });
        });
        return Promise.all(promises);
    }

    /**
     * Calculate the total width of the content for looping.
     */
    calculateDimensions() {
        // Total width is the sum of the widths of the original items
        this.contentWidth = this.items.reduce((total, item) => {
            const style = window.getComputedStyle(item);
            const marginRight = parseFloat(style.marginRight);
            return total + item.offsetWidth + marginRight;
        }, 0);

        // Set the track width to accommodate both sets of items
        this.track.style.width = `${this.contentWidth * 4}px`;

        // Adjust currentTranslate to prevent initial blink
        if (this.options.reverse) {
            this.currentTranslate = -this.contentWidth;
        }
    }

    /**
     * Debounce function to limit how often a function can run.
     */
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * The animation loop that moves the marquee.
     * Uses requestAnimationFrame for smooth animations.
     */
    animate(timestamp) {
        if (!this.isAnimating) return;

        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        // Gradually adjust speed towards target speed for smooth stopping
        const speedDiff = this.targetSpeed - this.currentSpeed;
        if (Math.abs(speedDiff) > 0.1) {
            this.currentSpeed += speedDiff * 0.03; // Adjust this factor for slower/faster deceleration
        } else {
            this.currentSpeed = this.targetSpeed;
        }

        // Calculate movement in pixels
        const distance = (this.currentSpeed * elapsed) / 1000;
        this.currentTranslate += this.options.reverse ? distance : -distance;

        // Adjust currentTranslate to loop seamlessly using modulo
        const totalWidth = this.contentWidth;
        if (this.options.reverse) {
            this.currentTranslate = ((this.currentTranslate + totalWidth) % totalWidth) - totalWidth;
        } else {
            this.currentTranslate = this.currentTranslate % totalWidth;
        }

        // Apply the transform to the track for smooth movement
        this.track.style.transform = `translate3d(${this.currentTranslate}px, 0, 0)`;

        this.animationFrame = requestAnimationFrame(this.boundAnimate);
    }


    /**
     * Set up an IntersectionObserver to pause animation when the marquee is not in view.
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startAnimation();
                    } else {
                        this.stopAnimation();
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.observer.observe(this.container);
    }

    /**
     * Set up event listeners for hover and visibility changes.
     */
    setupEventListeners() {
        // Smooth pause on hover if enabled
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.slowDown());
            this.container.addEventListener('mouseleave', () => {
                if (document.visibilityState === 'visible') {
                    this.speedUp();
                }
            });
        }

        // Pause animation when the page is not visible
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    /**
     * Handle visibility change events.
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    /**
     * Start the animation loop.
     */
    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.lastTimestamp = null;
            this.animationFrame = requestAnimationFrame(this.boundAnimate);
        }
    }

    /**
     * Stop the animation loop.
     */
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Gradually slow down the marquee to a stop.
     */
    slowDown() {
        this.targetSpeed = 0;
    }

    /**
     * Gradually speed up the marquee to its original speed.
     */
    speedUp() {
        this.targetSpeed = this.options.speed;
        this.startAnimation();
    }

    /**
     * Public method to pause the marquee.
     */
    pause() {
        this.slowDown();
    }

    /**
     * Public method to resume the marquee.
     */
    play() {
        this.speedUp();
    }

    /**
     * Public method to set the speed of the marquee.
     * @param {number} speed - The new speed value in pixels per second.
     */
    setSpeed(speed) {
        this.options.speed = speed;
        this.targetSpeed = speed;
        this.currentSpeed = speed;
    }

    /**
     * Destroy the marquee instance and clean up.
     */
    destroy() {
        this.stopAnimation();
        this.container.innerHTML = '';

        // Remove event listeners
        if (this.observer) {
            this.observer.disconnect();
        }
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        window.removeEventListener('resize', this.resetDimensions);
    }
}

// Support for CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarqueeKit;
} else {
    window.MarqueeKit = MarqueeKit;
}
