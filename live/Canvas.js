class Canvas {
    constructor(element = document.createElement('canvas')) {
        this.element = element;
        this.context = this.element.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
    }

    /**
     * Set width
     *
     * @param {Number} width
     * @param {Number} height
     */
    setDimensions(width, height) {
        this.element.width = width;
        this.element.height = height;
        this.element.style.width = `${width * 4}px`;
        this.element.style.height = `${height * 4}px`;
    }

    /**
     * Set opacity
     *
     * @param {Float} opacity
     */
    setOpacity(opacity) {
        this.context.globalAlpha = opacity;
    }

    /**
     * Set fill color
     *
     * @param {String} color
     */
    setFill(color) {
        this.context.fillStyle = color;
    }

    /**
     * Set stroke color
     *
     * @param {String} color
     */
    setStroke(color) {
        this.context.strokeStyle = color;
    }
}

export default Canvas;
