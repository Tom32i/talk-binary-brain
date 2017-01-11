const fs = require('fs');
const Volume = require('./Volume');
let source = process.argv[2] || null;
const destination = process.argv[3] || null;
const debug = typeof(process.argv[4]) !== 'undefined';

function output(message) {
    if (debug) {
        console.log(message);
    }
}

function onError(message) {
    if (debug) {
        throw new Error(message);
    } else {
        process.exit(1);
    }
}

output(`Loading source file from "${source}"...`);

try {
    source = JSON.parse(fs.readFileSync(source));
} catch(error) {
    console.error(error);
    onError(`Source file "${source}" could not be found.`);
}

if (!destination) {
    onError(`No destination provided.`);
}

output('Build volume...');

const mri = new Volume(source.x, source.y, source.z);

output(`Adding ${source.slices.length} slices...`);

for (let s = source.slices.length - 1; s >= 0; s--) {
    mri.setSlice(...source.slices[s]);
}

output(`Adding ${source.zones.length} zones...`);

for (let z = source.zones.length - 1; z >= 0; z--) {
    mri.setZone(...source.zones[z]);
}

output(`Adding ${source.cubes.length} cubes...`);

for (let c = source.cubes.length - 1; c >= 0; c--) {
    mri.setCube(...source.cubes[c]);
}

output(`Adding ${source.points.length} points...`);

for (let p = source.points.length - 1; p >= 0; p--) {
    mri.setPoint(...source.points[p]);
}

output(`Writing to nifti format to "${destination}"...`);

try {
    fs.writeFileSync(destination, new Buffer(mri.buffer));
} catch(error) {
    onError(`Could not write to destination file "${destination}".`);
}

output('Done.')
process.exit(0);
