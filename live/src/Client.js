import Volume from './Volume';
import Request from './Request';
import Navigator from './Navigator';
import Cube from './Cube';
import Canvas from './Canvas';

/**
 * Client
 */
class Client {
    /**
     * Constructor
     */
    constructor(host = document.location.hostname, port = 8032) {
        this.setSlice = this.setSlice.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);
        this.onError = this.onError.bind(this);

        this.socket = new WebSocket(`ws://${host}:${port}`, 'websocket');
        this.canvas = new Canvas();
        this.navigator = new Navigator(this.setSlice);
        this.cube = new Cube();
        this.volume = null;
        this.axis = 0;

        this.socket.binaryType = 'arraybuffer';
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);

        this.request = new Request('brain.nii', this.onFileLoaded, this.onError);
    }

    /**
     * On socket open
     */
    onOpen() {
        console.info('Socket open.');
    }

    /**
     * On MRI file loaded
     *
     * @param {ArrayBuffer} buffer
     */
    onFileLoaded(buffer) {
        this.volume = new Volume(buffer);

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
     * On message
     *
     * @param {Event} event
     */
    onMessage(event) {
        console.log('onMessage', event);
        /*const { name, id, x, y } = readBuffer(event.data);

        console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
        console.info(`Sending ${name} [${x + 1}, ${y + 1}] for id ${id}.`);

        socket.send(getBuffer(name, id, x + 1 ,y + 1));*/
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

export default Client;
