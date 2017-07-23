import Client from './src/Client';

const { hostname, pathname } = document.location;
const client = new Client(hostname === 'localhost' ? `${hostname}:8032` : `${hostname}${pathname}`);

if (typeof(parent.setDemo) === 'function') {
    parent.setDemo(client);
}
