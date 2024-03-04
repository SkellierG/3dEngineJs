const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext('2d');

const SCREEN = {
  h: CANVAS.height,
  w: CANVAS.width,
  a: CANVAS.height / CANVAS.width
};

const matrix = [[0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]];

let TIME_LAST = 0;
let TIME_DELTA = 0;
let angle = 0;

let GLOBAL_ID = 0;

const FPS = 30;
let FOV = 90;
let Z_FAR = 1000;
let Z_NEAR = 0.1;

let CAMERA = {
  fovRadio: 1 / Math.tan( FOV / 2 ),
  zF: Z_FAR,
  zN: Z_NEAR,
  zD: Z_FAR / ( Z_FAR - Z_NEAR ),
  x: 0,
  y: 0,
  z: 0
}

let mathPer = {m: matrix};
mathPer.m[0][0] = SCREEN.a * CAMERA.fovRadio;
mathPer.m[1][1] = CAMERA.fovRadio;
mathPer.m[2][2] = CAMERA.zD;
mathPer.m[3][2] = -CAMERA.zD * CAMERA.zN;
mathPer.m[2][3] = 1;

let mathRot = {
  x: matrix,
  y: matrix,
  z: matrix,
};

function vec3(x, y, z, w) {
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
    ver1,
    ver2,
    ver3
  ];
}

function makePerspective(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;
  let Fw = 0;
  let m = mathPer;

  Fx = vec.x * m.m[0][0] + vec.y * m.m[1][0] + vec.z * m.m[2][0] + m.m[3][0];
  Fy = vec.x * m.m[0][1] + vec.y * m.m[1][1] + vec.z * m.m[2][1] + m.m[3][1];
  Fz = vec.x * m.m[0][2] + vec.y * m.m[1][2] + vec.z * m.m[2][2] + m.m[3][2];
  Fw = vec.x * m.m[0][3] + vec.y * m.m[1][3] + vec.z * m.m[2][3] + m.m[3][3];

  if (Fw != 0) {
    Fx /= Fw;
    Fy /= Fw;
    Fz /= Fw;
  }
  return vec3(Fx, Fy, Fz, Fw);
}

function mathRotX(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = mathRot;
  m.x[0][0] = 1;
  m.x[1][1] = Math.cos(angle * 0.5);
  m.x[1][2] = Math.sin(angle * 0.5);
  m.x[2][1] = -Math.sin(angle * 0.5);
  m.x[2][2] = Math.cos(angle * 0.5);

  Fx = vec.x * m.x[0][0] + vec.y * m.x[1][0] + vec.z * m.x[2][0];
  Fy = vec.x * m.x[0][1] + vec.y * m.x[1][1] + vec.z * m.x[2][1];
  Fz = vec.x * m.x[0][2] + vec.y * m.x[1][2] + vec.z * m.x[2][2];

  if (vec.w === null) {
    vec.w = 1;
  }
  return vec3(Fx, Fy, Fz, vec.w);
}
function mathRotY(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = mathRot;
  m.y[0][0] = Math.cos(angle);
  m.y[0][2] = Math.sin(angle);
  m.y[1][1] = 1;
  m.y[2][0] = -Math.sin(angle);
  m.y[2][2] = Math.cos(angle);

  Fx = vec.x * m.y[0][0] + vec.y * m.y[1][0] + vec.z * m.y[2][0];
  Fy = vec.x * m.y[0][1] + vec.y * m.y[1][1] + vec.z * m.y[2][1];
  Fz = vec.x * m.y[0][2] + vec.y * m.y[1][2] + vec.z * m.y[2][2];

  if (vec.w === null) {
    vec.w = 1;
  }
  return vec3(Fx, Fy, Fz, vec.w);
}
function mathRotZ(vec) {
  let Fx = 0;
  let Fy = 0;
  let Fz = 0;

  let m = mathRot;
  m.z[0][0] = Math.cos(angle);
  m.z[0][1] = Math.sin(angle);
  m.z[1][0] = -Math.sin(angle);
  m.z[1][1] = Math.cos(angle);
  m.z[2][2] = 1;

  Fx = vec.x * m.z[0][0] + vec.y * m.z[1][0] + vec.z * m.z[2][0];
  Fy = vec.x * m.z[0][1] + vec.y * m.z[1][1] + vec.z * m.z[2][1];
  Fz = vec.x * m.z[0][2] + vec.y * m.z[1][2] + vec.z * m.z[2][2];

  if (vec.w === null) {
    vec.w = 1;
  }
  return vec3(Fx, Fy, Fz, vec.w);
}


