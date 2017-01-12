import Server from './src/Server';

const params = process.argv.slice(2);

new Server(params[0], params[1] || undefined);
