import Demo from './src/Demo';

const demo = new Demo('brain.nii');

if (typeof(parent.setDemo) === 'function') {
    parent.setDemo(demo);
}
