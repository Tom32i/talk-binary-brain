import Demo from './src/Demo';

//const demo = new Demo('ubermuda/7 TOF3D.nii'); // 512 ⨉ 512 ⨉ 106
//const demo = new Demo('ubermuda/11 T2 EG TRA.nii'); // 448 ⨉ 512 ⨉ 30
//const demo = new Demo('ubermuda/6 T2 FLAIR TRA.nii'); // 270 ⨉ 320 ⨉ 30
const demo = new Demo('ubermuda/5 T1 SE SAG.nii'); //  270 ⨉ 320 ⨉ 29

if (typeof(parent.setDemo) === 'function') {
    parent.setDemo(demo);
}
