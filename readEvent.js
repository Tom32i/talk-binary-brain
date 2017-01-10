const reader = new FileReader();
const box = document.getElementById('box');
const events = ['add', 'position']

reader.addEventListener('loadend', onLoad, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  handleFiles(e.dataTransfer.files[0]);
}

function handleFiles(file) {
    console.log(file);
    reader.readAsArrayBuffer(file);
}

function onLoad(e) {
    const source = reader.result;
    const eventData = source.slice(0, 1);
    const eventView = new Uint8Array(eventData, 0, 1);
    const positionData = source.slice(1, 5);
    const positionView = new Uint16Array(positionData, 0, 2);

    const event = events[eventView[0]];
    const x = positionView[0];
    const y = positionView[1];

    box.innerText = `{ "event": "${event}", "x": ${x}, "y": ${y} }`;
}

box.addEventListener('dragenter', dragenter, false);
box.addEventListener('dragover', dragover, false);
box.addEventListener('drop', drop, false);
