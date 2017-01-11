import VolumeIO from './VolumeIO';
import Request from './Request';
import Canvas from './Canvas';

class Client {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8032', 'websocket');
        this.canvas = new Canvas();
        this.volume = null;

        this.socket.binaryType = 'arraybuffer';

        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);

        document.body.appendChild(this.canvas.element);

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

        //this.volume.debug();
        //this.volume.debugView();
        console.time('slice');
        const slice = this.volume.getSlice('x', 88, this.canvas);
        console.timeEnd('slice');
    }

    onMessage(event) {
        console.log('onMessage', event);
        /*const { name, id, x, y } = readBuffer(event.data);

        console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
        console.info(`Sending ${name} [${x + 1}, ${y + 1}] for id ${id}.`);

        socket.send(getBuffer(name, id, x + 1 ,y + 1));*/
    }
}

new Client();
