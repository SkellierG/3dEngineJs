//consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

//vars
let globalModelsId = 0;

//objects
//2d vector
function vec2(x, y, z) {
    return math.matrix(`[${x}, ${y}, ${z}]`);
}

//3d vector
function vec3(x, y, z, w) {
    return math.matrix(`[${x}, ${y}, ${z}, ${w}]`);
}

//triangle array with 3 vectors
function tri(v1, v2, v3) {
    return [...v1, ...v2, ...v3];
}

//storage
let models_storage = new Map();
let models = [];

//func
//read .obj file from pc files
function readOBJile(file) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
            let allText = rawFile.responseText;
            saveOBJ(allText, file);
        }
      }
    }
    rawFile.send(null);
}

//save and parse obj file into JSON
function saveOBJ(textInFile, fileKey) {
    const fileContents = textInFile
    const objFile = new OBJFile(fileContents);
    const output = objFile.parse();
    //console.log(output.models[0]);
    models_storage.set(fileKey, output);
}

//main loop
let timeLast = 0;
let timeDelta = 0;
let angle = 0;
function main(timeNow) {
    requestAnimationFrame(main);
    timeDelta = timeNow - timeLast;
    angle = timeDelta * 0.00001 * Math.PI * 2;
    timeLast = timeNow;
    if (angle <= 0 || angle >= 0) {
        //drawFrame();
    }
}

main();