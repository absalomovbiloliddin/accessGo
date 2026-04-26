import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import env from './config/env.js';
import setupSocket from './socket/io.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientOrigin === '*' ? true : env.clientOrigin,
    methods: ['GET', 'POST']
  }
});

setupSocket(io);

server.listen(env.port, () => {
  console.log(`AccessGo backend running on port ${env.port}`);
});
