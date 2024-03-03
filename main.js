const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext('2d');

const SCREEN = {
  h: CANVAS.height,
  w: CANVAS.width,
  a: CANVAS.height/CANVAS.width
};

let GLOBAL_ID = 0;

const FPS = 30;
let FOV_ANGLE = 90;
let Z_FAR = 1000;
let Z_NEAR = 10;

let CAMERA = {
  fov: 1/Math.tan(FOV_ANGLE/2),
  zF: Z_FAR,
  zN: Z_NEAR,
  zD: Z_FAR/(Z_FAR-Z_NEAR),
  x: 0,
  y: 0,
  z: 0
}

function vector3(x, y, z) {
  return {
    x: x,
    y: y,
    z: z,
    w: z
  };
}
function vector2(x, y) {
  return {
    x: x,
    y: y,
    z: 0,
    w: 0
  };
}

function makePerspective(ver) {
  let tempX = SCREEN.a*CAMERA.fov*ver.x;
  let tempY = CAMERA.fov*ver.y;
  let tempZ = CAMERA.zD*ver.z*(-CAMERA.zD*CAMERA.zN);
  if (ver.w !== 0) {
    tempX /= ver.w;
    tempY /= ver.w;
    tempZ /= ver.w;
  }
  return {
    x: tempX,
    y: tempY,
    z: tempZ,
    w: ver.w
  };
}

console.log(makePerspective(vector3(-34,13,56)))

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
      //top
      vector3(1, 1, 1),
      vector3(1, 1, -1),
      vector3(-1, 1, 1),
      vector3(-1, 1, -1),
      //button
      vector3(1, -1, 1),
      vector3(1, -1, -1),
      vector3(-1, -1, 1),
      vector3(-1, -1, -1),
    ]
]);

function drawVertices() {
  for (let i = 1; i < MODELS.length; i++) {
    MODELS[i][1].forEach((ver)=>{
      CONTEXT.fillRect(ver.x, ver.y, 10, 10);
      console.log(ver);
    });
  }
}

function drawFrame() {
  CONTEXT.clearRect(0, 0, SCREEN.h, SCREEN.w);
  drawVertices();
  //drawLines();
  //drawFaces();
}

console.log(MODELS[0].mes);
console.log(MODELS);
console.log(MODELS_PROJECTION[0].mes);
console.log(MODELS_PROJECTION);
console.log(MODELS[1][0].id);
console.log(GLOBAL_ID);

drawFrame();
function animate() {
  requestAnimationFrame(animate, FPS);
  drawFrame();
}

//animate();