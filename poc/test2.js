const data = new ArrayBuffer(16);
const view = new Uint8Array(data); // 0 - 255
const view16 = new Uint16Array(data); // 0 - 65535

// 16 octets donc 16 x 8 bits = 128 bits

// 00000100001000000000001001000000000001111110000000001101101100000001111111111000000101111110100000010100001010000000001001000000

// 00000100 4
// 00100000 32
// 00000010 2
// 01000000 64
// 00000111 7
// 11100000 224
// 00001101 13
// 10110000 176
// 00011111 31
// 11111000 248
// 00010111 23
// 11101000 232
// 00010100 20
// 00101000 40
// 00000010 2
// 01000000 64

// 0000010000100000 1056
// 0000001001000000 576
// 0000011111100000 2016
// 0000110110110000 3504
// 0001111111111000 8184
// 0001011111101000 6120
// 0001010000101000 5160
// 0000001001000000 576

console.log(data);
console.log(view);

view[0] = 4;
view[1] = 32;
view[2] = 2;
view[3] = 64;
view[4] = 7;
view[5] = 224;
view[6] = 13;
view[7] = 176;
view[8] = 31;
view[9] = 248;
view[10] = 23;
view[11] = 232;
view[12] = 20;
view[13] = 40;
view[14] = 2;
view[15] = 64;

view16[0] = 1056;
view16[1] = 576;
view16[2] = 2016;
view16[3] = 3504;
view16[4] = 8184;
view16[5] = 6120;
view16[6] = 5160;
view16[7] = 576;

console.log(data);
console.log(view);
console.log(view16);

var test = parseInt('00000100001000000000001001000000000001111110000000001101101100000001111111111000000101111110100000010100001010000000001001000000', 2);

console.log(test.toString(2)); // 5483111120471645000000000000000000000
console.log(test.toString(10)); // 5483111120471645000000000000000000000
console.log(test.toString(16)); // 420024007e00dc00000000000000000

//display(view);
display(view16);

if (typeof(require) === 'function') {
    require('fs').writeFileSync('output', new Buffer(data));
}

function display(typedArray) {
    const size = typedArray.BYTES_PER_ELEMENT * 8;

    for (let i = 0; i < typedArray.length; i++) {
        let bits = typedArray[i].toString(2);
        let row = '0'.repeat(size - bits.length) + bits;
        console.log(row);
        document.write(Array.from(row).join('\n').replace(/0/g, '⬛️').replace(/1/g, '⬜️') + '\n');
    }
}
