// const mainScreen = document.getElementById('mainScreen');
// const ctx = mainScreen.getContext('2d');

// //frames, loop, tiks
// const TIK_PER_SECOND = 20;
// const MS_PER_TIK = TIK_PER_SECOND / 1000;
// let lastTimeTik = 0;

// let lastTime = 0;
// let deltaTime = 0;

// let deltaCacl = (math.parse('x - y')).compile();

// function refreshScreen(currentTime) {

//     deltaTime = deltaCacl.evaluate({ x:currentTime, y:lastTime });
//     lastTime = currentTime;

//     // Verifica si es tiempo de ejecutar un nuevo tick
//     if (deltaTime > MS_PER_TIK) {
//         lastTickTime = currentTime - (deltaTime % MS_PER_TICK);

//         // Ejecutar la lógica del juego para un nuevo tick
//         gameTick();
//     }

//     render();

//     requestAnimationFrame(refreshScreen);
// };

// function render() {
//     return null;
// }

// document.addEventListener('DOMContentLoaded', ()=>{
//     refreshScreen();
// });