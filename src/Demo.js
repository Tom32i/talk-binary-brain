import Volume from './Volume';
import Request from './Request';
import Navigator from './Navigator';
import Cube from './Cube';
import Canvas from './Canvas';
import Loader from './Loader';

/**
 * Demo
 */
class Demo {
    /**
     * Constructor
     *
     * @param {String} image MRI file path
     */
    constructor(image) {
        this.setSlice = this.setSlice.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);
        this.onError = this.onError.bind(this);

        this.loader = new Loader();
        this.canvas = new Canvas();
        this.navigator = new Navigator(this.setSlice);
        this.cube = new Cube();
        this.volume = null;
        this.axis = 0;

        this.request = new Request(image, this.onFileLoaded, this.onError);
    }

    /**
     * On MRI file loaded
     *
     * @param {ArrayBuffer} buffer
     */
    onFileLoaded(buffer) {
        this.volume = new Volume(buffer);

        this.loader.detach();

        const { x, y, z } = this.volume;
        const voxel = this.volume.bitPerVoxel * 8;

        console.info(`Volume: ${x} ⨉ ${y} ⨉ ${z}`);
        console.info(`Voxel: ${voxel} octets`);
        console.info(`Body: ${this.volume.body.length}`);

        this.navigator.setMaxs(x - 1, y - 1, z - 1);

        this.setSlice('x', Math.round(x / 2));
        //this.navigator.start();
    }

    /**
     * Display a slice
     *
     * @param {String} axis
     * @param {Number} index
     */
    setSlice(axis, index) {
        this.cube.set(axis, index / this.volume[axis]);
        this.canvas.load(
            this.volume.getSlice(axis, index)
        );
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        console.error(error);
    }
}

export default Demo;
