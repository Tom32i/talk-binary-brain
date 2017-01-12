// 06 87 32 02 80
// 99 99 99 99 99

// 0000011001010111001000000000001001010000

// 00000110
// 01010111
// 00100000
// 00000010
// 01010000

const data = new ArrayBuffer(5);
const view = new Uint8Array(data);

view[0] = 06;
view[1] = 87;
view[2] = 32;
view[3] = 02;
view[4] = 80;

const bin = toBin(view);
const int = parseInt(bin, 2);

console.log(data);
console.log(view);
console.log(bin);

console.log(int.toString(2)); // 0000011001010111001000000000001001010000
console.log(int.toString(10)); // 27231519312
console.log(int.toString(16)); // 657200250

if (typeof(require) === 'function') {
    require('fs').writeFileSync('phone', Buffer.from(data));
}

function toBin(typedArray) {
    const size = typedArray.BYTES_PER_ELEMENT * 8;
    let string = '';

    for (let i = 0; i < typedArray.length; i++) {
        let bits = typedArray[i].toString(2);
        let row = '0'.repeat(size - bits.length) + bits;
        string += row;
    }

    return string;
}
