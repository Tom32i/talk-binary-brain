// [99][999][999]

const data = new ArrayBuffer(2 + 2 + 2);
const eventView = new Uint8Array(data, 1, 1);
const positionView = new Uint16Array(data, 2, 2);

eventView[0] = 1;
positionView[0] = 125;
positionView[1] = 158;

const bin = toBin(new Uint8Array(data));
const int = parseInt(bin, 2);

console.log(data);
console.log(eventView);
console.log(positionView);

console.log(bin); // 0000011001010111001000000000001001010000
console.log(int.toString(10)); // 27231519312
console.log(int.toString(16)); // 657200250

if (typeof(require) === 'function') {
    require('fs').writeFileSync('event', Buffer.from(data));
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
