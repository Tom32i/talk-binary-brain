import fs from 'fs';
import http from 'http';
import WebSocket from 'faye-websocket';
import VolumeIO from './VolumeIO';

class Server {
    constructor(filename, port = 8032) {
        this.filename = filename;
        this.server = http.createServer();
        this.rawBuffer = fs.readFileSync(this.filename);
        this.volume = new VolumeIO(new Uint8Array(this.rawBuffer).buffer);

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

    onRequest(request, response) {
        switch (request.url) {
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                response.end(fs.readFileSync('index.html'));
                break;

            case '/style.css':
            case '/cube.css':
                response.writeHead(200, {'Content-Type': 'text/css'});
                response.end(fs.readFileSync('.' + request.url));
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

const params = process.argv.slice(2);

new Server(params[0], params[1] || undefined);
