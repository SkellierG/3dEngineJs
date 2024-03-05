const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext('2d');

const SCREEN = {
  h: CANVAS.height,
  w: CANVAS.width,
  a: CANVAS.height / CANVAS.width
};

let TIME_LAST = 0;
let TIME_DELTA = 0;
let angle = 0;

let GLOBAL_ID = 0;

const FPS = 30;
let FOV = 90;
let Z_FAR = 10000;
let Z_NEAR = 10;

let CAMERA = {
  fovRadio: 1 / Math.tan( FOV / 2 ),
  zF: Z_FAR,
  zN: Z_NEAR,
  zD: Z_FAR / ( Z_FAR - Z_NEAR ),
  x: 0,
  y: 0,
  z: 0
}

let MODELS = [];

let MODELS_PROJECTION = [];

MODELS.push([
    {
      //metadata
      id: GLOBAL_ID++,
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

let mathPer = {m: [[0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0]]
};
mathPer.m[0][0] = SCREEN.a * CAMERA.fovRadio;
mathPer.m[1][1] = CAMERA.fovRadio;
mathPer.m[2][2] = CAMERA.zD;
mathPer.m[2][3] = -CAMERA.zD * CAMERA.zN;
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

function vec3(x, y, z, w) {
  //console.count("vec3");
  //console.log(x, y, z, w);
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

function makePerspective(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;
  let Fw = 0;

  let m = {...mathPer};
  //console.log(m);

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
  //console.log(vec);
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = {...mathRot};
  //console.log(m);

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
  //console.log(resultC);
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
  CONTEXT.strokeStyle = color
  CONTEXT.beginPath();
  CONTEXT.moveTo(x1, y1);
  CONTEXT.lineTo(x2, y2);
  CONTEXT.closePath();
  CONTEXT.stroke();
}

function loadMODELS() {
  for (let i = 0; i < MODELS.length; i++) {
    MODELS_PROJECTION[i] = [MODELS[i][0], []];
    MODELS[i][1].forEach((triangles)=>{
      let temp = Object.assign({}, triangles);
      MODELS_PROJECTION[i][1].push(temp);
    });
  }
}

function projMODELS() {
  for (let i = 0; i < MODELS_PROJECTION.length; i++) {
    MODELS_PROJECTION[i][0] = Object.assign({}, MODELS[i][0]);
    for (let j = 0; j < MODELS_PROJECTION[i][1].length; j++) {

      let triProj = MODELS_PROJECTION[i][1][j];

      //console.log(MODELS_PROJECTION[i][1][j]);
      //console.log(triProj);

      let tempTri0 = tri(triProj[0], triProj[1], triProj[2]);
      //console.log(tempTri0);

      tempTri0[0] = mathRotX(tempTri0[0]);
      tempTri0[1] = mathRotX(tempTri0[1]);
      tempTri0[2] = mathRotX(tempTri0[2]);
      //console.warn(triProj);
      //console.log(triProj);

      tempTri0[0] = mathRotZ(tempTri0[0]);
      tempTri0[1] = mathRotZ(tempTri0[1]);
      tempTri0[2] = mathRotZ(tempTri0[2]);
      
      tempTri0[0] = mathRotY(tempTri0[0]);
      tempTri0[1] = mathRotY(tempTri0[1]);
      tempTri0[2] = mathRotY(tempTri0[2]);

      //tempTri0[0].z += 0.01;
      //tempTri0[1].z += 0.01;
      //tempTri0[2].z += 0.01;

      ///console.count("tempTri0");
      //console.log(tempTri0);

      MODELS_PROJECTION[i][1][j] = tri(tempTri0[0], tempTri0[1], tempTri0[2]);

      let tempTri1 = tri(tempTri0[0], tempTri0[1], tempTri0[2]);
      
      tempTri1[0] = makePerspective(tempTri1[0]);
      tempTri1[1] = makePerspective(tempTri1[1]);
      tempTri1[2] = makePerspective(tempTri1[2]);

      tempTri1[0].x+=1; tempTri1[0].y+=1;
      tempTri1[1].x+=1; tempTri1[1].y+=1;
      tempTri1[2].x+=1; tempTri1[2].y+=1;

      tempTri1[0].x*=0.5 * SCREEN.w; tempTri1[0].y*=0.5 * SCREEN.h;
      tempTri1[1].x*=0.5 * SCREEN.w; tempTri1[1].y*=0.5 * SCREEN.h;
      tempTri1[2].x*=0.5 * SCREEN.w; tempTri1[2].y*=0.5 * SCREEN.h;

      drawTriangle(Object.assign({}, tempTri1), "#f22");
    };
  }
}

function drawFrame() {
  CONTEXT.fillStyle = "#000";
  CONTEXT.fillRect(0, 0, SCREEN.h, SCREEN.w);

  projMODELS();

}

loadMODELS();

function animate(timeNow) {
  requestAnimationFrame(animate);
  //console.log(MODELS_PROJECTION);
  TIME_DELTA = timeNow - TIME_LAST;
  angle = TIME_DELTA * 0.0001 * Math.PI * 2;
  TIME_LAST = timeNow;
  if (angle <= 0 || angle >= 0) {
    drawFrame();
  }
}

animate();