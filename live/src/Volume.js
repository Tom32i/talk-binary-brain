import DATATYPES from './datatypes';

/**
 * MRI Volume
 */
class Volume {

    static get AXIS() { return ['x', 'y', 'z']; }
    static get HEADER_LENGTH() { return 352; }

    /**
     * Constructor
     *
     * @param {ArrayBuffer} buffer
     */
    constructor(buffer, autoload = true) {
        this.littleEndian = true;
        this.buffer = buffer;
        this.header = new DataView(buffer, 0, Volume.HEADER_LENGTH);
        this.cache = new Map();
    }

    /**
     * Create a new empty volume with the given dimensions
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {TypedArray} TypedArray
     *
     * @return {Volume}
     */
    static create(x, y, z, TypedArray) {
        const bytePerVoxel = TypedArray.BYTES_PER_ELEMENT;
        const byteLength = Volume.HEADER_LENGTH + x * y * z * bytePerVoxel;
        const buffer = new ArrayBuffer(byteLength);
        const volume = new Volume(buffer, false);

        volume.x = x;
        volume.y = y;
        volume.z = z;
        volume.bitPerVoxel = bytePerVoxel * 8;
        volume.dataType = DATATYPES.keys()[Array.from(DATATYPES.values()).indexOf(TypedArray)];

        return volume;
    }

    get x() { return this.header.getUint16(42, this.littleEndian); }
    get y() { return this.header.getUint16(44, this.littleEndian); }
    get z() { return this.header.getUint16(46, this.littleEndian); }

    set x(value) { this.header.setUint16(42, this.littleEndian, value); }
    set y(value) { this.header.setUint16(44, this.littleEndian, value); }
    set z(value) { this.header.setUint16(46, this.littleEndian, value); }

    /**
     * Get byte per voxel
     *
     * @return {Number}
     */
    get bitPerVoxel() { return this.header.getUint16(72, this.littleEndian); }
    set bitPerVoxel(value) { return this.header.setUint16(72, this.littleEndian, value); }

    /**
     * Get data type
     *
     * @return {Number}
     */
    get dataType() { return this.header.getUint16(70, this.littleEndian); }
    set dataType(value) { return this.header.setUint16(70, this.littleEndian, value); }

    /**
     * Get (and create) body view
     *
     * @return {TypedArray}
     */
    get body() {
        if (!this.bodyView) {
            const TypedArray = DATATYPES.get(this.dataType);

            this.bodyView = new TypedArray(this.buffer, Volume.HEADER_LENGTH);
        }

        return this.bodyView;
    }

