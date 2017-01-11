class Cube {
    constructor() {
        this.faces = new Array(5);
        this.cube = this.getCube();
        this.axis = ['x','y','z'];
        this.transform = {
            x: value => `translate3d(0, 0, ${value}px)`,
            y: value => `translate3d(${value}px, 0, 0) rotateY(-90deg)`,
            z: value => `translate3d(0, ${value}px, 0) rotateX(-90deg)`,
        };

        this.attach();
    }

    set(axis, value) {
        console.log(axis);
        const index = this.axis.indexOf(axis);
        const position = Math.round(value * 100) - 50;
        const transform = this.transform[axis](position);

        this.faces[index].style.transform = transform;
        this.cube.className = `cube ${axis}`;
    }

    getCube() {
        const cube = document.createElement('div');

        cube.className = 'cube';

        for (var i = 0; i < 6; i++) {
            const face = document.createElement('figure');
            cube.appendChild(face);
            this.faces[i] = face;
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
