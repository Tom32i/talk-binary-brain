const DATATYPES = require('./datatypes');

/**
 * NIfTI Volume
 *
 * http://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields
 */
class Volume
{
    /**
     * Constructor
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.headerLength = 352;
        this.datatype = DATATYPES.NIFTI_TYPE_UINT8;
        this.bytePerVoxel = 1;
        this.min = 0;
        this.max = 255;
        this.axisList = ['x', 'y', 'z'];
        this.buffer = new ArrayBuffer(this.headerLength + x * y * z * this.bytePerVoxel);
        this.view = new Uint8Array(this.buffer, this.headerLength);

        this.buildHeader();
    }

    /**
     * Build the Nifti-1 header
     */
    buildHeader() {
        const littleEndian = true;
        const view = new DataView(this.buffer, 0, 348);
        const bytes = new Uint8Array(this.buffer, 0, 348);

        // Set header size: sizeof_hdr
        view.setUint32(0, 348, littleEndian);

        // Set number of dimensions: dim 3|4
        view.setUint16(40, 3, littleEndian);

        // Set dimensions (x, y, z, (time))
        view.setUint16(42, this.x, littleEndian);
        view.setUint16(44, this.y, littleEndian);
        view.setUint16(46, this.z, littleEndian);
        view.setUint16(48, 1, littleEndian);
        view.setUint16(50, 1, littleEndian);
        view.setUint16(52, 1, littleEndian);
        view.setUint16(54, 1, littleEndian);

        // Set data type: http://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields/nifti1fields_pages/datatype.html
        view.setUint16(70, this.datatype, littleEndian);
        // Set bit per voxel: http://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields/nifti1fields_pages/bitpix.html
        view.setUint16(72, this.bytePerVoxel * 8, littleEndian);

        // Set steps (x, y, z, time) : pixdim
        view.setFloat32(76, 1, littleEndian);
        view.setFloat32(80, 1, littleEndian);
        view.setFloat32(84, 1, littleEndian);
        view.setFloat32(88, 1, littleEndian);
        view.setFloat32(92, 0, littleEndian);

        // Set voxel offset: vox_offset
        view.setFloat32(108, 352, littleEndian);

        // Set data scaling: scl_slope and scl_inter
        view.setFloat32(112, 1, littleEndian);
        view.setFloat32(116, 0, littleEndian);

        // Units: millimeters
        view.setUint16(122, 512, littleEndian)
        view.setUint16(123, 2, littleEndian)

        // Set intensity (max, min)
        view.setFloat32(124, this.max, littleEndian);
        view.setFloat32(128, this.min, littleEndian);

        // 3d image (volume) orientation and location in space: qform_code and sform_code
        view.setUint16(252, 2, littleEndian);
        view.setUint16(254, 1, littleEndian);

        // Transform
        const transform = [
          [ 1, 0, 0, -0],
          [ 0, 1, 0, -0],
          [ 0, 0, 1, -0],
        ];

        // Qform
        view.setFloat32(256, 0, littleEndian);
        view.setFloat32(260, 0, littleEndian);
        view.setFloat32(264, 0, littleEndian);
        view.setFloat32(268, transform[0][3], littleEndian);
        view.setFloat32(272, transform[1][3], littleEndian);
        view.setFloat32(276, transform[2][3], littleEndian);

        // Sform
        view.setFloat32(280, transform[0][0], littleEndian);
        view.setFloat32(284, transform[0][1], littleEndian);
        view.setFloat32(288, transform[0][2], littleEndian);
        view.setFloat32(292, transform[0][3], littleEndian);
        view.setFloat32(296, transform[1][0], littleEndian);
        view.setFloat32(300, transform[1][1], littleEndian);
        view.setFloat32(304, transform[1][2], littleEndian);
        view.setFloat32(308, transform[1][3], littleEndian);
        view.setFloat32(312, transform[2][0], littleEndian);
        view.setFloat32(316, transform[2][1], littleEndian);
        view.setFloat32(320, transform[2][2], littleEndian);
        view.setFloat32(324, transform[2][3], littleEndian);

        // Set magic number:
        const magic = 'n+1';
        const magicByte = bytes.subarray(344, 348);

        for (let i = magic.length - 1; i >= 0; i--) {
            magicByte[i] = magic.charCodeAt(i);
        }
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
        const list = this.axisList.slice(0);

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
        const { axisList } = this;
        const { length } = axisList;
        let offset = 1;

        for (let i = 0; i < length; i++) {
            const axisName = axisList[i];

            if (axisName === axis) {
                break;
            }

            offset *= this[axisName];
        }

        return offset;
    }

