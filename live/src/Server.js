import fs from 'fs';
import http from 'http';
import WebSocket from 'faye-websocket';
import Volume from './Volume';
import DATATYPES from './datatypes';

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
        const rawBuffer = fs.readFileSync(filename);

        this.server = http.createServer();
        this.volume = new Volume(new Uint8Array(rawBuffer).buffer);
        this.draw = Volume.create(this.volume.x, this.volume.y, this.volume.z, Uint8Array);

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onRequest = this.onRequest.bind(this);

        this.volume.raw = rawBuffer;
        this.draw.raw = new Buffer(this.draw.buffer);

        this.server.on('upgrade', this.onUpgrade);
        this.server.on('request', this.onRequest);

        this.server.listen(port);

        console.info(`Serving file "${filename}" on port ${port}`);

        const { x, y, z } = this.volume;
        const voxel = this.volume.bitPerVoxel * 8;

        console.info(`Volume: ${x} ⨉ ${y} ⨉ ${z}`);
        console.info(`Voxel: ${voxel} octets`);
        console.info(`Body: ${this.volume.body.length}`);

        this.draw.debug();
        this.draw.debugView();
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
                response.end(this.volume.raw);
                break;

            case '/draw.nii':
                response.writeHead(200, {'Content-Type': 'application/octet-stream'});
                response.end(this.draw.raw);
                break;

            default:
                response.writeHead(404);
                response.end();
                break;
        }
    }
}

export default Server;
