const http = require('http');
const fs = require('fs');
const WebSocket = require('faye-websocket');

const events = ['position'];
const params = process.argv.slice(2);
const port = params[0] || 8032;
let id = 0;

function getBuffer(name, id, x, y) {
    const buffer = new ArrayBuffer(6);
    const eventView = new Uint8Array(buffer, 0, 1);
    const idView = new Uint8Array(buffer, 1, 1);
    const positionView = new Uint16Array(buffer, 2, 2);

    eventView[0] = events.indexOf(name);
    idView[0] = id;
    positionView[0] = x;
    positionView[1] = y;

    return buffer;
}

function readBuffer(buffer) {
    const eventView = new Uint8Array(buffer, 0, 1);
    const idView = new Uint8Array(buffer, 1, 1);
    const positionView = new Uint16Array(buffer, 2, 2);

    return {
        name: events[eventView[0]],
        id: idView[0],
        x: positionView[0],
        y: positionView[1],
    };
}

const server = http.createServer();

server.listen(port, 'localhost');

console.info(`Server listening on port ${port}`)

server.on('upgrade', function onUpgrade(request, socket, head) {
    const client = new WebSocket(request, socket, head, 'websocket');
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);

    console.info(`Sending position [${x}, ${y}] to id ${id}.`);
    client.send(Buffer.from(getBuffer('position', id++, x, y)));

    client.on('message', function onMessage(event) {
        const { name, id, x, y } = readBuffer(new Uint8Array(event.data).buffer);

        console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
    });
});

server.on('request', function onRequest(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    response.end(fs.readFileSync('client.html'));
});