    /**
     * Set slice
     *
     * @param {String} axis
     * @param {Number} position
     * @param {Number} buffer
     */
    getSlice(axis, position) {
        const key = `${axis}-${position}`;

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
    renderSlice(axis, position) {
        const { width, height, length, offsetWidth, offsetHeight, offset } = this.getDimensions(axis);

        if (position < 0 || position >= length) {
            throw new Error(`Position '${position}' is invalid [0, ${length}[.`);
        }

        const buffer = new ImageData(width, height);
        const zOffset = position * offset;

        for (let i = 0, row = 0; row < height; row++) {
            const zyOffset = zOffset + (height - row) * offsetHeight;

            for (let col = 0; col < width; col++) {
                const zyxOffset = zyOffset + (width - col) * offsetWidth;
                const value = this.body[zyxOffset];
                const color = Math.round((value / 700) * 255);

                buffer.data[i++] = color; // red
                buffer.data[i++] = color; // green
                buffer.data[i++] = color; // blue
                buffer.data[i++] = 255;   // alpha
            }
        }

        return buffer;
    }

    getXYZOffset(x, y, z) {
        const offsetX = /*this.getOffset('x'); /*/ 1;
        const offsetY = /*this.getOffset('y'); /*/ 1 * this.x;
        const offsetZ = /*this.getOffset('z'); /*/ 1 * this.x * this.y;
        const index = x * offsetX + y * offsetY + z * offsetZ;

        console.log('[%s,%s,%s] (%s) = %s', x, y, z, index, this.body[index]);
    }

    /**
    * Get cut dimensions
    *
    * @param {MRI} mri
    * @param {String} axis
    *
    * @return {Object}
    */
    getDimensions(axis) {
        const list = Volume.AXIS.slice(0);

        list.splice(list.indexOf(axis), 1);

        return {
          length: this[axis],
          width: this[list[0]],
          height: this[list[1]],
          offset: this.getOffset(axis),
          offsetWidth: this.getOffset(list[0]),
          offsetHeight: this.getOffset(list[1]),
        };
    }

    /**
     * Get axis offset (position in the buffer)
     *
     * @param {String} axis
     *
     * @return {Number}
     */
    getOffset(axis) {
        const list = Volume.AXIS;
        const { length } = list;
        let offset = 1;

        for (let i = 0; i < length; i++) {
            const axisName = list[i];

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
    debug() {
        const { buffer, header, littleEndian } = this;
        const headerBytes = new Uint8Array(buffer, 0, Volume.HEADER_LENGTH);

        console.title = function(message) { console.info(message + ' ' + '-'.repeat(50 - message.length)); }

        console.title('header');
        console.info('0: sizeof_hdr', header.getUint16(0, littleEndian));

        console.title('unused');
        console.info('4: data_type', String.fromCharCode.apply(null, headerBytes.subarray(4, 14)));
        console.info('14: db_name', String.fromCharCode.apply(null, headerBytes.subarray(14, 32)));
        console.info('32: extents', header.getUint16(32, littleEndian));
        console.info('36: session_error', header.getUint16(36, littleEndian));
        console.info('38: regular', String.fromCharCode.apply(null, headerBytes.subarray(38, 39)));
        console.info('39: dim_info', String.fromCharCode.apply(null, headerBytes.subarray(38, 39)));

        console.title('dim: Data array dimensions');
        console.info('40', header.getUint16(40, littleEndian));
        console.info('42', header.getUint16(42, littleEndian));
        console.info('44', header.getUint16(44, littleEndian));
        console.info('46', header.getUint16(46, littleEndian));
        console.info('48', header.getUint16(48, littleEndian));
        console.info('50', header.getUint16(50, littleEndian));
        console.info('52', header.getUint16(52, littleEndian));
        console.info('54', header.getUint16(54, littleEndian));

        console.title('Itent');
        console.info('56: intent_p1', header.getFloat32(56, littleEndian));
        console.info('60: intent_p2', header.getFloat32(60, littleEndian));
        console.info('64: intent_p3', header.getFloat32(64, littleEndian));
        console.info('68: intent_code', header.getUint16(68, littleEndian));

        console.title('Data type');
        console.info('70: datatype', header.getUint16(70, littleEndian));
        console.info('72: bitpix', header.getUint16(72, littleEndian));
        console.info('74: slice_start', header.getUint16(74, littleEndian));

        console.title('pixdim: grid spacing');
        console.info('76', header.getFloat32(76, littleEndian));
        console.info('80', header.getFloat32(80, littleEndian));
        console.info('84', header.getFloat32(84, littleEndian));
        console.info('88', header.getFloat32(88, littleEndian));
        console.info('92', header.getFloat32(92, littleEndian));
        console.info('96', header.getFloat32(96, littleEndian));
        console.info('100', header.getFloat32(100, littleEndian));
        console.info('104', header.getFloat32(104, littleEndian));

        console.title('Voxel');
        console.info('108: vox_offset', header.getFloat32(108, littleEndian));
        console.info('112: scl_slope', header.getFloat32(112, littleEndian));
        console.info('116: scl_inter', header.getFloat32(116, littleEndian));
        console.info('120: slice_end', header.getUint16(120, littleEndian));
        console.info('122: slice_code', String.fromCharCode.apply(null, headerBytes.subarray(122, 123)));
        console.info('123: xyzt_units', String.fromCharCode.apply(null, headerBytes.subarray(123, 124)));

        console.title('Intensity:');
        console.info('124: cal_max', header.getFloat32(124, littleEndian));
        console.info('128: cal_min', header.getFloat32(128, littleEndian));

        console.title('Time');
        console.info('132: slice_duration', header.getFloat32(132, littleEndian));
        console.info('136: toffset', header.getFloat32(136, littleEndian));

        console.title('Unused');
        console.info('140: glmax', header.getUint16(140, littleEndian));
        console.info('144: glmin', header.getUint16(144, littleEndian));

        console.title('History');
        console.info('148: description', String.fromCharCode.apply(null, headerBytes.subarray(148, 228)));
        console.info('228: auxiliary file name', String.fromCharCode.apply(null, headerBytes.subarray(228, 252)));

        console.title('Transform');
        console.info('252: qform_code', header.getUint16(252, littleEndian));
        console.info('254: sform_code', header.getUint16(254, littleEndian));

        console.info('256: quatern_b', header.getFloat32(256, littleEndian));
        console.info('260: quatern_c', header.getFloat32(260, littleEndian));
        console.info('264: quatern_d', header.getFloat32(264, littleEndian));
        console.info('268: qoffset_x', header.getFloat32(268, littleEndian));
        console.info('272: qoffset_y', header.getFloat32(272, littleEndian));
        console.info('276: qoffset_z', header.getFloat32(276, littleEndian));

        console.title('srow_x');
        console.info('280', header.getFloat32(280, littleEndian));
        console.info('284', header.getFloat32(284, littleEndian));
        console.info('288', header.getFloat32(288, littleEndian));
        console.info('292', header.getFloat32(292, littleEndian));

        console.title('srow_y');
        console.info('296', header.getFloat32(296, littleEndian));
        console.info('300', header.getFloat32(300, littleEndian));
        console.info('304', header.getFloat32(304, littleEndian));
        console.info('308', header.getFloat32(308, littleEndian));

        console.title('srow_z');
        console.info('312', header.getFloat32(312, littleEndian));
        console.info('316', header.getFloat32(316, littleEndian));
        console.info('320', header.getFloat32(320, littleEndian));
        console.info('324', header.getFloat32(324, littleEndian));

        console.title('Name of data');
        console.info('328: intent_name', header.getFloat32(328, littleEndian));

        console.title('Magic number');
        console.info('344: magic',  String.fromCharCode.apply(null, headerBytes.subarray(344, Volume.HEADER_LENGTH)));
    }

    /**
     * Debug view
     */
    debugView() {
        const length = this.body.length;
        let min = this.body[0];
        let max = this.body[0];

        for (let i = 1; i < length; i++) {
            max = Math.max(this.body[i], max);
            min = Math.min(this.body[i], min);
        }

        console.title('view');
        console.info('Number of voxel: %s', length);
        console.info('Value range: [%s;%s]', min, max);
    }
}

export default Volume;
