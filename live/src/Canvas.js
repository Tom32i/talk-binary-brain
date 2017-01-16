/**
 * Canvas
 */
class Canvas {
    /**
     * Constructor
     *
     * @param {Element} element
     */
    constructor(element = document.createElement('canvas')) {
        this.element = element;
        this.context = this.element.getContext('2d');
        this.scale = 1;

        this.onResize = this.onResize.bind(this);

        window.addEventListener('resize', this.onResize);

        this.attach();
    }

    /**
     * Set width
     *
     * @param {Number} width
     * @param {Number} height
     */
    setDimensions(width, height) {
        if (this.element.width === width && this.element.height === height) {
            return null;
        }

        this.element.width = width;
        this.element.height = height;
        this.context.globalCompositeOperation = 'copy';
        this.context.imageSmoothingEnabled = false;

        this.onResize();
    }

    /**
     * Load image data
     *
     * @param {ImageData} imageData
     */
    load(imageData) {
        this.setDimensions(imageData.width, imageData.height);
        this.context.putImageData(imageData, 0, 0);
    }

    /**
     * Attach to DOM
     */
    attach() {
        document.body.appendChild(this.element);
    }

    /**
     * On resize
     */
    onResize() {
        this.scale = this.getScale();

        const width = Math.round(this.element.width * this.scale);
        const height = Math.round(this.element.height * this.scale);

        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
    }

    /**
     * Get current scale
     *
     * @return {Number}
     */
    getScale(precision = 3) {
        const { width, height } = this.element;
        const { innerWidth, innerHeight } = window;
        const scale = Math.min(innerWidth, innerHeight) / Math.max(width, height);

        return Math.floor(scale * precision) / precision;
    }
}

export default Canvas;
