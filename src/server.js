import express from 'express';
import os from 'os';
import fileRoutes from './fileRoutes.js';

const app = express();
const port = 8080;

app.use(express.static('./public'));

app.use('/api', fileRoutes);

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function startServer(){
    const localIp = getLocalIp();
    app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://${localIp}:${port}`);
    });
}

export default startServer;
