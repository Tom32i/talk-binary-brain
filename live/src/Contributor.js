class Contributor {
    constructor(socket) {
        this.socket = socket;

        this.onMessage = this.onMessage.bind(this);

        this.socket.on('message', this.onMessage);
        //    const { name, id, x, y } = readBuffer(new Uint8Array(event.data).buffer);
        //    console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
        //})
    }

    onMessage(event) {

    }
}

export default Contributor;
