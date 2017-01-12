import fs from 'fs';
import http from 'http';
import WebSocket from 'faye-websocket';
import Volume from './Volume';

/**
 * Server
 */
class Server {
    /**
     * Constructor
     *
     * @param {String} filename
     * @param {Number} port
     */
    constructor(filename, port = 8032) {
        this.filename = filename;
        this.server = http.createServer();
        this.rawBuffer = fs.readFileSync(this.filename);
        this.volume = new Volume(new Uint8Array(this.rawBuffer).buffer);

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onRequest = this.onRequest.bind(this);

        this.server.on('upgrade', this.onUpgrade);
        this.server.on('request', this.onRequest);

        this.server.listen(port/*, 'localhost'*/);

        console.info(`Server listening on port ${port}`);

        const { x, y, z } = this.volume;
        const voxel = this.volume.getBytePerVoxel();

        console.log(`Volume: ${x} ⨉ ${y} ⨉ ${z}`);
        console.log(`Voxel: ${voxel} octets`);
        console.log(`Body: ${this.volume.body.length}`);

        this.volume.debug();
        this.volume.debugView();
    }

    /**
     * On request upgrade
     *
     * @param {Request} request
     * @param {Socket} socket
     * @param {Object} head
     */
    onUpgrade(request, socket, head) {
        const client = new WebSocket(request, socket, head, 'websocket');
        console.log('new client');
        //const x = Math.round(Math.random() * 1000);
        //const y = Math.round(Math.random() * 1000);

        //console.info(`Sending position [${x}, ${y}] to id ${id}.`);
        //client.send(Buffer.from(getBuffer('position', id++, x, y)));

        //client.on('message', function onMessage(event) {
        //    const { name, id, x, y } = readBuffer(new Uint8Array(event.data).buffer);
        //    console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
        //});
    }

    /**
     * On request
     *
     * @param {Request} request
     * @param {Response} response
     */
    onRequest(request, response) {
        switch (request.url) {
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                response.end(fs.readFileSync('index.html'));
                break;

            case '/style.css':
            case '/cube.css':
                response.writeHead(200, {'Content-Type': 'text/css'});
                response.end(fs.readFileSync('./style' + request.url));
                break;

            case '/app.js':
                response.writeHead(200, {'Content-Type': 'application/javascript'});
                response.end(fs.readFileSync('dist/client.js'));
                break;

            case '/brain.nii':
                response.writeHead(200, {'Content-Type': 'application/octet-stream'});
                response.end(this.rawBuffer);
                break;

            default:
                response.writeHead(404);
                response.end();
                break;
        }
    }
}

export default Server;
