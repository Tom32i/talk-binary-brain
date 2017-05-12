import fs from 'fs';
import http from 'http';
import zlib from 'zlib';
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
        console.info(`Launching server...`);

        const rawBuffer = fs.readFileSync(filename);

        this.server = http.createServer();
        this.volume = new Volume(new Uint8Array(rawBuffer).buffer);
        this.draw = Volume.create(this.volume.x, this.volume.y, this.volume.z, Uint8Array);

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onRequest = this.onRequest.bind(this);

        this.volume.raw = zlib.gzipSync(rawBuffer);
        this.draw.raw = zlib.gzipSync(new Buffer(this.draw.buffer));

        this.server.on('upgrade', this.onUpgrade);
        this.server.on('request', this.onRequest);

        this.server.listen(port);

        console.info(`Serving file "${filename}" on port ${port}`);

        console.info(`V Volume: ${this.volume.x} ⨉ ${this.volume.y} ⨉ ${this.volume.z}`);
        console.info(`V Voxel: ${this.volume.bitPerVoxel} bits`);
        console.info(`V DataType: ${DATATYPES.get(this.volume.dataType).name}`);
        console.info(`V Body: ${this.volume.body.length}`);
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
                response.end(fs.readFileSync('../index.html'));
                break;

            case '/demo':
            case '/demo/':
                response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                response.end(fs.readFileSync('demo.html'));
                break;

            case '/brain.nii':
            case '/demo/brain.nii':
                response.writeHead(200, {'Content-Type': 'application/octet-stream', 'Content-Encoding': 'gzip'});
                response.end(this.volume.raw);
                break;

            case '/draw.nii':
            case '/demo/draw.nii':
                response.writeHead(200, {'Content-Type': 'application/octet-stream', 'Content-Encoding': 'gzip'});
                response.end(this.draw.raw);
                break;

            default:
                const content = this.find(request.url.replace('/demo', ''));

                if (content) {
                    response.writeHead(200);
                    response.end(content);
                } else {
                    response.writeHead(404);
                    response.end();
                }
                break;
        }
    }

    /**
     * Find the given file from path
     *
     * @param {String} path
     *
     * @return {Resource}
     */
    find(path) {
        try {
            return fs.readFileSync('.' + path);
        } catch (error) {
            try {
                return fs.readFileSync('..' + path);
            } catch (error) {
                return null;
            }
        }
    }
}

export default Server;
