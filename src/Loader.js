/**
 * Loader
 */
export default class Loader {
    /**
     * Constructor
     *
     * @param {Element} element
     */
    constructor(element = document.createElement('p')) {
        this.element = element;

        this.element.className = 'loader';

        this.attach();
    }

    /**
     * Attach to DOM
     */
    attach() {
        document.body.appendChild(this.element);
    }

    detach() {
        document.body.removeChild(this.element);
    }
}
