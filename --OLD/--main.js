const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

//constants

const FOV = 90;
const Z_FAR = 10000;
const Z_NEAR = 0.1;
const OBJ_FILE_COUNT = 1; //change to 1
let OBJ_FILE_COUNT_TIMES = 0;

//variables

let timeLast = 0;
let timeDelta = 0;
let angle = 0;

let globalModelsId = 0;

//objects

const screen = {
  h: canvas.height,
  w: canvas.width,
  a: canvas.height / canvas.width
};

const camera = {
  fovRadio: 1 / Math.tan( FOV / 2 ),
  zF: Z_FAR,
  zN: Z_NEAR,
  zD: Z_FAR / ( Z_FAR - Z_NEAR ),
  x: 0,
  y: 0,
  z: 0
}

//3D models

let models = [];

let models_projection = [];


//download models

function readTextFile(file) {
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        let allText = rawFile.responseText;
        loadOBJfile(allText);
      }
    }
  }
  rawFile.send(null);
}

function loadOBJfile(textInFile) {

  const fileContents = textInFile
  const objFile = new OBJFile(fileContents);
  const output = objFile.parse();
  //console.log(output.models[0]);
  const tempMeta = {
    id: globalModelsId++,
    name: output.models[0].name,
    vertices: output.models[0].vertices.length,
    faces: output.models[0].faces.length,
    desc: null
  };
  models[globalModelsId-1] = [Object.assign({}, tempMeta), []];
  for (let i = 0; i < output.models[0].faces.length; i++) {
    models[globalModelsId-1][1].push(tri(
      output.models[0].vertices[output.models[0].faces[i].vertices[0].vertexIndex - 1],
      output.models[0].vertices[output.models[0].faces[i].vertices[1].vertexIndex - 1],
      output.models[0].vertices[output.models[0].faces[i].vertices[2].vertexIndex - 1]
    ));
  }
  OBJ_FILE_COUNT_TIMES++
}

/*
models.push([
    {
      //metadata
      id: globalModelsId++,
      name: "CUBE",
      ver: null,
      desc: "un simple cubo"
    },
    [
      //S
      tri(vec3( -0, -0, -0 ), vec3( -0, 1, -0 ),  vec3( 1, 1, -0 )  ),
      tri(vec3( -0, -0, -0 ), vec3( 1, 1, -0 ),   vec3( 1, -0, -0 ) ),
      //E
      tri(vec3( 1, -0, -0 ),  vec3( 1, 1, -0 ),   vec3( 1, 1, 1 )   ),
      tri(vec3( 1, -0, -0 ),  vec3( 1, 1, 1 ),    vec3( 1, -0, 1 )  ),
      //N
      tri(vec3( 1, -0, 1 ),   vec3( 1, 1, 1 ),    vec3( -0, 1, 1 )  ),
      tri(vec3( 1, -0, 1 ),   vec3( -0, 1, 1 ),   vec3( -0, 1, 1 )  ),
      //W
      tri(vec3( -0, -0, 1 ),  vec3( -0, 1, 1 ),   vec3( -0, 1, -0 ) ),
      tri(vec3( -0, -0, 1 ),  vec3( -0, 1, -0 ),  vec3( -0, -0, -0 )),
      //Top
      tri(vec3( -0, 1, -0 ),  vec3( -0, 1, 1 ),   vec3( 1, 1, 1 )   ),
      tri(vec3( -0, 1, -0 ),  vec3( 1, 1, 1 ),    vec3( 1, 1, -0 )  ),
      //Bottom
      tri(vec3( -0, -0, -0 ), vec3( -0, -0, 1 ),  vec3( 1, -0, 1 )  ),
      tri(vec3( -0, -0, -0 ), vec3( 1, -0, 1 ),   vec3( 1, -0, -0 ) ),
    ]
]);
*/

//matrix

