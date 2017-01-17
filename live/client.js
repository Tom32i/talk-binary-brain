import Client from './src/Client';

const client = new Client();

if (typeof(parent.setDemo) === 'function') {
    parent.setDemo(client);
}
