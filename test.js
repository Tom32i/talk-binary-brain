const data = new ArrayBuffer(10);
const view = new Uint8Array(data); // 0 - 255
// 10 octets donc 10 x 8 bits = 80 bits

// 00100001000001001000001111110001101101101111111111101111110110100001010001001000

// 00100001 - 33
// 00000100 - 4
// 10000011 - 131
// 11110001 - 241
// 10110110 - 182
// 11111111 - 255
// 11101111 - 239
// 11011010 - 218
// 00010100 - 20
// 01001000 - 72

// 0010000100
// 0001001000
// 0011111100
// 0110110110
// 1111111111
// 1011111101
// 1010000101
// 0001001000

console.log(data);
console.log(view);

view[0] = 33;
view[1] = 4;
view[2] = 131;
view[3] = 241;
view[4] = 182;
view[5] = 255;
view[6] = 239;
view[7] = 218;
view[8] = 20;
view[9] = 72;

console.log(data);
console.log(view);

var test = parseInt('00100001000001001000001111110001101101101111111111101111110110100001010001001000', 2);

console.log(test.toString(10)); // 155921388492491850000000
console.log(test.toString(16)); // 210483f1b6fff0000000

console.log(new DataView(data).toString());

if (typeof(require) === 'function') {
    require('fs').writeFileSync('output', new Buffer(data));
}
