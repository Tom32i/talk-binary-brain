// [99][999][999]
// [1][[2][2]]

const eventdata = new ArrayBuffer(1);
const eventView = new Uint8Array(eventdata, 0, 1);
const positiondata = new ArrayBuffer(4);
const positionView = new Uint16Array(positiondata, 0, 2);
const params = process.argv.slice(2);

eventView[0] = 1;
positionView[0] = params[0] || 125;
positionView[1] = params[1] || 158;

const bin = toBin(new Uint8Array(eventdata)) + toBin(new Uint8Array(positiondata));
const int = parseInt(bin, 2);

console.log(eventdata);
console.log(eventView);

console.log(positiondata);
console.log(positionView);

console.log(bin); // 0000000101111101000000001001111000000000
console.log(int.toString(10)); // 27231519312
console.log(int.toString(16)); // 657200250

if (typeof(require) === 'function') {
    require('fs').writeFileSync('event2', Buffer.concat([Buffer.from(eventdata), Buffer.from(positiondata)]));
    console.log(toBin(new Uint8Array(require('fs').readFileSync('event2'))));
} else {

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

//const raw = require('fs').readFileSync('event2');
//const test = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);

