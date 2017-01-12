/**
 * Navigator
 */
class Navigator {
    /**
     * Constructor
     *
     * @param {Function} callback Function to call when position change
     */
    constructor(callback) {
        this.onChange = this.onChange.bind(this);

        this.callback = callback;
        this.x = this.getSlider('x', 100);
        this.y = this.getSlider('y', 100);
        this.z = this.getSlider('z', 100);

        this.attach();
    }

    /**
     * On slider change
     *
     * @param {Event} event
     */
    onChange(event) {
        const { name, value } = event.target;

        this.callback(name, value);
    }

    /**
     * Set max values for sliders
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    setMaxs(x, y, z) {
        this.x.max = x;
        this.y.max = y;
        this.z.max = z;
    }

    /**
     * Create a new slider
     *
     * @param {String} name
     * @param {Number} max
     * @param {Number} step
     * @param {Number} min
     *
     * @return {Element}
     */
    getSlider(name, max, step = 1, min = 0) {
        const element = document.createElement('input');

        element.type = 'range';
        element.name = name;
        element.min = min;
        element.max = max;
        element.step = step;

        element.addEventListener('input', this.onChange);

        return element;
    }

    /**
     * Attach to DOM
     */
    attach() {
        const container = document.createElement('div');

        container.className = 'navigator';
        container.appendChild(this.x);
        container.appendChild(this.y);
        container.appendChild(this.z);

        document.body.appendChild(container);
    }
}

export default Navigator;
