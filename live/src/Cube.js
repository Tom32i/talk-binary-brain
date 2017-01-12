/**
 * Cube
 */
class Cube {
    constructor() {
        this.cube = this.getCube();
        this.size = 100;
        this.axis = ['x','y','z'];
        this.transform = {
            x: value => `translate3d(0, 0, ${value}px)`,
            y: value => `translate3d(${value}px, 0, 0) rotateY(-90deg)`,
            z: value => `translate3d(0, ${value}px, 0) rotateX(-90deg)`,
        };

        this.attach();
    }

    /**
     * Set current axis and progression
     *
     * @param {String} axis  Axis: x,y or z
     * @param {Number} value Progression from 0 to 1
     */
    set(axis, value) {
        const index = this.axis.indexOf(axis);
        const position = Math.round(value * this.size) - this.size/2;
        const transform = this.transform[axis](position);

        this.cube.faces[index].style.transform = transform;
        this.cube.className = `cube ${axis}`;
    }

    /**
     * Create a new cube
     *
     * @return {Element}
     */
    getCube() {
        const cube = document.createElement('div');

        cube.className = 'cube';
        cube.faces = new Array(6)

        for (var i = 0; i < 6; i++) {
            const face = document.createElement('figure');
            cube.appendChild(face);
            cube.faces[i] = face;
        }

        return cube;
    }

    /**
     * Attach to DOM
     */
    attach() {
        const container = document.createElement('section');

        container.className = 'container';
        container.appendChild(this.cube);

        document.body.appendChild(container);
    }
}

export default Cube;
