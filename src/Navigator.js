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
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.toggle = this.toggle.bind(this);
        this.next = this.next.bind(this);

        this.callback = callback;
        this.x = this.getSlider('x', 100);
        this.y = this.getSlider('y', 100);
        this.z = this.getSlider('z', 100);
        this.auto = this.getAutoButton();
        this.sliders = [this.x, this.y, this.z];
        this.current = 0;
        this.frame = null;

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

    toggle() {
        this.frame ? this.stop() : this.start();
    }

    start() {
        if (!this.frame) {
            this.frame = requestAnimationFrame(this.next);
        }
    }

    stop() {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = null;
        }
    }

    /**
     * Nest
     *
     * @return {Function}
     */
    next() {
        this.frame = requestAnimationFrame(this.next);

        const slider = this.sliders[this.current];
        const { value, max } = slider;
        const end = value === max;

        if (end) {
            slider.value = 0;
            this.current = this.current === this.sliders.length - 1 ? 0 : this.current + 1;
        } else {
            slider.value++;
        }

        slider.dispatchEvent(new Event('input'));
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
        element.value = min;

        element.addEventListener('input', this.onChange);

        return element;
    }

    /**
     * Get auto button
     *
     * @return {Element}
     */
    getAutoButton() {
        const element = document.createElement('button');

        element.type = 'button';
        element.innerText = 'Auto';

        element.addEventListener('click', this.toggle);

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
        container.appendChild(this.auto);

        document.body.appendChild(container);
    }
}

export default Navigator;