let mathPer = {m: [[0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0]]
};
mathPer.m[0][0] = screen.a * camera.fovRadio;
mathPer.m[1][1] = camera.fovRadio;
mathPer.m[2][2] = camera.zD;
mathPer.m[2][3] = -camera.zD * camera.zN;
mathPer.m[3][3] = 1;

let mathRot = {
  x: [[0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]],

  y: [[0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]],

  z: [[0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]]
};

//vectors and triangles

function vec3(x, y, z, w) {
  if (w === undefined) {
    w = 1;
  }
  return {
    x: x,
    y: y,
    z: z,
    w: w
  };
}
function vec2(x, y) {
  return {
    x: x,
    y: y,
    z: 0,
    w: 0
  };
}
function tri(ver1, ver2, ver3) {
  return [
    {...ver1},
    {...ver2},
    {...ver3}
  ];
}

//normalize

function normalizeVec(x, y, z) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;
  let Fw = 0;

  Fw = Math.sqrt( x * x + y * y + z * z );

  if (Fw !== 0) {
    Fx = x / Fw;
    Fy = y / Fw;
    Fz = z / Fw;
  }

  let result = vec3(Fx, Fy, Fz, 1)
  let resultC = Object.assign({}, result);
  return resultC
}


//move models

function makePerspective(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;
  let Fw = 0;

  let m = {...mathPer};

  Fx = vec.x * m.m[0][0] + vec.y * m.m[0][1] + vec.z * m.m[0][2] + m.m[0][3];
  Fy = vec.x * m.m[1][0] + vec.y * m.m[1][1] + vec.z * m.m[1][2] + m.m[1][3];
  Fz = vec.x * m.m[2][0] + vec.y * m.m[2][1] + vec.z * m.m[2][2] + m.m[2][3];
  Fw = vec.x * m.m[3][0] + vec.y * m.m[3][1] + vec.z * m.m[3][2] + m.m[3][3];

  if (Fw != 0) {
    Fx /= Fw;
    Fy /= Fw;
    Fz /= Fw;
  }
  let result = vec3(Fx, Fy, Fz, Fw)
  let resultC = Object.assign({}, result);
  return resultC
}

function mathRotX(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = {...mathRot};

  m.x[0][0] = 1;
  m.x[1][1] = Math.cos(angle * 0.5);
  m.x[1][2] = -Math.sin(angle * 0.5);
  m.x[2][1] = Math.sin(angle * 0.5);
  m.x[2][2] = Math.cos(angle * 0.5);

  Fx = vec.x * m.x[0][0] + vec.y * m.x[0][1] + vec.z * m.x[0][2];
  Fy = vec.x * m.x[1][0] + vec.y * m.x[1][1] + vec.z * m.x[1][2];
  Fz = vec.x * m.x[2][0] + vec.y * m.x[2][1] + vec.z * m.x[2][2];

  let result = vec3(Fx, Fy, Fz, vec.w)
  let resultC = Object.assign({}, result);
  return resultC
}
function mathRotY(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = {...mathRot};
  m.y[0][0] = Math.cos(angle);
  m.y[0][2] = Math.sin(angle);
  m.y[1][1] = 1;
  m.y[2][0] = -Math.sin(angle);
  m.y[2][2] = Math.cos(angle);

  Fx = vec.x * m.y[0][0] + vec.y * m.y[0][1] + vec.z * m.y[0][2];
  Fy = vec.x * m.y[1][0] + vec.y * m.y[1][1] + vec.z * m.y[1][2];
  Fz = vec.x * m.y[2][0] + vec.y * m.y[2][1] + vec.z * m.y[2][2];

  let result = vec3(Fx, Fy, Fz, vec.w)
  let resultC = Object.assign({}, result);
  return resultC
}
function mathRotZ(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = {...mathRot};
  m.z[0][0] = Math.cos(angle);
  m.z[0][1] = -Math.sin(angle);
  m.z[1][0] = Math.sin(angle);
  m.z[1][1] = Math.cos(angle);
  m.z[2][2] = 1;

  Fx = vec.x * m.z[0][0] + vec.y * m.z[0][1] + vec.z * m.z[0][2];
  Fy = vec.x * m.z[1][0] + vec.y * m.z[1][1] + vec.z * m.z[1][2];
  Fz = vec.x * m.z[2][0] + vec.y * m.z[2][1] + vec.z * m.z[2][2];

  let result = vec3(Fx, Fy, Fz, vec.w)
  let resultC = Object.assign({}, result);
  return resultC
}

