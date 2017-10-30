export default new Map([
    [2, Uint8Array], // unsigned char.
    [4, Int16Array], // signed short.
    [8, Int32Array], // signed int.
    [16, Float32Array], // 32 bit float.
    // NIFTI_TYPE_COMPLEX64:    32, // 64 bit complex = 2 32 bit floats.
    [64, Float64Array], // 64 bit float = double.
    // NIFTI_TYPE_RGB24:        128, // 3 8 bit bytes.
    [256, Int8Array], // signed char.
    [512, Uint16Array], // unsigned short.
    [768, Uint32Array], // unsigned int.
    // NIFTI_TYPE_INT64:        1024, // signed long long.
    // NIFTI_TYPE_UINT64:       1280, // unsigned long long.
    // NIFTI_TYPE_FLOAT128:     1536, // 128 bit float = long double.
    // NIFTI_TYPE_COMPLEX128:   1792, // 128 bit complex = 2 64 bit floats.
    // NIFTI_TYPE_COMPLEX256:   2048  // 256 bit complex = 2 128 bit floats
]);
