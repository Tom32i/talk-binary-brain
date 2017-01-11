/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fs = __webpack_require__(1);

	var _fs2 = _interopRequireDefault(_fs);

	var _http = __webpack_require__(2);

	var _http2 = _interopRequireDefault(_http);

	var _fayeWebsocket = __webpack_require__(3);

	var _fayeWebsocket2 = _interopRequireDefault(_fayeWebsocket);

	var _VolumeIO = __webpack_require__(37);

	var _VolumeIO2 = _interopRequireDefault(_VolumeIO);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Server = function () {
	    function Server(filename) {
	        var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8032;

	        _classCallCheck(this, Server);

	        this.filename = filename;
	        this.server = _http2.default.createServer();
	        this.rawBuffer = _fs2.default.readFileSync(this.filename);
	        this.volume = new _VolumeIO2.default(new Uint8Array(this.rawBuffer).buffer);

	        this.onUpgrade = this.onUpgrade.bind(this);
	        this.onRequest = this.onRequest.bind(this);

	        this.server.on('upgrade', this.onUpgrade);
	        this.server.on('request', this.onRequest);

	        this.server.listen(port /*, 'localhost'*/);

	        console.info('Server listening on port ' + port);

	        var _volume = this.volume,
	            x = _volume.x,
	            y = _volume.y,
	            z = _volume.z;

	        var voxel = this.volume.getBytePerVoxel();

	        console.log('Volume: ' + x + ' \u2A09 ' + y + ' \u2A09 ' + z);
	        console.log('Voxel: ' + voxel + ' octets');
	        console.log('Body: ' + this.volume.body.length);

	        this.volume.debug();
	        this.volume.debugView();
	    }

	    _createClass(Server, [{
	        key: 'onUpgrade',
	        value: function onUpgrade(request, socket, head) {
	            var client = new _fayeWebsocket2.default(request, socket, head, 'websocket');
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
	    }, {
	        key: 'onRequest',
	        value: function onRequest(request, response) {
	            switch (request.url) {
	                case '/':
	                    response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
	                    response.end(_fs2.default.readFileSync('index.html'));
	                    break;

	                case '/app.js':
	                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
	                    response.end(_fs2.default.readFileSync('dist/client.js'));
	                    break;

	                case '/brain.nii':
	                    response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
	                    response.end(this.rawBuffer);
	                    break;

	                default:
	                    response.writeHead(404);
	                    response.end();
	                    break;
	            }
	        }
	    }]);

	    return Server;
	}();

	var params = process.argv.slice(2);

	new Server(params[0], params[1] || undefined);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// API references:
	//
	// * http://dev.w3.org/html5/websockets/
	// * http://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#interface-eventtarget
	// * http://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#interface-event

	var util   = __webpack_require__(4),
	    driver = __webpack_require__(5),
	    API    = __webpack_require__(30);

	var WebSocket = function(request, socket, body, protocols, options) {
	  options = options || {};

	  this._stream = socket;
	  this._driver = driver.http(request, {maxLength: options.maxLength, protocols: protocols});

	  var self = this;
	  if (!this._stream || !this._stream.writable) return;
	  if (!this._stream.readable) return this._stream.end();

	  var catchup = function() { self._stream.removeListener('data', catchup) };
	  this._stream.on('data', catchup);

	  API.call(this, options);

	  process.nextTick(function() {
	    self._driver.start();
	    self._driver.io.write(body);
	  });
	};
	util.inherits(WebSocket, API);

	WebSocket.isWebSocket = function(request) {
	  return driver.isWebSocket(request);
	};

	WebSocket.validateOptions = function(options, validKeys) {
	  driver.validateOptions(options, validKeys);
	};

	WebSocket.WebSocket   = WebSocket;
	WebSocket.Client      = __webpack_require__(33);
	WebSocket.EventSource = __webpack_require__(36);

	module.exports        = WebSocket;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Protocol references:
	// 
	// * http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol-75
	// * http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol-76
	// * http://tools.ietf.org/html/draft-ietf-hybi-thewebsocketprotocol-17

	var Base   = __webpack_require__(6),
	    Client = __webpack_require__(12),
	    Server = __webpack_require__(27);

	var Driver = {
	  client: function(url, options) {
	    options = options || {};
	    if (options.masking === undefined) options.masking = true;
	    return new Client(url, options);
	  },

	  server: function(options) {
	    options = options || {};
	    if (options.requireMasking === undefined) options.requireMasking = true;
	    return new Server(options);
	  },

	  http: function() {
	    return Server.http.apply(Server, arguments);
	  },

	  isSecureRequest: function(request) {
	    return Server.isSecureRequest(request);
	  },

	  isWebSocket: function(request) {
	    if (request.method !== 'GET') return false;

	    var connection = request.headers.connection || '',
	        upgrade    = request.headers.upgrade || '';

	    return request.method === 'GET' &&
	           connection.toLowerCase().split(/ *, */).indexOf('upgrade') >= 0 &&
	           upgrade.toLowerCase() === 'websocket';
	  },

	  validateOptions: function(options, validKeys) {
	    Base.validateOptions(options, validKeys);
	  }
	};

	module.exports = Driver;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Emitter = __webpack_require__(7).EventEmitter,
	    util    = __webpack_require__(4),
	    streams = __webpack_require__(8),
	    Headers = __webpack_require__(10),
	    Reader  = __webpack_require__(11);

	var Base = function(request, url, options) {
	  Emitter.call(this);
	  Base.validateOptions(options || {}, ['maxLength', 'masking', 'requireMasking', 'protocols']);

	  this._request   = request;
	  this._reader    = new Reader();
	  this._options   = options || {};
	  this._maxLength = this._options.maxLength || this.MAX_LENGTH;
	  this._headers   = new Headers();
	  this.__queue    = [];
	  this.readyState = 0;
	  this.url        = url;

	  this.io = new streams.IO(this);
	  this.messages = new streams.Messages(this);
	  this._bindEventListeners();
	};
	util.inherits(Base, Emitter);

	Base.validateOptions = function(options, validKeys) {
	  for (var key in options) {
	    if (validKeys.indexOf(key) < 0)
	      throw new Error('Unrecognized option: ' + key);
	  }
	};

	var instance = {
	  // This is 64MB, small enough for an average VPS to handle without
	  // crashing from process out of memory
	  MAX_LENGTH: 0x3ffffff,

	  STATES: ['connecting', 'open', 'closing', 'closed'],

	  _bindEventListeners: function() {
	    var self = this;

	    // Protocol errors are informational and do not have to be handled
	    this.messages.on('error', function() {});

	    this.on('message', function(event) {
	      var messages = self.messages;
	      if (messages.readable) messages.emit('data', event.data);
	    });

	    this.on('error', function(error) {
	      var messages = self.messages;
	      if (messages.readable) messages.emit('error', error);
	    });

	    this.on('close', function() {
	      var messages = self.messages;
	      if (!messages.readable) return;
	      messages.readable = messages.writable = false;
	      messages.emit('end');
	    });
	  },

	  getState: function() {
	    return this.STATES[this.readyState] || null;
	  },

	  addExtension: function(extension) {
	    return false;
	  },

	  setHeader: function(name, value) {
	    if (this.readyState > 0) return false;
	    this._headers.set(name, value);
	    return true;
	  },

	  start: function() {
	    if (this.readyState !== 0) return false;
	    var response = this._handshakeResponse();
	    if (!response) return false;
	    this._write(response);
	    if (this._stage !== -1) this._open();
	    return true;
	  },

	  text: function(message) {
	    return this.frame(message);
	  },

	  binary: function(message) {
	    return false;
	  },

	  ping: function() {
	    return false;
	  },

	  pong: function() {
	      return false;
	  },

	  close: function(reason, code) {
	    if (this.readyState !== 1) return false;
	    this.readyState = 3;
	    this.emit('close', new Base.CloseEvent(null, null));
	    return true;
	  },

	  _open: function() {
	    this.readyState = 1;
	    this.__queue.forEach(function(args) { this.frame.apply(this, args) }, this);
	    this.__queue = [];
	    this.emit('open', new Base.OpenEvent());
	  },

	  _queue: function(message) {
	    this.__queue.push(message);
	    return true;
	  },

	  _write: function(chunk) {
	    var io = this.io;
	    if (io.readable) io.emit('data', chunk);
	  }
	};

	for (var key in instance)
	  Base.prototype[key] = instance[key];


	Base.ConnectEvent = function() {};

	Base.OpenEvent = function() {};

	Base.CloseEvent = function(code, reason) {
	  this.code   = code;
	  this.reason = reason;
	};

	Base.MessageEvent = function(data) {
	  this.data = data;
	};

	module.exports = Base;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**

	Streams in a WebSocket connection
	---------------------------------

	We model a WebSocket as two duplex streams: one stream is for the wire protocol
	over an I/O socket, and the other is for incoming/outgoing messages.


	                        +----------+      +---------+      +----------+
	    [1] write(chunk) -->| ~~~~~~~~ +----->| parse() +----->| ~~~~~~~~ +--> emit('data') [2]
	                        |          |      +----+----+      |          |
	                        |          |           |           |          |
	                        |    IO    |           | [5]       | Messages |
	                        |          |           V           |          |
	                        |          |      +---------+      |          |
	    [4] emit('data') <--+ ~~~~~~~~ |<-----+ frame() |<-----+ ~~~~~~~~ |<-- write(chunk) [3]
	                        +----------+      +---------+      +----------+


	Message transfer in each direction is simple: IO receives a byte stream [1] and
	sends this stream for parsing. The parser will periodically emit a complete
	message text on the Messages stream [2]. Similarly, when messages are written
	to the Messages stream [3], they are framed using the WebSocket wire format and
	emitted via IO [4].

	There is a feedback loop via [5] since some input from [1] will be things like
	ping, pong and close frames. In these cases the protocol responds by emitting
	responses directly back to [4] rather than emitting messages via [2].

	For the purposes of flow control, we consider the sources of each Readable
	stream to be as follows:

	* [2] receives input from [1]
	* [4] receives input from [1] and [3]

	The classes below express the relationships described above without prescribing
	anything about how parse() and frame() work, other than assuming they emit
	'data' events to the IO and Messages streams. They will work with any protocol
	driver having these two methods.
	**/


	var Stream = __webpack_require__(9).Stream,
	    util   = __webpack_require__(4);


	var IO = function(driver) {
	  this.readable = this.writable = true;
	  this._paused  = false;
	  this._driver  = driver;
	};
	util.inherits(IO, Stream);

	// The IO pause() and resume() methods will be called when the socket we are
	// piping to gets backed up and drains. Since IO output [4] comes from IO input
	// [1] and Messages input [3], we need to tell both of those to return false
	// from write() when this stream is paused.

	IO.prototype.pause = function() {
	  this._paused = true;
	  this._driver.messages._paused = true;
	};

	IO.prototype.resume = function() {
	  this._paused = false;
	  this.emit('drain');

	  var messages = this._driver.messages;
	  messages._paused = false;
	  messages.emit('drain');
	};

	// When we receive input from a socket, send it to the parser and tell the
	// source whether to back off.
	IO.prototype.write = function(chunk) {
	  if (!this.writable) return false;
	  this._driver.parse(chunk);
	  return !this._paused;
	};

	// The IO end() method will be called when the socket piping into it emits
	// 'close' or 'end', i.e. the socket is closed. In this situation the Messages
	// stream will not emit any more data so we emit 'end'.
	IO.prototype.end = function(chunk) {
	  if (!this.writable) return;
	  if (chunk !== undefined) this.write(chunk);
	  this.writable = false;

	  var messages = this._driver.messages;
	  if (messages.readable) {
	    messages.readable = messages.writable = false;
	    messages.emit('end');
	  }
	};

	IO.prototype.destroy = function() {
	  this.end();
	};


	var Messages = function(driver) {
	  this.readable = this.writable = true;
	  this._paused  = false;
	  this._driver  = driver;
	};
	util.inherits(Messages, Stream);

	// The Messages pause() and resume() methods will be called when the app that's
	// processing the messages gets backed up and drains. If we're emitting
	// messages too fast we should tell the source to slow down. Message output [2]
	// comes from IO input [1].

	Messages.prototype.pause = function() {
	  this._driver.io._paused = true;
	};

	Messages.prototype.resume = function() {
	  this._driver.io._paused = false;
	  this._driver.io.emit('drain');
	};

	// When we receive messages from the user, send them to the formatter and tell
	// the source whether to back off.
	Messages.prototype.write = function(message) {
	  if (!this.writable) return false;
	  if (typeof message === 'string') this._driver.text(message);
	  else this._driver.binary(message);
	  return !this._paused;
	};

	// The Messages end() method will be called when a stream piping into it emits
	// 'end'. Many streams may be piped into the WebSocket and one of them ending
	// does not mean the whole socket is done, so just process the input and move
	// on leaving the socket open.
	Messages.prototype.end = function(message) {
	  if (message !== undefined) this.write(message);
	};

	Messages.prototype.destroy = function() {};


	exports.IO = IO;
	exports.Messages = Messages;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var Headers = function() {
	  this.clear();
	};

	Headers.prototype.ALLOWED_DUPLICATES = ['set-cookie', 'set-cookie2', 'warning', 'www-authenticate'];

	Headers.prototype.clear = function() {
	  this._sent  = {};
	  this._lines = [];
	};

	Headers.prototype.set = function(name, value) {
	  if (value === undefined) return;

	  name = this._strip(name);
	  value = this._strip(value);

	  var key = name.toLowerCase();
	  if (!this._sent.hasOwnProperty(key) || this.ALLOWED_DUPLICATES.indexOf(key) >= 0) {
	    this._sent[key] = true;
	    this._lines.push(name + ': ' + value + '\r\n');
	  }
	};

	Headers.prototype.toString = function() {
	  return this._lines.join('');
	};

	Headers.prototype._strip = function(string) {
	  return string.toString().replace(/^ */, '').replace(/ *$/, '');
	};

	module.exports = Headers;


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var StreamReader = function() {
	  this._queue     = [];
	  this._queueSize = 0;
	  this._offset    = 0;
	};

	StreamReader.prototype.put = function(buffer) {
	  if (!buffer || buffer.length === 0) return;
	  if (!buffer.copy) buffer = new Buffer(buffer);
	  this._queue.push(buffer);
	  this._queueSize += buffer.length;
	};

	StreamReader.prototype.read = function(length) {
	  if (length > this._queueSize) return null;
	  if (length === 0) return new Buffer(0);

	  this._queueSize -= length;

	  var queue  = this._queue,
	      remain = length,
	      first  = queue[0],
	      buffers, buffer;

	  if (first.length >= length) {
	    if (first.length === length) {
	      return queue.shift();
	    } else {
	      buffer = first.slice(0, length);
	      queue[0] = first.slice(length);
	      return buffer;
	    }
	  }

	  for (var i = 0, n = queue.length; i < n; i++) {
	    if (remain < queue[i].length) break;
	    remain -= queue[i].length;
	  }
	  buffers = queue.splice(0, i);

	  if (remain > 0 && queue.length > 0) {
	    buffers.push(queue[0].slice(0, remain));
	    queue[0] = queue[0].slice(remain);
	  }
	  return this._concat(buffers, length);
	};

	StreamReader.prototype.eachByte = function(callback, context) {
	  var buffer, n, index;

	  while (this._queue.length > 0) {
	    buffer = this._queue[0];
	    n = buffer.length;

	    while (this._offset < n) {
	      index = this._offset;
	      this._offset += 1;
	      callback.call(context, buffer[index]);
	    }
	    this._offset = 0;
	    this._queue.shift();
	  }
	};

	StreamReader.prototype._concat = function(buffers, length) {
	  if (Buffer.concat) return Buffer.concat(buffers, length);

	  var buffer = new Buffer(length),
	      offset = 0;

	  for (var i = 0, n = buffers.length; i < n; i++) {
	    buffers[i].copy(buffer, offset);
	    offset += buffers[i].length;
	  }
	  return buffer;
	};

	module.exports = StreamReader;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var crypto     = __webpack_require__(13),
	    url        = __webpack_require__(14),
	    util       = __webpack_require__(4),
	    HttpParser = __webpack_require__(15),
	    Base       = __webpack_require__(6),
	    Hybi       = __webpack_require__(16),
	    Proxy      = __webpack_require__(26);

	var Client = function(_url, options) {
	  this.version = 'hybi-13';
	  Hybi.call(this, null, _url, options);

	  this.readyState = -1;
	  this._key       = Client.generateKey();
	  this._accept    = Hybi.generateAccept(this._key);
	  this._http      = new HttpParser('response');

	  var uri  = url.parse(this.url),
	      auth = uri.auth && new Buffer(uri.auth, 'utf8').toString('base64');

	  if (this.VALID_PROTOCOLS.indexOf(uri.protocol) < 0)
	    throw new Error(this.url + ' is not a valid WebSocket URL');

	  this._pathname = (uri.pathname || '/') + (uri.search || '');

	  this._headers.set('Host', uri.host);
	  this._headers.set('Upgrade', 'websocket');
	  this._headers.set('Connection', 'Upgrade');
	  this._headers.set('Sec-WebSocket-Key', this._key);
	  this._headers.set('Sec-WebSocket-Version', '13');

	  if (this._protocols.length > 0)
	    this._headers.set('Sec-WebSocket-Protocol', this._protocols.join(', '));

	  if (auth)
	    this._headers.set('Authorization', 'Basic ' + auth);
	};
	util.inherits(Client, Hybi);

	Client.generateKey = function() {
	  return crypto.randomBytes(16).toString('base64');
	};

	var instance = {
	  VALID_PROTOCOLS: ['ws:', 'wss:'],

	  proxy: function(origin, options) {
	    return new Proxy(this, origin, options);
	  },

	  start: function() {
	    if (this.readyState !== -1) return false;
	    this._write(this._handshakeRequest());
	    this.readyState = 0;
	    return true;
	  },

	  parse: function(chunk) {
	    if (this.readyState === 3) return;
	    if (this.readyState > 0) return Hybi.prototype.parse.call(this, chunk);

	    this._http.parse(chunk);
	    if (!this._http.isComplete()) return;

	    this._validateHandshake();
	    if (this.readyState === 3) return;

	    this._open();
	    this.parse(this._http.body);
	  },

	  _handshakeRequest: function() {
	    var extensions = this._extensions.generateOffer();
	    if (extensions)
	      this._headers.set('Sec-WebSocket-Extensions', extensions);

	    var start   = 'GET ' + this._pathname + ' HTTP/1.1',
	        headers = [start, this._headers.toString(), ''];

	    return new Buffer(headers.join('\r\n'), 'utf8');
	  },

	  _failHandshake: function(message) {
	    message = 'Error during WebSocket handshake: ' + message;
	    this.readyState = 3;
	    this.emit('error', new Error(message));
	    this.emit('close', new Base.CloseEvent(this.ERRORS.protocol_error, message));
	  },

	  _validateHandshake: function() {
	    this.statusCode = this._http.statusCode;
	    this.headers    = this._http.headers;

	    if (this._http.statusCode !== 101)
	      return this._failHandshake('Unexpected response code: ' + this._http.statusCode);

	    var headers    = this._http.headers,
	        upgrade    = headers['upgrade'] || '',
	        connection = headers['connection'] || '',
	        accept     = headers['sec-websocket-accept'] || '',
	        protocol   = headers['sec-websocket-protocol'] || '';

	    if (upgrade === '')
	      return this._failHandshake("'Upgrade' header is missing");
	    if (upgrade.toLowerCase() !== 'websocket')
	      return this._failHandshake("'Upgrade' header value is not 'WebSocket'");

	    if (connection === '')
	      return this._failHandshake("'Connection' header is missing");
	    if (connection.toLowerCase() !== 'upgrade')
	      return this._failHandshake("'Connection' header value is not 'Upgrade'");

	    if (accept !== this._accept)
	      return this._failHandshake('Sec-WebSocket-Accept mismatch');

	    this.protocol = null;

	    if (protocol !== '') {
	      if (this._protocols.indexOf(protocol) < 0)
	        return this._failHandshake('Sec-WebSocket-Protocol mismatch');
	      else
	        this.protocol = protocol;
	    }

	    try {
	      this._extensions.activate(this.headers['sec-websocket-extensions']);
	    } catch (e) {
	      return this._failHandshake(e.message);
	    }
	  }
	};

	for (var key in instance)
	  Client.prototype[key] = instance[key];

	module.exports = Client;


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var NodeHTTPParser = process.binding('http_parser').HTTPParser,
	    version        = NodeHTTPParser.RESPONSE ? 6 : 4;

	var HttpParser = function(type) {
	  if (type === 'request')
	    this._parser = new NodeHTTPParser(NodeHTTPParser.REQUEST || 'request');
	  else
	    this._parser = new NodeHTTPParser(NodeHTTPParser.RESPONSE || 'response');

	  this._type     = type;
	  this._complete = false;
	  this.headers   = {};

	  var current = null,
	      self    = this;

	  this._parser.onHeaderField = function(b, start, length) {
	    current = b.toString('utf8', start, start + length).toLowerCase();
	  };

	  this._parser.onHeaderValue = function(b, start, length) {
	    var value = b.toString('utf8', start, start + length);

	    if (self.headers.hasOwnProperty(current))
	      self.headers[current] += ', ' + value;
	    else
	      self.headers[current] = value;
	  };

	  this._parser.onHeadersComplete = this._parser[NodeHTTPParser.kOnHeadersComplete] =
	  function(majorVersion, minorVersion, headers, method, pathname, statusCode) {
	    var info = arguments[0];

	    if (typeof info === 'object') {
	      method     = info.method;
	      pathname   = info.url;
	      statusCode = info.statusCode;
	      headers    = info.headers;
	    }

	    self.method     = (typeof method === 'number') ? HttpParser.METHODS[method] : method;
	    self.statusCode = statusCode;
	    self.url        = pathname;

	    if (!headers) return;

	    for (var i = 0, n = headers.length, key, value; i < n; i += 2) {
	      key   = headers[i].toLowerCase();
	      value = headers[i+1];
	      if (self.headers.hasOwnProperty(key))
	        self.headers[key] += ', ' + value;
	      else
	        self.headers[key] = value;
	    }

	    self._complete = true;
	  };
	};

	HttpParser.METHODS = {
	  0:  'DELETE',
	  1:  'GET',
	  2:  'HEAD',
	  3:  'POST',
	  4:  'PUT',
	  5:  'CONNECT',
	  6:  'OPTIONS',
	  7:  'TRACE',
	  8:  'COPY',
	  9:  'LOCK',
	  10: 'MKCOL',
	  11: 'MOVE',
	  12: 'PROPFIND',
	  13: 'PROPPATCH',
	  14: 'SEARCH',
	  15: 'UNLOCK',
	  16: 'REPORT',
	  17: 'MKACTIVITY',
	  18: 'CHECKOUT',
	  19: 'MERGE',
	  24: 'PATCH'
	};

	HttpParser.prototype.isComplete = function() {
	  return this._complete;
	};

	HttpParser.prototype.parse = function(chunk) {
	  var offset   = (version < 6) ? 1 : 0,
	      consumed = this._parser.execute(chunk, 0, chunk.length) + offset;

	  if (this._complete)
	    this.body = (consumed < chunk.length)
	              ? chunk.slice(consumed)
	              : new Buffer(0);
	};

	module.exports = HttpParser;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var crypto     = __webpack_require__(13),
	    util       = __webpack_require__(4),
	    Extensions = __webpack_require__(17),
	    Base       = __webpack_require__(6),
	    Frame      = __webpack_require__(24),
	    Message    = __webpack_require__(25);

	var Hybi = function(request, url, options) {
	  Base.apply(this, arguments);

	  this._extensions     = new Extensions();
	  this._stage          = 0;
	  this._masking        = this._options.masking;
	  this._protocols      = this._options.protocols || [];
	  this._requireMasking = this._options.requireMasking;
	  this._pingCallbacks  = {};

	  if (typeof this._protocols === 'string')
	    this._protocols = this._protocols.split(/ *, */);

	  if (!this._request) return;

	  var secKey    = this._request.headers['sec-websocket-key'],
	      protos    = this._request.headers['sec-websocket-protocol'],
	      version   = this._request.headers['sec-websocket-version'],
	      supported = this._protocols;

	  this._headers.set('Upgrade', 'websocket');
	  this._headers.set('Connection', 'Upgrade');
	  this._headers.set('Sec-WebSocket-Accept', Hybi.generateAccept(secKey));

	  if (protos !== undefined) {
	    if (typeof protos === 'string') protos = protos.split(/ *, */);
	    this.protocol = protos.filter(function(p) { return supported.indexOf(p) >= 0 })[0];
	    if (this.protocol) this._headers.set('Sec-WebSocket-Protocol', this.protocol);
	  }

	  this.version = 'hybi-' + version;
	};
	util.inherits(Hybi, Base);

	Hybi.mask = function(payload, mask, offset) {
	  if (!mask || mask.length === 0) return payload;
	  offset = offset || 0;

	  for (var i = 0, n = payload.length - offset; i < n; i++) {
	    payload[offset + i] = payload[offset + i] ^ mask[i % 4];
	  }
	  return payload;
	};

	Hybi.generateAccept = function(key) {
	  var sha1 = crypto.createHash('sha1');
	  sha1.update(key + Hybi.GUID);
	  return sha1.digest('base64');
	};

	Hybi.GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

	var instance = {
	  FIN:    0x80,
	  MASK:   0x80,
	  RSV1:   0x40,
	  RSV2:   0x20,
	  RSV3:   0x10,
	  OPCODE: 0x0F,
	  LENGTH: 0x7F,

	  OPCODES: {
	    continuation: 0,
	    text:         1,
	    binary:       2,
	    close:        8,
	    ping:         9,
	    pong:         10
	  },

	  OPCODE_CODES:    [0, 1, 2, 8, 9, 10],
	  MESSAGE_OPCODES: [0, 1, 2],
	  OPENING_OPCODES: [1, 2],

	  ERRORS: {
	    normal_closure:       1000,
	    going_away:           1001,
	    protocol_error:       1002,
	    unacceptable:         1003,
	    encoding_error:       1007,
	    policy_violation:     1008,
	    too_large:            1009,
	    extension_error:      1010,
	    unexpected_condition: 1011
	  },

	  ERROR_CODES:        [1000, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011],
	  DEFAULT_ERROR_CODE: 1000,
	  MIN_RESERVED_ERROR: 3000,
	  MAX_RESERVED_ERROR: 4999,

	  // http://www.w3.org/International/questions/qa-forms-utf-8.en.php
	  UTF8_MATCH: /^([\x00-\x7F]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/,

	  addExtension: function(extension) {
	    this._extensions.add(extension);
	    return true;
	  },

	  parse: function(chunk) {
	    this._reader.put(chunk);
	    var buffer = true;
	    while (buffer) {
	      switch (this._stage) {
	        case 0:
	          buffer = this._reader.read(1);
	          if (buffer) this._parseOpcode(buffer[0]);
	          break;

	        case 1:
	          buffer = this._reader.read(1);
	          if (buffer) this._parseLength(buffer[0]);
	          break;

	        case 2:
	          buffer = this._reader.read(this._frame.lengthBytes);
	          if (buffer) this._parseExtendedLength(buffer);
	          break;

	        case 3:
	          buffer = this._reader.read(4);
	          if (buffer) {
	            this._stage = 4;
	            this._frame.maskingKey = buffer;
	          }
	          break;

	        case 4:
	          buffer = this._reader.read(this._frame.length);
	          if (buffer) {
	            this._stage = 0;
	            this._emitFrame(buffer);
	          }
	          break;

	        default:
	          buffer = null;
	      }
	    }
	  },

	  text: function(message) {
	    if (this.readyState > 1) return false;
	    return this.frame(message, 'text');
	  },

	  binary: function(message) {
	    if (this.readyState > 1) return false;
	    return this.frame(message, 'binary');
	  },

	  ping: function(message, callback) {
	    if (this.readyState > 1) return false;
	    message = message || '';
	    if (callback) this._pingCallbacks[message] = callback;
	    return this.frame(message, 'ping');
	  },

	  pong: function(message) {
	      if (this.readyState > 1) return false;
	      message = message ||'';
	      return this.frame(message, 'pong');
	  },

	  close: function(reason, code) {
	    reason = reason || '';
	    code   = code   || this.ERRORS.normal_closure;

	    if (this.readyState <= 0) {
	      this.readyState = 3;
	      this.emit('close', new Base.CloseEvent(code, reason));
	      return true;
	    } else if (this.readyState === 1) {
	      this.readyState = 2;
	      this._extensions.close(function() { this.frame(reason, 'close', code) }, this);
	      return true;
	    } else {
	      return false;
	    }
	  },

	  frame: function(buffer, type, code) {
	    if (this.readyState <= 0) return this._queue([buffer, type, code]);
	    if (this.readyState > 2) return false;

	    if (buffer instanceof Array)    buffer = new Buffer(buffer);
	    if (typeof buffer === 'number') buffer = buffer.toString();

	    var message = new Message(),
	        isText  = (typeof buffer === 'string'),
	        payload, copy;

	    message.rsv1   = message.rsv2 = message.rsv3 = false;
	    message.opcode = this.OPCODES[type || (isText ? 'text' : 'binary')];

	    payload = isText ? new Buffer(buffer, 'utf8') : buffer;

	    if (code) {
	      copy = payload;
	      payload = new Buffer(2 + copy.length);
	      payload.writeUInt16BE(code, 0);
	      copy.copy(payload, 2);
	    }
	    message.data = payload;

	    var onMessageReady = function(message) {
	      var frame = new Frame();

	      frame.final   = true;
	      frame.rsv1    = message.rsv1;
	      frame.rsv2    = message.rsv2;
	      frame.rsv3    = message.rsv3;
	      frame.opcode  = message.opcode;
	      frame.masked  = !!this._masking;
	      frame.length  = message.data.length;
	      frame.payload = message.data;

	      if (frame.masked) frame.maskingKey = crypto.randomBytes(4);

	      this._sendFrame(frame);
	    };

	    if (this.MESSAGE_OPCODES.indexOf(message.opcode) >= 0)
	      this._extensions.processOutgoingMessage(message, function(error, message) {
	        if (error) return this._fail('extension_error', error.message);
	        onMessageReady.call(this, message);
	      }, this);
	    else
	      onMessageReady.call(this, message);

	    return true;
	  },

	  _sendFrame: function(frame) {
	    var length = frame.length,
	        header = (length <= 125) ? 2 : (length <= 65535 ? 4 : 10),
	        offset = header + (frame.masked ? 4 : 0),
	        buffer = new Buffer(offset + length),
	        masked = frame.masked ? this.MASK : 0;

	    buffer[0] = (frame.final ? this.FIN : 0) |
	                (frame.rsv1 ? this.RSV1 : 0) |
	                (frame.rsv2 ? this.RSV2 : 0) |
	                (frame.rsv3 ? this.RSV3 : 0) |
	                frame.opcode;

	    if (length <= 125) {
	      buffer[1] = masked | length;
	    } else if (length <= 65535) {
	      buffer[1] = masked | 126;
	      buffer.writeUInt16BE(length, 2);
	    } else {
	      buffer[1] = masked | 127;
	      buffer.writeUInt32BE(Math.floor(length / 0x100000000), 2);
	      buffer.writeUInt32BE(length % 0x100000000, 6);
	    }

	    frame.payload.copy(buffer, offset);

	    if (frame.masked) {
	      frame.maskingKey.copy(buffer, header);
	      Hybi.mask(buffer, frame.maskingKey, offset);
	    }

	    this._write(buffer);
	  },

	  _handshakeResponse: function() {
	    try {
	      var extensions = this._extensions.generateResponse(this._request.headers['sec-websocket-extensions']);
	    } catch (e) {
	      return this._fail('protocol_error', e.message);
	    }

	    if (extensions) this._headers.set('Sec-WebSocket-Extensions', extensions);

	    var start   = 'HTTP/1.1 101 Switching Protocols',
	        headers = [start, this._headers.toString(), ''];

	    return new Buffer(headers.join('\r\n'), 'utf8');
	  },

	  _shutdown: function(code, reason, error) {
	    delete this._frame;
	    delete this._message;
	    this._stage = 5;

	    var sendCloseFrame = (this.readyState === 1);
	    this.readyState = 2;

	    this._extensions.close(function() {
	      if (sendCloseFrame) this.frame(reason, 'close', code);
	      this.readyState = 3;
	      if (error) this.emit('error', new Error(reason));
	      this.emit('close', new Base.CloseEvent(code, reason));
	    }, this);
	  },

	  _fail: function(type, message) {
	    if (this.readyState > 1) return;
	    this._shutdown(this.ERRORS[type], message, true);
	  },

	  _parseOpcode: function(octet) {
	    var rsvs = [this.RSV1, this.RSV2, this.RSV3].map(function(rsv) {
	      return (octet & rsv) === rsv;
	    });

	    var frame = this._frame = new Frame();

	    frame.final  = (octet & this.FIN) === this.FIN;
	    frame.rsv1   = rsvs[0];
	    frame.rsv2   = rsvs[1];
	    frame.rsv3   = rsvs[2];
	    frame.opcode = (octet & this.OPCODE);

	    this._stage = 1;

	    if (!this._extensions.validFrameRsv(frame))
	      return this._fail('protocol_error',
	          'One or more reserved bits are on: reserved1 = ' + (frame.rsv1 ? 1 : 0) +
	          ', reserved2 = ' + (frame.rsv2 ? 1 : 0) +
	          ', reserved3 = ' + (frame.rsv3 ? 1 : 0));

	    if (this.OPCODE_CODES.indexOf(frame.opcode) < 0)
	      return this._fail('protocol_error', 'Unrecognized frame opcode: ' + frame.opcode);

	    if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && !frame.final)
	      return this._fail('protocol_error', 'Received fragmented control frame: opcode = ' + frame.opcode);

	    if (this._message && this.OPENING_OPCODES.indexOf(frame.opcode) >= 0)
	      return this._fail('protocol_error', 'Received new data frame but previous continuous frame is unfinished');
	  },

	  _parseLength: function(octet) {
	    var frame = this._frame;
	    frame.masked = (octet & this.MASK) === this.MASK;
	    frame.length = (octet & this.LENGTH);

	    if (frame.length >= 0 && frame.length <= 125) {
	      this._stage = frame.masked ? 3 : 4;
	      if (!this._checkFrameLength()) return;
	    } else {
	      this._stage = 2;
	      frame.lengthBytes = (frame.length === 126 ? 2 : 8);
	    }

	    if (this._requireMasking && !frame.masked)
	      return this._fail('unacceptable', 'Received unmasked frame but masking is required');
	  },

	  _parseExtendedLength: function(buffer) {
	    var frame = this._frame;
	    frame.length = this._readUInt(buffer);

	    this._stage = frame.masked ? 3 : 4;

	    if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && frame.length > 125)
	      return this._fail('protocol_error', 'Received control frame having too long payload: ' + frame.length);

	    if (!this._checkFrameLength()) return;
	  },

	  _checkFrameLength: function() {
	    var length = this._message ? this._message.length : 0;

	    if (length + this._frame.length > this._maxLength) {
	      this._fail('too_large', 'WebSocket frame length too large');
	      return false;
	    } else {
	      return true;
	    }
	  },

	  _emitFrame: function(buffer) {
	    var frame   = this._frame,
	        payload = frame.payload = Hybi.mask(buffer, frame.maskingKey),
	        opcode  = frame.opcode,
	        message,
	        code, reason,
	        callbacks, callback;

	    delete this._frame;

	    if (opcode === this.OPCODES.continuation) {
	      if (!this._message) return this._fail('protocol_error', 'Received unexpected continuation frame');
	      this._message.pushFrame(frame);
	    }

	    if (opcode === this.OPCODES.text || opcode === this.OPCODES.binary) {
	      this._message = new Message();
	      this._message.pushFrame(frame);
	    }

	    if (frame.final && this.MESSAGE_OPCODES.indexOf(opcode) >= 0)
	      return this._emitMessage(this._message);

	    if (opcode === this.OPCODES.close) {
	      code   = (payload.length >= 2) ? payload.readUInt16BE(0) : null;
	      reason = (payload.length > 2) ? this._encode(payload.slice(2)) : null;

	      if (!(payload.length === 0) &&
	          !(code !== null && code >= this.MIN_RESERVED_ERROR && code <= this.MAX_RESERVED_ERROR) &&
	          this.ERROR_CODES.indexOf(code) < 0)
	        code = this.ERRORS.protocol_error;

	      if (payload.length > 125 || (payload.length > 2 && !reason))
	        code = this.ERRORS.protocol_error;

	      this._shutdown(code || this.DEFAULT_ERROR_CODE, reason || '');
	    }

	    if (opcode === this.OPCODES.ping) {
	      this.frame(payload, 'pong');
	    }

	    if (opcode === this.OPCODES.pong) {
	      callbacks = this._pingCallbacks;
	      message   = this._encode(payload);
	      callback  = callbacks[message];

	      delete callbacks[message];
	      if (callback) callback()
	    }
	  },

	  _emitMessage: function(message) {
	    var message = this._message;
	    message.read();

	    delete this._message;

	    this._extensions.processIncomingMessage(message, function(error, message) {
	      if (error) return this._fail('extension_error', error.message);

	      var payload = message.data;
	      if (message.opcode === this.OPCODES.text) payload = this._encode(payload);

	      if (payload === null)
	        return this._fail('encoding_error', 'Could not decode a text frame as UTF-8');
	      else
	        this.emit('message', new Base.MessageEvent(payload));
	    }, this);
	  },

	  _encode: function(buffer) {
	    try {
	      var string = buffer.toString('binary', 0, buffer.length);
	      if (!this.UTF8_MATCH.test(string)) return null;
	    } catch (e) {}
	    return buffer.toString('utf8', 0, buffer.length);
	  },

	  _readUInt: function(buffer) {
	    if (buffer.length === 2) return buffer.readUInt16BE(0);

	    return buffer.readUInt32BE(0) * 0x100000000 +
	           buffer.readUInt32BE(4);
	  }
	};

	for (var key in instance)
	  Hybi.prototype[key] = instance[key];

	module.exports = Hybi;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Parser   = __webpack_require__(18),
	    Pipeline = __webpack_require__(19);

	var Extensions = function() {
	  this._rsv1 = this._rsv2 = this._rsv3 = null;

	  this._byName   = {};
	  this._inOrder  = [];
	  this._sessions = [];
	  this._index    = {}
	};

	Extensions.MESSAGE_OPCODES = [1, 2];

	var instance = {
	  add: function(ext) {
	    if (typeof ext.name !== 'string') throw new TypeError('extension.name must be a string');
	    if (ext.type !== 'permessage') throw new TypeError('extension.type must be "permessage"');

	    if (typeof ext.rsv1 !== 'boolean') throw new TypeError('extension.rsv1 must be true or false');
	    if (typeof ext.rsv2 !== 'boolean') throw new TypeError('extension.rsv2 must be true or false');
	    if (typeof ext.rsv3 !== 'boolean') throw new TypeError('extension.rsv3 must be true or false');

	    if (this._byName.hasOwnProperty(ext.name))
	      throw new TypeError('An extension with name "' + ext.name + '" is already registered');

	    this._byName[ext.name] = ext;
	    this._inOrder.push(ext);
	  },

	  generateOffer: function() {
	    var sessions = [],
	        offer    = [],
	        index    = {};

	    this._inOrder.forEach(function(ext) {
	      var session = ext.createClientSession();
	      if (!session) return;

	      var record = [ext, session];
	      sessions.push(record);
	      index[ext.name] = record;

	      var offers = session.generateOffer();
	      offers = offers ? [].concat(offers) : [];

	      offers.forEach(function(off) {
	        offer.push(Parser.serializeParams(ext.name, off));
	      }, this);
	    }, this);

	    this._sessions = sessions;
	    this._index    = index;

	    return offer.length > 0 ? offer.join(', ') : null;
	  },

	  activate: function(header) {
	    var responses = Parser.parseHeader(header),
	        sessions  = [];

	    responses.eachOffer(function(name, params) {
	      var record = this._index[name];

	      if (!record)
	        throw new Error('Server sent an extension response for unknown extension "' + name + '"');

	      var ext      = record[0],
	          session  = record[1],
	          reserved = this._reserved(ext);

	      if (reserved)
	        throw new Error('Server sent two extension responses that use the RSV' +
	                        reserved[0] + ' bit: "' +
	                        reserved[1] + '" and "' + ext.name + '"');

	      if (session.activate(params) !== true)
	        throw new Error('Server sent unacceptable extension parameters: ' +
	                        Parser.serializeParams(name, params));

	      this._reserve(ext);
	      sessions.push(record);
	    }, this);

	    this._sessions = sessions;
	    this._pipeline = new Pipeline(sessions);
	  },

	  generateResponse: function(header) {
	    var offers   = Parser.parseHeader(header),
	        sessions = [],
	        response = [];

	    this._inOrder.forEach(function(ext) {
	      var offer = offers.byName(ext.name);
	      if (offer.length === 0 || this._reserved(ext)) return;

	      var session = ext.createServerSession(offer);
	      if (!session) return;

	      this._reserve(ext);
	      sessions.push([ext, session]);
	      response.push(Parser.serializeParams(ext.name, session.generateResponse()));
	    }, this);

	    this._sessions = sessions;
	    this._pipeline = new Pipeline(sessions);

	    return response.length > 0 ? response.join(', ') : null;
	  },

	  validFrameRsv: function(frame) {
	    var allowed = {rsv1: false, rsv2: false, rsv3: false},
	        ext;

	    if (Extensions.MESSAGE_OPCODES.indexOf(frame.opcode) >= 0) {
	      for (var i = 0, n = this._sessions.length; i < n; i++) {
	        ext = this._sessions[i][0];
	        allowed.rsv1 = allowed.rsv1 || ext.rsv1;
	        allowed.rsv2 = allowed.rsv2 || ext.rsv2;
	        allowed.rsv3 = allowed.rsv3 || ext.rsv3;
	      }
	    }

	    return (allowed.rsv1 || !frame.rsv1) &&
	           (allowed.rsv2 || !frame.rsv2) &&
	           (allowed.rsv3 || !frame.rsv3);
	  },

	  processIncomingMessage: function(message, callback, context) {
	    this._pipeline.processIncomingMessage(message, callback, context);
	  },

	  processOutgoingMessage: function(message, callback, context) {
	    this._pipeline.processOutgoingMessage(message, callback, context);
	  },

	  close: function(callback, context) {
	    if (!this._pipeline) return callback.call(context);
	    this._pipeline.close(callback, context);
	  },

	  _reserve: function(ext) {
	    this._rsv1 = this._rsv1 || (ext.rsv1 && ext.name);
	    this._rsv2 = this._rsv2 || (ext.rsv2 && ext.name);
	    this._rsv3 = this._rsv3 || (ext.rsv3 && ext.name);
	  },

	  _reserved: function(ext) {
	    if (this._rsv1 && ext.rsv1) return [1, this._rsv1];
	    if (this._rsv2 && ext.rsv2) return [2, this._rsv2];
	    if (this._rsv3 && ext.rsv3) return [3, this._rsv3];
	    return false;
	  }
	};

	for (var key in instance)
	  Extensions.prototype[key] = instance[key];

	module.exports = Extensions;


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	var TOKEN    = /([!#\$%&'\*\+\-\.\^_`\|~0-9a-z]+)/,
	    NOTOKEN  = /([^!#\$%&'\*\+\-\.\^_`\|~0-9a-z])/g,
	    QUOTED   = /"((?:\\[\x00-\x7f]|[^\x00-\x08\x0a-\x1f\x7f"])*)"/,
	    PARAM    = new RegExp(TOKEN.source + '(?:=(?:' + TOKEN.source + '|' + QUOTED.source + '))?'),
	    EXT      = new RegExp(TOKEN.source + '(?: *; *' + PARAM.source + ')*', 'g'),
	    EXT_LIST = new RegExp('^' + EXT.source + '(?: *, *' + EXT.source + ')*$'),
	    NUMBER   = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;

	var Parser = {
	  parseHeader: function(header) {
	    var offers = new Offers();
	    if (header === '' || header === undefined) return offers;

	    if (!EXT_LIST.test(header))
	      throw new SyntaxError('Invalid Sec-WebSocket-Extensions header: ' + header);

	    var values = header.match(EXT);

	    values.forEach(function(value) {
	      var params = value.match(new RegExp(PARAM.source, 'g')),
	          name   = params.shift(),
	          offer  = {};

	      params.forEach(function(param) {
	        var args = param.match(PARAM), key = args[1], data;

	        if (args[2] !== undefined) {
	          data = args[2];
	        } else if (args[3] !== undefined) {
	          data = args[3].replace(/\\/g, '');
	        } else {
	          data = true;
	        }
	        if (NUMBER.test(data)) data = parseFloat(data);

	        if (offer.hasOwnProperty(key)) {
	          offer[key] = [].concat(offer[key]);
	          offer[key].push(data);
	        } else {
	          offer[key] = data;
	        }
	      }, this);
	      offers.push(name, offer);
	    }, this);

	    return offers;
	  },

	  serializeParams: function(name, params) {
	    var values = [];

	    var print = function(key, value) {
	      if (value instanceof Array) {
	        value.forEach(function(v) { print(key, v) });
	      } else if (value === true) {
	        values.push(key);
	      } else if (typeof value === 'number') {
	        values.push(key + '=' + value);
	      } else if (NOTOKEN.test(value)) {
	        values.push(key + '="' + value.replace(/"/g, '\\"') + '"');
	      } else {
	        values.push(key + '=' + value);
	      }
	    };

	    for (var key in params) print(key, params[key]);

	    return [name].concat(values).join('; ');
	  }
	};

	var Offers = function() {
	  this._byName  = {};
	  this._inOrder = [];
	};

	Offers.prototype.push = function(name, params) {
	  this._byName[name] = this._byName[name] || [];
	  this._byName[name].push(params);
	  this._inOrder.push({name: name, params: params});
	};

	Offers.prototype.eachOffer = function(callback, context) {
	  var list = this._inOrder;
	  for (var i = 0, n = list.length; i < n; i++)
	    callback.call(context, list[i].name, list[i].params);
	};

	Offers.prototype.byName = function(name) {
	  return this._byName[name] || [];
	};

	Offers.prototype.toArray = function() {
	  return this._inOrder.slice();
	};

	module.exports = Parser;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cell   = __webpack_require__(20),
	    Pledge = __webpack_require__(23);

	var Pipeline = function(sessions) {
	  this._cells   = sessions.map(function(session) { return new Cell(session) });
	  this._stopped = {incoming: false, outgoing: false};
	};

	Pipeline.prototype.processIncomingMessage = function(message, callback, context) {
	  if (this._stopped.incoming) return;
	  this._loop('incoming', this._cells.length - 1, -1, -1, message, callback, context);
	};

	Pipeline.prototype.processOutgoingMessage = function(message, callback, context) {
	  if (this._stopped.outgoing) return;
	  this._loop('outgoing', 0, this._cells.length, 1, message, callback, context);
	};

	Pipeline.prototype.close = function(callback, context) {
	  this._stopped = {incoming: true, outgoing: true};

	  var closed = this._cells.map(function(a) { return a.close() });
	  if (callback)
	    Pledge.all(closed).then(function() { callback.call(context) });
	};

	Pipeline.prototype._loop = function(direction, start, end, step, message, callback, context) {
	  var cells = this._cells,
	      n     = cells.length,
	      self  = this;

	  while (n--) cells[n].pending(direction);

	  var pipe = function(index, error, msg) {
	    if (index === end) return callback.call(context, error, msg);

	    cells[index][direction](error, msg, function(err, m) {
	      if (err) self._stopped[direction] = true;
	      pipe(index + step, err, m);
	    });
	  };
	  pipe(start, null, message);
	};

	module.exports = Pipeline;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Functor = __webpack_require__(21),
	    Pledge  = __webpack_require__(23);

	var Cell = function(tuple) {
	  this._ext     = tuple[0];
	  this._session = tuple[1];

	  this._functors = {
	    incoming: new Functor(this._session, 'processIncomingMessage'),
	    outgoing: new Functor(this._session, 'processOutgoingMessage')
	  };
	};

	Cell.prototype.pending = function(direction) {
	  this._functors[direction].pending += 1;
	};

	Cell.prototype.incoming = function(error, message, callback, context) {
	  this._exec('incoming', error, message, callback, context);
	};

	Cell.prototype.outgoing = function(error, message, callback, context) {
	  this._exec('outgoing', error, message, callback, context);
	};

	Cell.prototype.close = function() {
	  this._closed = this._closed || new Pledge();
	  this._doClose();
	  return this._closed;
	};

	Cell.prototype._exec = function(direction, error, message, callback, context) {
	  this._functors[direction].call(error, message, function(err, msg) {
	    if (err) err.message = this._ext.name + ': ' + err.message;
	    callback.call(context, err, msg);
	    this._doClose();
	  }, this);
	};

	Cell.prototype._doClose = function() {
	  var fin  = this._functors.incoming,
	      fout = this._functors.outgoing;

	  if (!this._closed || fin.pending + fout.pending !== 0) return;
	  if (this._session) this._session.close();
	  this._session = null;
	  this._closed.done();
	};

	module.exports = Cell;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var RingBuffer = __webpack_require__(22);

	var Functor = function(session, method) {
	  this._session = session;
	  this._method  = method;
	  this._queue   = new RingBuffer(Functor.QUEUE_SIZE);
	  this._stopped = false;
	  this.pending  = 0;
	};

	Functor.QUEUE_SIZE = 8;

	Functor.prototype.call = function(error, message, callback, context) {
	  if (this._stopped) return;

	  var record = {error: error, message: message, callback: callback, context: context, done: false},
	      called = false,
	      self   = this;

	  this._queue.push(record);

	  if (record.error) {
	    record.done = true;
	    this._stop();
	    return this._flushQueue();
	  }

	  this._session[this._method](message, function(err, msg) {
	    if (!(called ^ (called = true))) return;

	    if (err) {
	      self._stop();
	      record.error   = err;
	      record.message = null;
	    } else {
	      record.message = msg;
	    }

	    record.done = true;
	    self._flushQueue();
	  });
	};

	Functor.prototype._stop = function() {
	  this.pending  = this._queue.length;
	  this._stopped = true;
	};

	Functor.prototype._flushQueue = function() {
	  var queue = this._queue, record;

	  while (queue.length > 0 && queue.peek().done) {
	    this.pending -= 1;
	    record = queue.shift();
	    record.callback.call(record.context, record.error, record.message);
	  }
	};

	module.exports = Functor;


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	var RingBuffer = function(bufferSize) {
	  this._buffer     = new Array(bufferSize);
	  this._bufferSize = bufferSize;
	  this._ringOffset = 0;
	  this._ringSize   = bufferSize;
	  this._head       = 0;
	  this._tail       = 0;
	  this.length      = 0;
	};

	RingBuffer.prototype.push = function(value) {
	  var expandBuffer = false,
	      expandRing   = false;

	  if (this._ringSize < this._bufferSize) {
	    expandBuffer = (this._tail === 0);
	  } else if (this._ringOffset === this._ringSize) {
	    expandBuffer = true;
	    expandRing   = (this._tail === 0);
	  }

	  if (expandBuffer) {
	    this._tail       = this._bufferSize;
	    this._buffer     = this._buffer.concat(new Array(this._bufferSize));
	    this._bufferSize = this._buffer.length;

	    if (expandRing)
	      this._ringSize = this._bufferSize;
	  }

	  this._buffer[this._tail] = value;
	  this.length += 1;
	  if (this._tail < this._ringSize) this._ringOffset += 1;
	  this._tail = (this._tail + 1) % this._bufferSize;
	};

	RingBuffer.prototype.peek = function() {
	  if (this.length === 0) return void 0;
	  return this._buffer[this._head];
	};

	RingBuffer.prototype.shift = function() {
	  if (this.length === 0) return void 0;

	  var value = this._buffer[this._head];
	  this._buffer[this._head] = void 0;
	  this.length -= 1;
	  this._ringOffset -= 1;

	  if (this._ringOffset === 0 && this.length > 0) {
	    this._head       = this._ringSize;
	    this._ringOffset = this.length;
	    this._ringSize   = this._bufferSize;
	  } else {
	    this._head = (this._head + 1) % this._ringSize;
	  }
	  return value;
	};

	module.exports = RingBuffer;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var RingBuffer = __webpack_require__(22);

	var Pledge = function() {
	  this._complete  = false;
	  this._callbacks = new RingBuffer(Pledge.QUEUE_SIZE);
	};

	Pledge.QUEUE_SIZE = 4;

	Pledge.all = function(list) {
	  var pledge  = new Pledge(),
	      pending = list.length,
	      n       = pending;

	  if (pending === 0) pledge.done();

	  while (n--) list[n].then(function() {
	    pending -= 1;
	    if (pending === 0) pledge.done();
	  });
	  return pledge;
	};

	Pledge.prototype.then = function(callback) {
	  if (this._complete) callback();
	  else this._callbacks.push(callback);
	};

	Pledge.prototype.done = function() {
	  this._complete = true;
	  var callbacks = this._callbacks, callback;
	  while (callback = callbacks.shift()) callback();
	};

	module.exports = Pledge;


/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	var Frame = function() {};

	var instance = {
	  final:        false,
	  rsv1:         false,
	  rsv2:         false,
	  rsv3:         false,
	  opcode:       null,
	  masked:       false,
	  maskingKey:   null,
	  lengthBytes:  1,
	  length:       0,
	  payload:      null
	};

	for (var key in instance)
	  Frame.prototype[key] = instance[key];

	module.exports = Frame;


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var Message = function() {
	  this.rsv1    = false;
	  this.rsv2    = false;
	  this.rsv3    = false;
	  this.opcode  = null
	  this.length  = 0;
	  this._chunks = [];
	};

	var instance = {
	  read: function() {
	    if (this.data) return this.data;

	    this.data  = new Buffer(this.length);
	    var offset = 0;

	    for (var i = 0, n = this._chunks.length; i < n; i++) {
	      this._chunks[i].copy(this.data, offset);
	      offset += this._chunks[i].length;
	    }
	    return this.data;
	  },

	  pushFrame: function(frame) {
	    this.rsv1 = this.rsv1 || frame.rsv1;
	    this.rsv2 = this.rsv2 || frame.rsv2;
	    this.rsv3 = this.rsv3 || frame.rsv3;

	    if (this.opcode === null) this.opcode = frame.opcode;

	    this._chunks.push(frame.payload);
	    this.length += frame.length;
	  }
	};

	for (var key in instance)
	  Message.prototype[key] = instance[key];

	module.exports = Message;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream     = __webpack_require__(9).Stream,
	    url        = __webpack_require__(14),
	    util       = __webpack_require__(4),
	    Base       = __webpack_require__(6),
	    Headers    = __webpack_require__(10),
	    HttpParser = __webpack_require__(15);

	var PORTS = {'ws:': 80, 'wss:': 443};

	var Proxy = function(client, origin, options) {
	  this._client  = client;
	  this._http    = new HttpParser('response');
	  this._origin  = (typeof client.url === 'object') ? client.url : url.parse(client.url);
	  this._url     = (typeof origin === 'object') ? origin : url.parse(origin);
	  this._options = options || {};
	  this._state   = 0;

	  this.readable = this.writable = true;
	  this._paused  = false;

	  this._headers = new Headers();
	  this._headers.set('Host', this._origin.host);
	  this._headers.set('Connection', 'keep-alive');
	  this._headers.set('Proxy-Connection', 'keep-alive');

	  var auth = this._url.auth && new Buffer(this._url.auth, 'utf8').toString('base64');
	  if (auth) this._headers.set('Proxy-Authorization', 'Basic ' + auth);
	};
	util.inherits(Proxy, Stream);

	var instance = {
	  setHeader: function(name, value) {
	    if (this._state !== 0) return false;
	    this._headers.set(name, value);
	    return true;
	  },

	  start: function() {
	    if (this._state !== 0) return false;
	    this._state = 1;

	    var origin = this._origin,
	        port   = origin.port || PORTS[origin.protocol],
	        start  = 'CONNECT ' + origin.hostname + ':' + port + ' HTTP/1.1';

	    var headers = [start, this._headers.toString(), ''];

	    this.emit('data', new Buffer(headers.join('\r\n'), 'utf8'));
	    return true;
	  },

	  pause: function() {
	    this._paused = true;
	  },

	  resume: function() {
	    this._paused = false;
	    this.emit('drain');
	  },

	  write: function(chunk) {
	    if (!this.writable) return false;

	    this._http.parse(chunk);
	    if (!this._http.isComplete()) return !this._paused;

	    this.statusCode = this._http.statusCode;
	    this.headers    = this._http.headers;

	    if (this.statusCode === 200) {
	      this.emit('connect', new Base.ConnectEvent());
	    } else {
	      var message = "Can't establish a connection to the server at " + this._origin.href;
	      this.emit('error', new Error(message));
	    }
	    this.end();
	    return !this._paused;
	  },

	  end: function(chunk) {
	    if (!this.writable) return;
	    if (chunk !== undefined) this.write(chunk);
	    this.readable = this.writable = false;
	    this.emit('close');
	    this.emit('end');
	  },

	  destroy: function() {
	    this.end();
	  }
	};

	for (var key in instance)
	  Proxy.prototype[key] = instance[key];

	module.exports = Proxy;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util       = __webpack_require__(4),
	    HttpParser = __webpack_require__(15),
	    Base       = __webpack_require__(6),
	    Draft75    = __webpack_require__(28),
	    Draft76    = __webpack_require__(29),
	    Hybi       = __webpack_require__(16);

	var Server = function(options) {
	  Base.call(this, null, null, options);
	  this._http = new HttpParser('request');
	};
	util.inherits(Server, Base);

	var instance = {
	  EVENTS: ['open', 'message', 'error', 'close'],

	  _bindEventListeners: function() {
	    this.messages.on('error', function() {});
	    this.on('error', function() {});
	  },

	  parse: function(chunk) {
	    if (this._delegate) return this._delegate.parse(chunk);

	    this._http.parse(chunk);
	    if (!this._http.isComplete()) return;

	    this.method  = this._http.method;
	    this.url     = this._http.url;
	    this.headers = this._http.headers;
	    this.body    = this._http.body;

	    var self = this;
	    this._delegate = Server.http(this, this._options);
	    this._delegate.messages = this.messages;
	    this._delegate.io = this.io;
	    this._open();

	    this.EVENTS.forEach(function(event) {
	      this._delegate.on(event, function(e) { self.emit(event, e) });
	    }, this);

	    this.protocol = this._delegate.protocol;
	    this.version  = this._delegate.version;

	    this.parse(this._http.body);
	    this.emit('connect', new Base.ConnectEvent());
	  },

	  _open: function() {
	    this.__queue.forEach(function(msg) {
	      this._delegate[msg[0]].apply(this._delegate, msg[1]);
	    }, this);
	    this.__queue = [];
	  }
	};

	['addExtension', 'setHeader', 'start', 'frame', 'text', 'binary', 'ping', 'close'].forEach(function(method) {
	  instance[method] = function() {
	    if (this._delegate) {
	      return this._delegate[method].apply(this._delegate, arguments);
	    } else {
	      this.__queue.push([method, arguments]);
	      return true;
	    }
	  };
	});

	for (var key in instance)
	  Server.prototype[key] = instance[key];

	Server.isSecureRequest = function(request) {
	  if (request.connection && request.connection.authorized !== undefined) return true;
	  if (request.socket && request.socket.secure) return true;

	  var headers = request.headers;
	  if (!headers) return false;
	  if (headers['https'] === 'on') return true;
	  if (headers['x-forwarded-ssl'] === 'on') return true;
	  if (headers['x-forwarded-scheme'] === 'https') return true;
	  if (headers['x-forwarded-proto'] === 'https') return true;

	  return false;
	};

	Server.determineUrl = function(request) {
	  var scheme = this.isSecureRequest(request) ? 'wss:' : 'ws:';
	  return scheme + '//' + request.headers.host + request.url;
	};

	Server.http = function(request, options) {
	  options = options || {};
	  if (options.requireMasking === undefined) options.requireMasking = true;

	  var headers = request.headers,
	      url     = this.determineUrl(request);

	  if (headers['sec-websocket-version'])
	    return new Hybi(request, url, options);
	  else if (headers['sec-websocket-key1'])
	    return new Draft76(request, url, options);
	  else
	    return new Draft75(request, url, options);
	};

	module.exports = Server;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Base = __webpack_require__(6),
	    util = __webpack_require__(4);

	var Draft75 = function(request, url, options) {
	  Base.apply(this, arguments);
	  this._stage  = 0;
	  this.version = 'hixie-75';

	  this._headers.set('Upgrade', 'WebSocket');
	  this._headers.set('Connection', 'Upgrade');
	  this._headers.set('WebSocket-Origin', this._request.headers.origin);
	  this._headers.set('WebSocket-Location', this.url);
	};
	util.inherits(Draft75, Base);

	var instance = {
	  close: function() {
	    if (this.readyState === 3) return false;
	    this.readyState = 3;
	    this.emit('close', new Base.CloseEvent(null, null));
	    return true;
	  },

	  parse: function(chunk) {
	    if (this.readyState > 1) return;

	    this._reader.put(chunk);

	    this._reader.eachByte(function(octet) {
	      var message;

	      switch (this._stage) {
	        case -1:
	          this._body.push(octet);
	          this._sendHandshakeBody();
	          break;

	        case 0:
	          this._parseLeadingByte(octet);
	          break;

	        case 1:
	          this._length = (octet & 0x7F) + 128 * this._length;

	          if (this._closing && this._length === 0) {
	            return this.close();
	          }
	          else if ((octet & 0x80) !== 0x80) {
	            if (this._length === 0) {
	              this._stage = 0;
	            }
	            else {
	              this._skipped = 0;
	              this._stage   = 2;
	            }
	          }
	          break;

	        case 2:
	          if (octet === 0xFF) {
	            this._stage = 0;
	            message = new Buffer(this._buffer).toString('utf8', 0, this._buffer.length);
	            this.emit('message', new Base.MessageEvent(message));
	          }
	          else {
	            if (this._length) {
	              this._skipped += 1;
	              if (this._skipped === this._length)
	                this._stage = 0;
	            } else {
	              this._buffer.push(octet);
	              if (this._buffer.length > this._maxLength) return this.close();
	            }
	          }
	          break;
	      }
	    }, this);
	  },

	  frame: function(buffer) {
	    if (this.readyState === 0) return this._queue([buffer]);
	    if (this.readyState > 1) return false;

	    if (typeof buffer !== 'string') buffer = buffer.toString();

	    var payload = new Buffer(buffer, 'utf8'),
	        frame   = new Buffer(payload.length + 2);

	    frame[0] = 0x00;
	    frame[payload.length + 1] = 0xFF;
	    payload.copy(frame, 1);

	    this._write(frame);
	    return true;
	  },

	  _handshakeResponse: function() {
	    var start   = 'HTTP/1.1 101 Web Socket Protocol Handshake',
	        headers = [start, this._headers.toString(), ''];

	    return new Buffer(headers.join('\r\n'), 'utf8');
	  },

	  _parseLeadingByte: function(octet) {
	    if ((octet & 0x80) === 0x80) {
	      this._length = 0;
	      this._stage  = 1;
	    } else {
	      delete this._length;
	      delete this._skipped;
	      this._buffer = [];
	      this._stage  = 2;
	    }
	  }
	};

	for (var key in instance)
	  Draft75.prototype[key] = instance[key];

	module.exports = Draft75;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Base    = __webpack_require__(6),
	    Draft75 = __webpack_require__(28),
	    crypto  = __webpack_require__(13),
	    util    = __webpack_require__(4);


	var numberFromKey = function(key) {
	  return parseInt(key.match(/[0-9]/g).join(''), 10);
	};

	var spacesInKey = function(key) {
	  return key.match(/ /g).length;
	};


	var Draft76 = function(request, url, options) {
	  Draft75.apply(this, arguments);
	  this._stage  = -1;
	  this._body   = [];
	  this.version = 'hixie-76';

	  this._headers.clear();

	  this._headers.set('Upgrade', 'WebSocket');
	  this._headers.set('Connection', 'Upgrade');
	  this._headers.set('Sec-WebSocket-Origin', this._request.headers.origin);
	  this._headers.set('Sec-WebSocket-Location', this.url);
	};
	util.inherits(Draft76, Draft75);

	var instance = {
	  BODY_SIZE: 8,

	  start: function() {
	    if (!Draft75.prototype.start.call(this)) return false;
	    this._started = true;
	    this._sendHandshakeBody();
	    return true;
	  },

	  close: function() {
	    if (this.readyState === 3) return false;
	    this._write(new Buffer([0xFF, 0x00]));
	    this.readyState = 3;
	    this.emit('close', new Base.CloseEvent(null, null));
	    return true;
	  },

	  _handshakeResponse: function() {
	    var headers = this._request.headers,

	        key1    = headers['sec-websocket-key1'],
	        number1 = numberFromKey(key1),
	        spaces1 = spacesInKey(key1),

	        key2    = headers['sec-websocket-key2'],
	        number2 = numberFromKey(key2),
	        spaces2 = spacesInKey(key2);

	    if (number1 % spaces1 !== 0 || number2 % spaces2 !== 0) {
	      this.emit('error', new Error('Client sent invalid Sec-WebSocket-Key headers'));
	      this.close();
	      return null;
	    }

	    this._keyValues = [number1 / spaces1, number2 / spaces2];

	    var start   = 'HTTP/1.1 101 WebSocket Protocol Handshake',
	        headers = [start, this._headers.toString(), ''];

	    return new Buffer(headers.join('\r\n'), 'binary');
	  },

	  _handshakeSignature: function() {
	    if (this._body.length < this.BODY_SIZE) return null;

	    var md5    = crypto.createHash('md5'),
	        buffer = new Buffer(8 + this.BODY_SIZE);

	    buffer.writeUInt32BE(this._keyValues[0], 0);
	    buffer.writeUInt32BE(this._keyValues[1], 4);
	    new Buffer(this._body).copy(buffer, 8, 0, this.BODY_SIZE);

	    md5.update(buffer);
	    return new Buffer(md5.digest('binary'), 'binary');
	  },

	  _sendHandshakeBody: function() {
	    if (!this._started) return;
	    var signature = this._handshakeSignature();
	    if (!signature) return;

	    this._write(signature);
	    this._stage = 0;
	    this._open();

	    if (this._body.length > this.BODY_SIZE)
	      this.parse(this._body.slice(this.BODY_SIZE));
	  },

	  _parseLeadingByte: function(octet) {
	    if (octet !== 0xFF)
	      return Draft75.prototype._parseLeadingByte.call(this, octet);

	    this._closing = true;
	    this._length  = 0;
	    this._stage   = 1;
	  }
	};

	for (var key in instance)
	  Draft76.prototype[key] = instance[key];

	module.exports = Draft76;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Stream      = __webpack_require__(9).Stream,
	    util        = __webpack_require__(4),
	    driver      = __webpack_require__(5),
	    EventTarget = __webpack_require__(31),
	    Event       = __webpack_require__(32);

	var API = function(options) {
	  options = options || {};
	  driver.validateOptions(options, ['headers', 'extensions', 'maxLength', 'ping', 'proxy', 'tls', 'ca']);

	  this.readable = this.writable = true;

	  var headers = options.headers;
	  if (headers) {
	    for (var name in headers) this._driver.setHeader(name, headers[name]);
	  }

	  var extensions = options.extensions;
	  if (extensions) {
	    [].concat(extensions).forEach(this._driver.addExtension, this._driver);
	  }

	  this._ping          = options.ping;
	  this._pingId        = 0;
	  this.readyState     = API.CONNECTING;
	  this.bufferedAmount = 0;
	  this.protocol       = '';
	  this.url            = this._driver.url;
	  this.version        = this._driver.version;

	  var self = this;

	  this._driver.on('open',    function(e) { self._open() });
	  this._driver.on('message', function(e) { self._receiveMessage(e.data) });
	  this._driver.on('close',   function(e) { self._beginClose(e.reason, e.code) });

	  this._driver.on('error', function(error) {
	    self._emitError(error.message);
	  });
	  this.on('error', function() {});

	  this._driver.messages.on('drain', function() {
	    self.emit('drain');
	  });

	  if (this._ping)
	    this._pingTimer = setInterval(function() {
	      self._pingId += 1;
	      self.ping(self._pingId.toString());
	    }, this._ping * 1000);

	  this._configureStream();

	  if (!this._proxy) {
	    this._stream.pipe(this._driver.io);
	    this._driver.io.pipe(this._stream);
	  }
	};
	util.inherits(API, Stream);

	API.CONNECTING = 0;
	API.OPEN       = 1;
	API.CLOSING    = 2;
	API.CLOSED     = 3;

	var instance = {
	  write: function(data) {
	    return this.send(data);
	  },

	  end: function(data) {
	    if (data !== undefined) this.send(data);
	    this.close();
	  },

	  pause: function() {
	    return this._driver.messages.pause();
	  },

	  resume: function() {
	    return this._driver.messages.resume();
	  },

	  send: function(data) {
	    if (this.readyState > API.OPEN) return false;
	    if (!(data instanceof Buffer)) data = String(data);
	    return this._driver.messages.write(data);
	  },

	  ping: function(message, callback) {
	    if (this.readyState > API.OPEN) return false;
	    return this._driver.ping(message, callback);
	  },

	  close: function(code, reason) {
	    if (code === undefined) code = 1000;
	    if (reason === undefined) reason = '';

	    if (code !== 1000 && (code < 3000 || code > 4999))
	      throw new Error("Failed to execute 'close' on WebSocket: " +
	                      "The code must be either 1000, or between 3000 and 4999. " +
	                      code + " is neither.");

	    if (this.readyState !== API.CLOSED) this.readyState = API.CLOSING;
	    this._driver.close(reason, code);
	  },

	  _configureStream: function() {
	    var self = this;

	    this._stream.setTimeout(0);
	    this._stream.setNoDelay(true);

	    ['close', 'end'].forEach(function(event) {
	      this._stream.on(event, function() { self._finalizeClose() });
	    }, this);

	    this._stream.on('error', function(error) {
	      self._emitError('Network error: ' + self.url + ': ' + error.message);
	      self._finalizeClose();
	    });
	  },

	 _open: function() {
	    if (this.readyState !== API.CONNECTING) return;

	    this.readyState = API.OPEN;
	    this.protocol = this._driver.protocol || '';

	    var event = new Event('open');
	    event.initEvent('open', false, false);
	    this.dispatchEvent(event);
	  },

	  _receiveMessage: function(data) {
	    if (this.readyState > API.OPEN) return false;

	    if (this.readable) this.emit('data', data);

	    var event = new Event('message', {data: data});
	    event.initEvent('message', false, false);
	    this.dispatchEvent(event);
	  },

	  _emitError: function(message) {
	    if (this.readyState >= API.CLOSING) return;

	    var event = new Event('error', {message: message});
	    event.initEvent('error', false, false);
	    this.dispatchEvent(event);
	  },

	  _beginClose: function(reason, code) {
	    if (this.readyState === API.CLOSED) return;
	    this.readyState = API.CLOSING;
	    this._closeParams = [reason, code];

	    if (this._stream) {
	      this._stream.end();
	      if (!this._stream.readable) this._finalizeClose();
	    }
	  },

	  _finalizeClose: function() {
	    if (this.readyState === API.CLOSED) return;
	    this.readyState = API.CLOSED;

	    if (this._pingTimer) clearInterval(this._pingTimer);
	    if (this._stream) this._stream.end();

	    if (this.readable) this.emit('end');
	    this.readable = this.writable = false;

	    var reason = this._closeParams ? this._closeParams[0] : '',
	        code   = this._closeParams ? this._closeParams[1] : 1006;

	    var event = new Event('close', {code: code, reason: reason});
	    event.initEvent('close', false, false);
	    this.dispatchEvent(event);
	  }
	};

	for (var method in instance) API.prototype[method] = instance[method];
	for (var key in EventTarget) API.prototype[key] = EventTarget[key];

	module.exports = API;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Event = __webpack_require__(32);

	var EventTarget = {
	  onopen:     null,
	  onmessage:  null,
	  onerror:    null,
	  onclose:    null,

	  addEventListener: function(eventType, listener, useCapture) {
	    this.on(eventType, listener);
	  },

	  removeEventListener: function(eventType, listener, useCapture) {
	    this.removeListener(eventType, listener);
	  },

	  dispatchEvent: function(event) {
	    event.target = event.currentTarget = this;
	    event.eventPhase = Event.AT_TARGET;

	    if (this['on' + event.type])
	      this['on' + event.type](event);

	    this.emit(event.type, event);
	  }
	};

	module.exports = EventTarget;


/***/ },
/* 32 */
/***/ function(module, exports) {

	var Event = function(eventType, options) {
	  this.type = eventType;
	  for (var key in options)
	    this[key] = options[key];
	};

	Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
	  this.type       = eventType;
	  this.bubbles    = canBubble;
	  this.cancelable = cancelable;
	};

	Event.prototype.stopPropagation = function() {};
	Event.prototype.preventDefault  = function() {};

	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET       = 2;
	Event.BUBBLING_PHASE  = 3;

	module.exports = Event;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var util   = __webpack_require__(4),
	    net    = __webpack_require__(34),
	    tls    = __webpack_require__(35),
	    url    = __webpack_require__(14),
	    driver = __webpack_require__(5),
	    API    = __webpack_require__(30),
	    Event  = __webpack_require__(32);

	var DEFAULT_PORTS    = {'http:': 80, 'https:': 443, 'ws:':80, 'wss:': 443},
	    SECURE_PROTOCOLS = ['https:', 'wss:'];

	var Client = function(_url, protocols, options) {
	  options = options || {};

	  this.url     = _url;
	  this._driver = driver.client(this.url, {maxLength: options.maxLength, protocols: protocols});

	  ['open', 'error'].forEach(function(event) {
	    this._driver.on(event, function() {
	      self.headers    = self._driver.headers;
	      self.statusCode = self._driver.statusCode;
	    });
	  }, this);

	  var proxy      = options.proxy || {},
	      endpoint   = url.parse(proxy.origin || this.url),
	      port       = endpoint.port || DEFAULT_PORTS[endpoint.protocol],
	      secure     = SECURE_PROTOCOLS.indexOf(endpoint.protocol) >= 0,
	      onConnect  = function() { self._onConnect() },
	      netOptions = options.net || {},
	      originTLS  = options.tls || {},
	      socketTLS  = proxy.origin ? (proxy.tls || {}) : originTLS,
	      self       = this;

	  netOptions.host = socketTLS.host = endpoint.hostname;
	  netOptions.port = socketTLS.port = port;

	  originTLS.ca = originTLS.ca || options.ca;
	  socketTLS.servername = socketTLS.servername || endpoint.hostname;

	  this._stream = secure
	               ? tls.connect(socketTLS, onConnect)
	               : net.connect(netOptions, onConnect);

	  if (proxy.origin) this._configureProxy(proxy, originTLS);

	  API.call(this, options);
	};
	util.inherits(Client, API);

	Client.prototype._onConnect = function() {
	  var worker = this._proxy || this._driver;
	  worker.start();
	};

	Client.prototype._configureProxy = function(proxy, originTLS) {
	  var uri    = url.parse(this.url),
	      secure = SECURE_PROTOCOLS.indexOf(uri.protocol) >= 0,
	      self   = this,
	      name;

	  this._proxy = this._driver.proxy(proxy.origin);

	  if (proxy.headers) {
	    for (name in proxy.headers) this._proxy.setHeader(name, proxy.headers[name]);
	  }

	  this._proxy.pipe(this._stream, {end: false});
	  this._stream.pipe(this._proxy);

	  this._proxy.on('connect', function() {
	    if (secure) {
	      var options = {socket: self._stream, servername: uri.hostname};
	      for (name in originTLS) options[name] = originTLS[name];
	      self._stream = tls.connect(options);
	      self._configureStream();
	    }
	    self._driver.io.pipe(self._stream);
	    self._stream.pipe(self._driver.io);
	    self._driver.start();
	  });

	  this._proxy.on('error', function(error) {
	    self._driver.emit('error', error);
	  });
	};

	module.exports = Client;


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = require("tls");

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Stream      = __webpack_require__(9).Stream,
	    util        = __webpack_require__(4),
	    driver      = __webpack_require__(5),
	    Headers     = __webpack_require__(10),
	    API         = __webpack_require__(30),
	    EventTarget = __webpack_require__(31),
	    Event       = __webpack_require__(32);

	var EventSource = function(request, response, options) {
	  this.writable = true;
	  options = options || {};

	  this._stream = response.socket;
	  this._ping   = options.ping  || this.DEFAULT_PING;
	  this._retry  = options.retry || this.DEFAULT_RETRY;

	  var scheme       = driver.isSecureRequest(request) ? 'https:' : 'http:';
	  this.url         = scheme + '//' + request.headers.host + request.url;
	  this.lastEventId = request.headers['last-event-id'] || '';
	  this.readyState  = API.CONNECTING;

	  var headers = new Headers(),
	      self    = this;

	  if (options.headers) {
	    for (var key in options.headers) headers.set(key, options.headers[key]);
	  }

	  if (!this._stream || !this._stream.writable) return;
	  process.nextTick(function() { self._open() });

	  this._stream.setTimeout(0);
	  this._stream.setNoDelay(true);

	  var handshake = 'HTTP/1.1 200 OK\r\n' +
	                  'Content-Type: text/event-stream\r\n' +
	                  'Cache-Control: no-cache, no-store\r\n' +
	                  'Connection: close\r\n' +
	                  headers.toString() +
	                  '\r\n' +
	                  'retry: ' + Math.floor(this._retry * 1000) + '\r\n\r\n';

	  this._write(handshake);

	  this._stream.on('drain', function() { self.emit('drain') });

	  if (this._ping)
	    this._pingTimer = setInterval(function() { self.ping() }, this._ping * 1000);

	  ['error', 'end'].forEach(function(event) {
	    self._stream.on(event, function() { self.close() });
	  });
	};
	util.inherits(EventSource, Stream);

	EventSource.isEventSource = function(request) {
	  if (request.method !== 'GET') return false;
	  var accept = (request.headers.accept || '').split(/\s*,\s*/);
	  return accept.indexOf('text/event-stream') >= 0;
	};

	var instance = {
	  DEFAULT_PING:   10,
	  DEFAULT_RETRY:  5,

	  _write: function(chunk) {
	    if (!this.writable) return false;
	    try {
	      return this._stream.write(chunk, 'utf8');
	    } catch (e) {
	      return false;
	    }
	  },

	  _open: function() {
	    if (this.readyState !== API.CONNECTING) return;

	    this.readyState = API.OPEN;

	    var event = new Event('open');
	    event.initEvent('open', false, false);
	    this.dispatchEvent(event);
	  },

	  write: function(message) {
	    return this.send(message);
	  },

	  end: function(message) {
	    if (message !== undefined) this.write(message);
	    this.close();
	  },

	  send: function(message, options) {
	    if (this.readyState > API.OPEN) return false;

	    message = String(message).replace(/(\r\n|\r|\n)/g, '$1data: ');
	    options = options || {};

	    var frame = '';
	    if (options.event) frame += 'event: ' + options.event + '\r\n';
	    if (options.id)    frame += 'id: '    + options.id    + '\r\n';
	    frame += 'data: ' + message + '\r\n\r\n';

	    return this._write(frame);
	  },

	  ping: function() {
	    return this._write(':\r\n\r\n');
	  },

	  close: function() {
	    if (this.readyState > API.OPEN) return false;

	    this.readyState = API.CLOSED;
	    this.writable = false;
	    if (this._pingTimer) clearInterval(this._pingTimer);
	    if (this._stream) this._stream.end();

	    var event = new Event('close');
	    event.initEvent('close', false, false);
	    this.dispatchEvent(event);

	    return true;
	  }
	};

	for (var method in instance) EventSource.prototype[method] = instance[method];
	for (var key in EventTarget) EventSource.prototype[key] = EventTarget[key];

	module.exports = EventSource;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _datatypes = __webpack_require__(38);

	var _datatypes2 = _interopRequireDefault(_datatypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AXIS = ['x', 'y', 'z'];

	/**
	 * Debug
	 */

	var VolumeIO = function () {
	    /**
	     * Constructor
	     *
	     * @param {ArrayBuffer} buffer
	     */
	    function VolumeIO(buffer) {
	        _classCallCheck(this, VolumeIO);

	        this.littleEndian = true;
	        this.headerLength = 352;
	        this.buffer = buffer;
	        this.header = new DataView(buffer, 0, this.headerLength);
	        this.body = this.getBodyView();
	        this.cache = new Map();
	    }

	    _createClass(VolumeIO, [{
	        key: 'getBytePerVoxel',


	        /**
	         * Get data type
	         *
	         * @return {Number}
	         */
	        value: function getBytePerVoxel() {
	            return this.header.getUint16(72, this.littleEndian) / 8;
	        }

	        /**
	         * Get data type
	         *
	         * @return {Number}
	         */

	    }, {
	        key: 'getDataType',
	        value: function getDataType() {
	            return this.header.getUint16(70, this.littleEndian);
	        }

	        /**
	         * Get body view
	         *
	         * @return {TypedAray}
	         */

	    }, {
	        key: 'getBodyView',
	        value: function getBodyView() {
	            var buffer = this.buffer,
	                headerLength = this.headerLength;

	            var datatype = this.getDataType();

	            switch (datatype) {
	                case _datatypes2.default.NIFTI_TYPE_UINT8:
	                    return new Uint8Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_INT16:
	                    return new Int16Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_INT32:
	                    return new Int32Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_FLOAT32:
	                    return new Float32Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_FLOAT64:
	                    return new Float64Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_INT8:
	                    return new Int8Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_UINT16:
	                    return new Uint16Array(buffer, headerLength);

	                case _datatypes2.default.NIFTI_TYPE_UINT32:
	                    return new Uint32Array(buffer, headerLength);
	            }
	        }

	        /**
	         * Set slice
	         *
	         * @param {String} axis
	         * @param {Number} position
	         * @param {Number} buffer
	         */

	    }, {
	        key: 'getSlice',
	        value: function getSlice(axis, position) {
	            var key = axis + '-' + position;

	            if (!this.cache.has(key)) {
	                this.cache.set(key, this.renderSlice(axis, position));
	            }

	            return this.cache.get(key);
	        }

	        /**
	         * Render slice
	         *
	         * @param {String} axis
	         * @param {Number} position
	         *
	         * @return {ImageData}
	         */

	    }, {
	        key: 'renderSlice',
	        value: function renderSlice(axis, position) {
	            var _getDimensions = this.getDimensions(axis),
	                width = _getDimensions.width,
	                height = _getDimensions.height,
	                length = _getDimensions.length,
	                offsetWidth = _getDimensions.offsetWidth,
	                offsetHeight = _getDimensions.offsetHeight,
	                offset = _getDimensions.offset;

	            if (position < 0 || position >= length) {
	                throw new Error('Position \'' + position + '\' is invalid [0, ' + length + '[.');
	            }

	            var buffer = new ImageData(width, height);
	            var zOffset = position * offset;

	            for (var i = 0, row = 0; row < height; row++) {
	                var zyOffset = zOffset + (height - row) * offsetHeight;

	                for (var col = 0; col < width; col++) {
	                    var zyxOffset = zyOffset + col * offsetWidth;
	                    var value = this.body[zyxOffset];
	                    var color = Math.round(value / 1000 * 255);

	                    buffer.data[i] = color; // red
	                    buffer.data[i + 1] = color; // green
	                    buffer.data[i + 2] = color; // blue
	                    buffer.data[i + 3] = 255; // alpha

	                    i += 4;
	                }
	            }

	            return buffer;
	        }

	        /**
	        * Get cut dimensions
	        *
	        * @param {MRI} mri
	        * @param {String} axis
	        *
	        * @return {Object}
	        */

	    }, {
	        key: 'getDimensions',
	        value: function getDimensions(axis) {
	            var list = AXIS.slice(0);

	            list.splice(list.indexOf(axis), 1);

	            return {
	                length: this[axis],
	                width: this[list[0]],
	                height: this[list[1]],
	                offset: this.getOffset(axis),
	                offsetWidth: this.getOffset(list[0]),
	                offsetHeight: this.getOffset(list[1])
	            };
	        }

	        /**
	         * Get axis offset (position in the buffer)
	         *
	         * @param {String} axis
	         *
	         * @return {Number}
	         */

	    }, {
	        key: 'getOffset',
	        value: function getOffset(axis) {
	            var list = AXIS;
	            var length = list.length;

	            var offset = 1;

	            for (var i = 0; i < length; i++) {
	                var axisName = list[i];

	                if (axisName === axis) {
	                    break;
	                }

	                offset *= this[axisName];
	            }

	            return offset;
	        }
	        /**
	         * Debug
	         */

	    }, {
	        key: 'debug',
	        value: function debug() {
	            var buffer = this.buffer,
	                header = this.header,
	                headerLength = this.headerLength,
	                littleEndian = this.littleEndian;

	            var headerBytes = new Uint8Array(buffer, 0, headerLength);

	            console.title = function (message) {
	                console.log(message + ' ' + '-'.repeat(50 - message.length));
	            };

	            console.title('header');
	            console.log('0: sizeof_hdr', header.getUint16(0, littleEndian));

	            console.title('unused');
	            console.log('4: data_type', String.fromCharCode.apply(null, headerBytes.subarray(4, 14)));
	            console.log('14: db_name', String.fromCharCode.apply(null, headerBytes.subarray(14, 32)));
	            console.log('32: extents', header.getUint16(32, littleEndian));
	            console.log('36: session_error', header.getUint16(36, littleEndian));
	            console.log('38: regular', String.fromCharCode.apply(null, headerBytes.subarray(38, 39)));
	            console.log('39: dim_info', String.fromCharCode.apply(null, headerBytes.subarray(38, 39)));

	            console.title('dim: Data array dimensions');
	            console.log('40', header.getUint16(40, littleEndian));
	            console.log('42', header.getUint16(42, littleEndian));
	            console.log('44', header.getUint16(44, littleEndian));
	            console.log('46', header.getUint16(46, littleEndian));
	            console.log('48', header.getUint16(48, littleEndian));
	            console.log('50', header.getUint16(50, littleEndian));
	            console.log('52', header.getUint16(52, littleEndian));
	            console.log('54', header.getUint16(54, littleEndian));

	            console.title('Itent');
	            console.log('56: intent_p1', header.getFloat32(56, littleEndian));
	            console.log('60: intent_p2', header.getFloat32(60, littleEndian));
	            console.log('64: intent_p3', header.getFloat32(64, littleEndian));
	            console.log('68: intent_code', header.getUint16(68, littleEndian));

	            console.title('Data type');
	            console.log('70: datatype', header.getUint16(70, littleEndian));
	            console.log('72: bitpix', header.getUint16(72, littleEndian));
	            console.log('74: slice_start', header.getUint16(74, littleEndian));

	            console.title('pixdim: grid spacing');
	            console.log('76', header.getFloat32(76, littleEndian));
	            console.log('80', header.getFloat32(80, littleEndian));
	            console.log('84', header.getFloat32(84, littleEndian));
	            console.log('88', header.getFloat32(88, littleEndian));
	            console.log('92', header.getFloat32(92, littleEndian));
	            console.log('96', header.getFloat32(96, littleEndian));
	            console.log('100', header.getFloat32(100, littleEndian));
	            console.log('104', header.getFloat32(104, littleEndian));

	            console.title('Voxel');
	            console.log('108: vox_offset', header.getFloat32(108, littleEndian));
	            console.log('112: scl_slope', header.getFloat32(112, littleEndian));
	            console.log('116: scl_inter', header.getFloat32(116, littleEndian));
	            console.log('120: slice_end', header.getUint16(120, littleEndian));
	            console.log('122: slice_code', String.fromCharCode.apply(null, headerBytes.subarray(122, 123)));
	            console.log('123: xyzt_units', String.fromCharCode.apply(null, headerBytes.subarray(123, 124)));

	            console.title('Intensity:');
	            console.log('124: cal_max', header.getFloat32(124, littleEndian));
	            console.log('128: cal_min', header.getFloat32(128, littleEndian));

	            console.title('Time');
	            console.log('132: slice_duration', header.getFloat32(132, littleEndian));
	            console.log('136: toffset', header.getFloat32(136, littleEndian));

	            console.title('Unused');
	            console.log('140: glmax', header.getUint16(140, littleEndian));
	            console.log('144: glmin', header.getUint16(144, littleEndian));

	            console.title('History');
	            console.log('148: description', String.fromCharCode.apply(null, headerBytes.subarray(148, 228)));
	            console.log('228: auxiliary file name', String.fromCharCode.apply(null, headerBytes.subarray(228, 252)));

	            console.title('Transform');
	            console.log('252: qform_code', header.getUint16(252, littleEndian));
	            console.log('254: sform_code', header.getUint16(254, littleEndian));

	            console.log('256: quatern_b', header.getFloat32(256, littleEndian));
	            console.log('260: quatern_c', header.getFloat32(260, littleEndian));
	            console.log('264: quatern_d', header.getFloat32(264, littleEndian));
	            console.log('268: qoffset_x', header.getFloat32(268, littleEndian));
	            console.log('272: qoffset_y', header.getFloat32(272, littleEndian));
	            console.log('276: qoffset_z', header.getFloat32(276, littleEndian));

	            console.title('srow_x');
	            console.log('280', header.getFloat32(280, littleEndian));
	            console.log('284', header.getFloat32(284, littleEndian));
	            console.log('288', header.getFloat32(288, littleEndian));
	            console.log('292', header.getFloat32(292, littleEndian));

	            console.title('srow_y');
	            console.log('296', header.getFloat32(296, littleEndian));
	            console.log('300', header.getFloat32(300, littleEndian));
	            console.log('304', header.getFloat32(304, littleEndian));
	            console.log('308', header.getFloat32(308, littleEndian));

	            console.title('srow_z');
	            console.log('312', header.getFloat32(312, littleEndian));
	            console.log('316', header.getFloat32(316, littleEndian));
	            console.log('320', header.getFloat32(320, littleEndian));
	            console.log('324', header.getFloat32(324, littleEndian));

	            console.title('Name of data');
	            console.log('328: intent_name', header.getFloat32(328, littleEndian));

	            console.title('Magic number');
	            console.log('344: magic', String.fromCharCode.apply(null, headerBytes.subarray(344, this.headerLength)));
	        }

	        /**
	         * Debug view
	         */

	    }, {
	        key: 'debugView',
	        value: function debugView() {
	            var length = this.body.length;
	            var min = this.body[0];
	            var max = this.body[0];

	            for (var i = 1; i < length; i++) {
	                max = Math.max(this.body[i], max);
	                min = Math.min(this.body[i], min);
	            }

	            console.title('view');
	            console.log('Number of voxel: %s', length);
	            console.log('Value range: [%s;%s]', min, max);
	        }
	    }, {
	        key: 'x',
	        get: function get() {
	            return this.header.getUint16(42, this.littleEndian);
	        }
	    }, {
	        key: 'y',
	        get: function get() {
	            return this.header.getUint16(44, this.littleEndian);
	        }
	    }, {
	        key: 'z',
	        get: function get() {
	            return this.header.getUint16(46, this.littleEndian);
	        }
	    }]);

	    return VolumeIO;
	}();

	exports.default = VolumeIO;

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    NIFTI_TYPE_UINT8: 2, // unsigned char.
	    NIFTI_TYPE_INT16: 4, // signed short.
	    NIFTI_TYPE_INT32: 8, // signed int.
	    NIFTI_TYPE_FLOAT32: 16, // 32 bit float.
	    // NIFTI_TYPE_COMPLEX64:      32, // 64 bit complex = 2 32 bit floats.
	    NIFTI_TYPE_FLOAT64: 64, // 64 bit float = double.
	    // NIFTI_TYPE_RGB24:         128, // 3 8 bit bytes.
	    NIFTI_TYPE_INT8: 256, // signed char.
	    NIFTI_TYPE_UINT16: 512, // unsigned short.
	    NIFTI_TYPE_UINT32: 768 };

/***/ }
/******/ ]);