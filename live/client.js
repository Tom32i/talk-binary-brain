import VolumeIO from './VolumeIO';
import Request from './Request';
import Navigator from './Navigator';
import Canvas from './Canvas';

class Client {
    constructor() {
        this.slice = this.slice.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);

        this.socket = new WebSocket('ws://localhost:8032', 'websocket');
        this.canvas = new Canvas();
        this.navigator = new Navigator(this.slice.bind(this));
        this.volume = null;

        this.socket.binaryType = 'arraybuffer';

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);

        this.request = new Request('brain.nii', this.onFileLoaded, (error) => console.error(error));
    }

    onOpen() {
        console.info('Socket open.');
    }

    onFileLoaded(buffer) {
        this.volume = new VolumeIO(buffer);

        const { x, y, z } = this.volume;
        const voxel = this.volume.getBytePerVoxel();

        console.log(`Volume: ${x} ⨉ ${y} ⨉ ${z}`);
        console.log(`Voxel: ${voxel} octets`);
        console.log(`Body: ${this.volume.body.length}`);

        this.navigator.setMaxs(x - 1, y - 1, z - 1);

        //this.volume.debug();
        //this.volume.debugView();
        this.slice('x', Math.round(x / 2));
    }

    /**
     * Display a slice
     *
     * @param {String} axis
     * @param {Number} index
     */
    slice(axis, index) {
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
}

new Client();
