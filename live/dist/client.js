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

	var _VolumeIO = __webpack_require__(1);

	var _VolumeIO2 = _interopRequireDefault(_VolumeIO);

	var _Request = __webpack_require__(3);

	var _Request2 = _interopRequireDefault(_Request);

	var _Navigator = __webpack_require__(5);

	var _Navigator2 = _interopRequireDefault(_Navigator);

	var _Canvas = __webpack_require__(4);

	var _Canvas2 = _interopRequireDefault(_Canvas);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Client = function () {
	    function Client() {
	        _classCallCheck(this, Client);

	        this.slice = this.slice.bind(this);
	        this.onOpen = this.onOpen.bind(this);
	        this.onMessage = this.onMessage.bind(this);
	        this.onFileLoaded = this.onFileLoaded.bind(this);

	        this.socket = new WebSocket('ws://localhost:8032', 'websocket');
	        this.canvas = new _Canvas2.default();
	        this.navigator = new _Navigator2.default(this.slice.bind(this));
	        this.volume = null;

	        this.socket.binaryType = 'arraybuffer';

	        this.socket.addEventListener('open', this.onOpen);
	        this.socket.addEventListener('message', this.onMessage);

	        this.request = new _Request2.default('brain.nii', this.onFileLoaded, function (error) {
	            return console.error(error);
	        });
	    }

	    _createClass(Client, [{
	        key: 'onOpen',
	        value: function onOpen() {
	            console.info('Socket open.');
	        }
	    }, {
	        key: 'onFileLoaded',
	        value: function onFileLoaded(buffer) {
	            this.volume = new _VolumeIO2.default(buffer);

	            var _volume = this.volume,
	                x = _volume.x,
	                y = _volume.y,
	                z = _volume.z;

	            var voxel = this.volume.getBytePerVoxel();

	            console.log('Volume: ' + x + ' \u2A09 ' + y + ' \u2A09 ' + z);
	            console.log('Voxel: ' + voxel + ' octets');
	            console.log('Body: ' + this.volume.body.length);

	            this.navigator.setMaxs(x - 1, y - 1, z - 1);

	            //this.volume.debug();
	            //this.volume.debugView();
	            this.slice('x', Math.round(x / 2));
	        }

	        /**
	         * Display a slice
	         *
	         * @param {String} axis
	         * @param {Number} index
	         */

	    }, {
	        key: 'slice',
	        value: function slice(axis, index) {
	            this.canvas.load(this.volume.getSlice(axis, index));
	        }

	        /**
	         * On message
	         *
	         * @param {Event} event
	         */

	    }, {
	        key: 'onMessage',
	        value: function onMessage(event) {
	            console.log('onMessage', event);
	            /*const { name, id, x, y } = readBuffer(event.data);
	             console.info(`Received ${name} [${x}, ${y}] for id ${id}.`);
	            console.info(`Sending ${name} [${x + 1}, ${y + 1}] for id ${id}.`);
	             socket.send(getBuffer(name, id, x + 1 ,y + 1));*/
	        }
	    }]);

	    return Client;
	}();

	new Client();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _datatypes = __webpack_require__(2);

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
/* 2 */
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * HTTP Request
	 */
	var Request = function () {
	    /**
	     * @param {String} url
	     * @param {Function} success
	     * @param {Function} error
	     */
	    function Request(url, success, error) {
	        var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	        _classCallCheck(this, Request);

	        this.success = success;
	        this.error = error;
	        this.request = new XMLHttpRequest();

	        this.onReadyStateChange = this.onReadyStateChange.bind(this);
	        this.onError = this.onError.bind(this);

	        this.request.timeout = timeout;
	        this.request.addEventListener('readystatechange', this.onReadyStateChange);
	        this.request.addEventListener('error', this.onError);
	        this.request.addEventListener('timeout', this.onError);
	        this.request.open('GET', url, true);
	        this.request.responseType = 'arraybuffer';
	        this.request.send();
	    }

	    /**
	     * On ready state change
	     *
	     * @param {Event} event
	     */


	    _createClass(Request, [{
	        key: 'onReadyStateChange',
	        value: function onReadyStateChange(event) {
	            if (this.request.readyState === XMLHttpRequest.DONE) {
	                if (this.request.status === 200) {
	                    console.log(this.request.responseType);
	                    this.onSuccess(this.request.response);
	                } else {
	                    this.onError();
	                }
	            }
	        }

	        /**
	         * On success
	         *
	         * @param {Object} content
	         */

	    }, {
	        key: 'onSuccess',
	        value: function onSuccess(content) {
	            this.clear();
	            this.success(content);
	        }

	        /**
	         * On Error
	         */

	    }, {
	        key: 'onError',
	        value: function onError(event) {
	            this.clear();
	            this.error();
	        }

	        /**
	         * Clear the request
	         */

	    }, {
	        key: 'clear',
	        value: function clear() {
	            if (this.request) {
	                this.request.removeEventListener('readystatechange', this.onReadyStateChange);
	                this.request.removeEventListener('error', this.onError);
	                this.request = null;
	            }
	        }
	    }]);

	    return Request;
	}();

	exports.default = Request;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Canvas = function () {
	    function Canvas() {
	        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.createElement('canvas');

	        _classCallCheck(this, Canvas);

	        this.element = element;
	        this.context = this.element.getContext('2d');
	        this.scale = 4;

	        this.attach();
	    }

	    /**
	     * Set width
	     *
	     * @param {Number} width
	     * @param {Number} height
	     */


	    _createClass(Canvas, [{
	        key: 'setDimensions',
	        value: function setDimensions(width, height) {
	            if (this.element.width === width && this.element.height === height) {
	                return null;
	            }

	            this.element.width = width;
	            this.element.height = height;
	            this.element.style.width = width * this.scale + 'px';
	            this.element.style.height = height * this.scale + 'px';
	            this.context.globalCompositeOperation = 'copy';
	            this.context.imageSmoothingEnabled = false;
	        }

	        /**
	         * Load image data
	         *
	         * @param {ImageData} imageData
	         */

	    }, {
	        key: 'load',
	        value: function load(imageData) {
	            this.setDimensions(imageData.width, imageData.height);
	            this.context.putImageData(imageData, 0, 0);
	        }

	        /**
	         * Attach to DOM
	         */

	    }, {
	        key: 'attach',
	        value: function attach() {
	            document.body.appendChild(this.element);
	        }
	    }]);

	    return Canvas;
	}();

	exports.default = Canvas;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Navigator = function () {
	    function Navigator(callback) {
	        _classCallCheck(this, Navigator);

	        this.onChange = this.onChange.bind(this);

	        this.callback = callback;
	        this.x = this.getSlider('x', 100);
	        this.y = this.getSlider('y', 100);
	        this.z = this.getSlider('z', 100);

	        this.attach();
	    }

	    _createClass(Navigator, [{
	        key: 'onChange',
	        value: function onChange(event) {
	            var _event$target = event.target,
	                name = _event$target.name,
	                value = _event$target.value;


	            this.callback(name, value);
	        }
	    }, {
	        key: 'setMaxs',
	        value: function setMaxs(x, y, z) {
	            this.x.max = x;
	            this.y.max = y;
	            this.z.max = z;
	        }
	    }, {
	        key: 'getSlider',
	        value: function getSlider(name, max) {
	            var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	            var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	            var element = document.createElement('input');

	            element.type = 'range';
	            element.name = name;
	            element.min = min;
	            element.max = max;
	            element.step = step;

	            element.addEventListener('input', this.onChange);

	            return element;
	        }

	        /**
	         * Attach to DOM
	         */

	    }, {
	        key: 'attach',
	        value: function attach() {
	            var container = document.createElement('div');

	            container.id = 'navigator';

	            container.appendChild(this.x);
	            container.appendChild(this.y);
	            container.appendChild(this.z);

	            document.body.appendChild(container);
	        }
	    }]);

	    return Navigator;
	}();

	exports.default = Navigator;

/***/ }
/******/ ]);