let MODELS = [
  {
    mes: "MODELS"
  }
];

let MODELS_PROJECTION = [
  {
    mes: "MODELS_PROJECTION"
  }
];

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

function drawFrame() {
  CONTEXT.fillStyle = "#000";
  CONTEXT.fillRect(0, 0, SCREEN.h, SCREEN.w);

  for (let i = 1; i < MODELS.length; i++) {
    MODELS_PROJECTION[i] = [MODELS[i][0], []];
    MODELS[i][1].forEach((triangles)=>{
      //console.log(triangles);

      let trsRotZ = [];
      for (let i = 0; i < triangles.length; i++) {
        trsRotZ.push(triangles[i]);
      }

      trsRotZ[0] = mathRotZ(trsRotZ[0]);
      trsRotZ[1] = mathRotZ(trsRotZ[1]);
      trsRotZ[2] = mathRotZ(trsRotZ[2]);

      let trsRotZX = trsRotZ;
      trsRotZX[0] = mathRotX(trsRotZ[0]);
      trsRotZX[1] = mathRotX(trsRotZ[1]);
      trsRotZX[2] = mathRotX(trsRotZ[2]);

      let trsTri = trsRotZX;
      trsTri[0].z = trsRotZX[0].z + 3;
      trsTri[1].z = trsRotZX[1].z + 3;
      trsTri[2].z = trsRotZX[2].z + 3;

      MODELS_PROJECTION[i][1].push(tri(
        makePerspective(trsTri[0]),
        makePerspective(trsTri[1]),
        makePerspective(trsTri[2])
      ));

      MODELS_PROJECTION[i][1].forEach((triProjected)=>{

        let triProjectedDummie = [];
        for (let i = 0; i < triProjected.length; i++) {
          triProjectedDummie.push(triProjected[i]);
        }

        triProjectedDummie[0].x+=1; triProjectedDummie[0].y+=1;
        triProjectedDummie[1].x+=1; triProjectedDummie[1].y+=1;
        triProjectedDummie[2].x+=1; triProjectedDummie[2].y+=1;

        triProjectedDummie[0].x*= 0.5 * SCREEN.w; triProjectedDummie[0].y*= 0.5 * SCREEN.h;
        triProjectedDummie[1].x*= 0.5 * SCREEN.w; triProjectedDummie[1].y*= 0.5 * SCREEN.h;
        triProjectedDummie[2].x*= 0.5 * SCREEN.w; triProjectedDummie[2].y*= 0.5 * SCREEN.h;

        drawTriangle(triProjectedDummie, "#f22");
      })
    });
  }
}

//console.log(MODELS[0].mes);
//console.log(MODELS);
//console.log(MODELS_PROJECTION[0].mes);
//console.log(MODELS_PROJECTION);
//console.log(MODELS[1][0].id);
//console.log(GLOBAL_ID);

/*for (let i = 0; i < 1; i++) {
  drawFrame();
}*/

function animate(timeNow) {
  requestAnimationFrame(animate);
  //console.log(TIME_NOW);
  TIME_DELTA = timeNow - TIME_LAST;
  angle = TIME_DELTA * 0.002 * Math.PI * 2;
  drawFrame();
  TIME_LAST = timeNow;
}

animate();