    /**
     * Border voxel value to respect min/max
     *
     * @param {Number} value
     *
     * @return {Number}
     */
    border(value) {
      return Math.min(Math.max(value, this.min), this.max);
    }

    /**
     * Set slice
     *
     * @param {String} axis
     * @param {Number} position
     * @param {Number} content
     */
    setSlice(axis, position, content = this.max) {
        const { width, height, length, offsetWidth, offsetHeight, offset } = this.getDimensions(axis);
        const value = this.border(content);

        if (position < 0 || position >= length) {
            throw new Error(`Position '${position}' is invalid [0, ${length}[.`);
        }

        const zOffset = position * offset;

        for (let row = 0; row < height; row++) {
            const zyOffset = zOffset + (height - row) * offsetHeight;

            for (let col = 0; col < width; col++) {
                const zyxOffset = zyOffset + col * offsetWidth;
                this.view[zyxOffset] = value;
            }
        }
    }

    /**
     * Set point
     *
     * @param {String} axis
     * @param {Number} position
     * @param {Number} x
     * @param {Number} y
     * @param {Number} content
     */
    setPoint(axis, position, x, y, content = this.max) {
        const { width, height, length, offsetWidth, offsetHeight, offset } = this.getDimensions(axis);

        if (position < 0 || position >= length) {
            throw new Error(`Position '${position} is invalid [0, ${length}[.'`);
        }

        if (x < 0 || x >= width) {
            throw new Error(`X '${x}' is invalid [0, ${width}[.`);
        }

        if (y < 0 || y >= height) {
            throw new Error(`Y '${y}' is invalid [0, ${height}[.`);
        }

        const col = x;
        const row = height - y;
        const zOffset = position * offset;
        const zyOffset = zOffset + row * offsetHeight;
        const zyxOffset = zyOffset + col * offsetWidth;

        this.view[zyxOffset] = this.border(content);
    }

    /**
     * Set cube
     *
     * @param {String} axis
     * @param {Number} position
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @param {Number} content
     */
    setCube(axis, position, x, y, radius = 5, content = this.max) {
        const { width, height, length, offsetWidth, offsetHeight, offset } = this.getDimensions(axis);
        const value = this.border(content);

        if (position < 0 || position >= length) {
            throw new Error(`Position '${position} is invalid [0, ${length}[.'`);
        }

        if (x < 0 || x >= width) {
            throw new Error(`X '${x}' is invalid [0, ${width}[.`);
        }

        if (y < 0 || y >= height) {
            throw new Error(`Y '${y}' is invalid [0, ${height}[.`);
        }

        const zOffset = position * offset;

        for (let row = y - radius; row < y + radius; row++) {
            const zyOffset = zOffset + (height - row) * offsetHeight;

            if (y < 0 || y >= height) {
                continue;
            }

            for (let col = x - radius; col < x + radius; col++) {
                const zyxOffset = zyOffset + col * offsetWidth;

                if (x < 0 || x >= width) {
                    continue;
                }

                this.view[zyxOffset] = value;
            }
        }
    }

    /**
     * Set zone
     *
     * @param {String} axis
     * @param {Number} position
     * @param {Number} x
     * @param {Number} y
     * @param {Number} zoneWidth
     * @param {Number} zoneHeight
     * @param {Number} content
     */
    setZone(axis, position, x, y, zoneWidth, zoneHeight, content = this.max) {
        const { width, height, length, offsetWidth, offsetHeight, offset } = this.getDimensions(axis);
        const value = this.border(content);

        if (position < 0 || position >= length) {
            throw new Error(`Position '${position} is invalid [0, ${length}[.'`);
        }

        if (x < 0 || x + zoneWidth >= width) {
            throw new Error(`Zone X '${x}' to '${zoneWidth} is invalid [0, ${width}[.`);
        }

        if (y < 0 || y + zoneHeight >= height) {
            throw new Error(`Zone Y '${y}' to '${zoneHeight}' is invalid [0, ${height}[.`);
        }

        const zOffset = position * offset;

        for (let row = y; row < y + zoneHeight; row++) {
            const zyOffset = zOffset + (height - row) * offsetHeight;

            for (let col = x; col < x + zoneWidth; col++) {
                const zyxOffset = zyOffset + col * offsetWidth;
                this.view[zyxOffset] = value;
            }
        }
    }
}

module.exports = Volume;