function loadModels() {
  for (let i = 0; i < models.length; i++) {
    models_projection[i] = [models[i][0], []];
    models[i][1].forEach((triangles)=>{
      let temp = Object.assign({}, triangles);
      models_projection[i][1].push(temp);
    });
  }
}

function projModels() {
  for (let i = 0; i < models_projection.length; i++) {
    models_projection[i][0] = Object.assign({}, models[i][0]);
    for (let j = 0; j < models_projection[i][1].length; j++) {

      let triProj = models_projection[i][1][j];
      
      let tempTri0 = tri(triProj[0], triProj[1], triProj[2]);

      tempTri0[0] = mathRotX(tempTri0[0]);
      tempTri0[1] = mathRotX(tempTri0[1]);
      tempTri0[2] = mathRotX(tempTri0[2]);

      tempTri0[0] = mathRotZ(tempTri0[0]);
      tempTri0[1] = mathRotZ(tempTri0[1]);
      tempTri0[2] = mathRotZ(tempTri0[2]);
      
      tempTri0[0] = mathRotY(tempTri0[0]);
      tempTri0[1] = mathRotY(tempTri0[1]);
      tempTri0[2] = mathRotY(tempTri0[2]);

      //tempTri0[0].z += 0.1;
      //tempTri0[1].z += 0.1;
      //tempTri0[2].z += 0.1;

      models_projection[i][1][j] = tri(tempTri0[0], tempTri0[1], tempTri0[2]);

      let tempTri1 = tri(tempTri0[0], tempTri0[1], tempTri0[2]);
      
      tempTri1[0] = makePerspective(tempTri1[0]);
      tempTri1[1] = makePerspective(tempTri1[1]);
      tempTri1[2] = makePerspective(tempTri1[2]);

      tempTri1[0].x+=1; tempTri1[0].y+=1;
      tempTri1[1].x+=1; tempTri1[1].y+=1;
      tempTri1[2].x+=1; tempTri1[2].y+=1;

      tempTri1[0].x*=0.5 * screen.w; tempTri1[0].y*=0.5 * screen.h;
      tempTri1[1].x*=0.5 * screen.w; tempTri1[1].y*=0.5 * screen.h;
      tempTri1[2].x*=0.5 * screen.w; tempTri1[2].y*=0.5 * screen.h;

      drawTriangle(Object.assign({}, tempTri1), "#f22");
    };
  }
}

function drawFrame() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, screen.h, screen.w);

  projModels();
}

//draw functions

function drawTriangle(trg, col) {
  let x1 = trg[0].x;
  let y1 = trg[0].y;
  let x2 = trg[1].x;
  let y2 = trg[1].y;
  let x3 = trg[2].x;
  let y3 = trg[2].y;

  drawLine(x1, y1, x2, y2, col);
  drawLine(x2, y2, x3, y3, col);
  drawLine(x3, y3, x1, y1, col);
}
function drawLine(x1, y1, x2, y2, color) {
  ctx.strokeStyle = color
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}

for (let i = 0; i < OBJ_FILE_COUNT; i++) {
  readTextFile(`model_${i}.obj`);
}

//init engine
if (OBJ_FILE_COUNT_TIMES >= OBJ_FILE_COUNT) {
  loadModels();
  animate();
  //console.log(models_projection)
}

function animate(timeNow) {
  requestAnimationFrame(animate);
  timeDelta = timeNow - timeLast;
  angle = timeDelta * 0.00001 * Math.PI * 2;
  timeLast = timeNow;
  if (angle <= 0 || angle >= 0) {
    drawFrame();
  }
}

//console.log(models)