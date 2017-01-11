class Canvas {
    constructor(element = document.createElement('canvas')) {
        this.element = element;
        this.context = this.element.getContext('2d');
        this.scale = 4;

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
        this.element.style.width = `${width * this.scale}px`;
        this.element.style.height = `${height * this.scale}px`;
        this.context.globalCompositeOperation = 'copy';
        this.context.imageSmoothingEnabled = false;
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
}

export default Canvas;
