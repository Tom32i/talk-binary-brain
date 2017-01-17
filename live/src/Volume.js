import DATATYPES from './datatypes';

/**
 * MRI Volume
 */
class Volume {

    static get AXIS() { return ['x', 'y', 'z']; }
    static get HEADER_LENGTH() { return 352; }
    static get MAX() { return 1000; }

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
        this.body = autoload ? this.createBodyView() : null;
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
        const index = Array.from(DATATYPES.values()).indexOf(TypedArray);
        const dataType = Array.from(DATATYPES.keys())[index];
        const buffer = new ArrayBuffer(byteLength);
        const volume = new Volume(buffer, false);

        volume.setDefaultHeader(x, y, z, bytePerVoxel * 8, dataType);
        volume.body = volume.createBodyView();

        return volume;
    }

    get x() { return this.header.getUint16(42, this.littleEndian); }
    get y() { return this.header.getUint16(44, this.littleEndian); }
    get z() { return this.header.getUint16(46, this.littleEndian); }

    /**
     * Get byte per voxel
     *
     * @return {Number}
     */
    get bitPerVoxel() { return this.header.getUint16(72, this.littleEndian); }

    /**
     * Get data type
     *
     * @return {Number}
     */
    get dataType() { return this.header.getUint16(70, this.littleEndian); }

    /**
     * Create body view
     *
     * @return {TypedArray}
     */
    createBodyView() {
        const TypedArray = DATATYPES.get(this.dataType);

        return new TypedArray(this.buffer, Volume.HEADER_LENGTH);
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
                const color = Math.round((value / Volume.MAX) * 255);

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

    setDefaultHeader(x, y, z, bitPerVoxel, datatype, min = 0, max = 255) {
        const { header, littleEndian, buffer } = this;

        // Set header size: sizeof_hdr
        header.setUint32(0, 348, littleEndian);

        // Set number of dimensions: dim 3|4
        header.setUint16(40, 3, littleEndian);

        // Set dimensions (x, y, z, (time))
        header.setUint16(42, x, littleEndian);
        header.setUint16(44, y, littleEndian);
        header.setUint16(46, z, littleEndian);
        header.setUint16(48, 1, littleEndian);
        header.setUint16(50, 1, littleEndian);
        header.setUint16(52, 1, littleEndian);
        header.setUint16(54, 1, littleEndian);

        // Set data type: http://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields/nifti1fields_pages/datatype.html
        header.setUint16(70, datatype, littleEndian);
        // Set bit per voxel: http://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields/nifti1fields_pages/bitpix.html
        header.setUint16(72, bitPerVoxel, littleEndian);

        // Set steps (x, y, z, time) : pixdim
        header.setFloat32(76, 1, littleEndian);
        header.setFloat32(80, 1, littleEndian);
        header.setFloat32(84, 1, littleEndian);
        header.setFloat32(88, 1, littleEndian);
        header.setFloat32(92, 0, littleEndian);

        // Set voxel offset: vox_offset
        header.setFloat32(108, Volume.HEADER_LENGTH, littleEndian);

        // Set data scaling: scl_slope and scl_inter
        header.setFloat32(112, 1, littleEndian);
        header.setFloat32(116, 0, littleEndian);

        // Units: millimeters
        header.setUint16(122, 512, littleEndian)
        header.setUint16(123, 2, littleEndian)

        // Set intensity (max, min)
        header.setFloat32(124, max, littleEndian);
        header.setFloat32(128, min, littleEndian);

        // 3d image (volume) orientation and location in space: qform_code and sform_code
        header.setUint16(252, 2, littleEndian);
        header.setUint16(254, 1, littleEndian);

        // Transform
        const transform = [
          [ 1, 0, 0, -0],
          [ 0, 1, 0, -0],
          [ 0, 0, 1, -0],
        ];

        // Qform
        header.setFloat32(256, 0, littleEndian);
        header.setFloat32(260, 0, littleEndian);
        header.setFloat32(264, 0, littleEndian);
        header.setFloat32(268, transform[0][3], littleEndian);
        header.setFloat32(272, transform[1][3], littleEndian);
        header.setFloat32(276, transform[2][3], littleEndian);

        // Sform
        header.setFloat32(280, transform[0][0], littleEndian);
        header.setFloat32(284, transform[0][1], littleEndian);
        header.setFloat32(288, transform[0][2], littleEndian);
        header.setFloat32(292, transform[0][3], littleEndian);
        header.setFloat32(296, transform[1][0], littleEndian);
        header.setFloat32(300, transform[1][1], littleEndian);
        header.setFloat32(304, transform[1][2], littleEndian);
        header.setFloat32(308, transform[1][3], littleEndian);
        header.setFloat32(312, transform[2][0], littleEndian);
        header.setFloat32(316, transform[2][1], littleEndian);
        header.setFloat32(320, transform[2][2], littleEndian);
        header.setFloat32(324, transform[2][3], littleEndian);

        // Set magic number:
        const magicByte = new Uint8Array(buffer, 344, 348);
        const magic = 'n+1';
        //const magicByte = bytes.subarray(344, 348);

        for (var i = magic.length - 1; i >= 0; i--) {
            magicByte[i] = magic.charCodeAt(i);
        }
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
