import DATATYPES from './datatypes';

const AXIS = ['x', 'y', 'z'];

/**
 * MRI Volume
 */
class Volume {
    /**
     * Constructor
     *
     * @param {ArrayBuffer} buffer
     */
    constructor(buffer) {
        this.littleEndian = true;
        this.headerLength = 352;
        this.buffer = buffer;
        this.header = new DataView(buffer, 0, this.headerLength);
        this.body = this.getBodyView();
        this.cache = new Map();
    }

    get x() { return this.header.getUint16(42, this.littleEndian); }
    get y() { return this.header.getUint16(44, this.littleEndian); }
    get z() { return this.header.getUint16(46, this.littleEndian); }

    /**
     * Get data type
     *
     * @return {Number}
     */
    getBytePerVoxel() {
        return this.header.getUint16(72, this.littleEndian) / 8;
    }

    /**
     * Get data type
     *
     * @return {Number}
     */
    getDataType() {
        return this.header.getUint16(70, this.littleEndian);
    }

    /**
     * Get body view
     *
     * @return {TypedAray}
     */
    getBodyView() {
        const { buffer, headerLength } = this;
        const datatype = this.getDataType();

        switch (datatype) {
            case DATATYPES.NIFTI_TYPE_UINT8:
                return new Uint8Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_INT16:
                return new Int16Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_INT32:
                return new Int32Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_FLOAT32:
                return new Float32Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_FLOAT64:
                return new Float64Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_INT8:
                return new Int8Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_UINT16:
                return new Uint16Array(buffer, headerLength);

            case DATATYPES.NIFTI_TYPE_UINT32:
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
                const zyxOffset = zyOffset + col * offsetWidth;
                const value = this.body[zyxOffset];
                const color = Math.round((value / 1000) * 255);

                buffer.data[i++] = color; // red
                buffer.data[i++] = color; // green
                buffer.data[i++] = color; // blue
                buffer.data[i++] = 255;   // alpha
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
    getDimensions(axis) {
        const list = AXIS.slice(0);

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
        const list = AXIS;
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
        const { buffer, header, headerLength, littleEndian } = this;
        const headerBytes = new Uint8Array(buffer, 0, headerLength);

        console.title = function(message) { console.log(message + ' ' + '-'.repeat(50 - message.length)); }

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
        console.log('344: magic',  String.fromCharCode.apply(null, headerBytes.subarray(344, this.headerLength)));
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
        console.log('Number of voxel: %s', length);
        console.log('Value range: [%s;%s]', min, max);
    }
}

export default Volume;
