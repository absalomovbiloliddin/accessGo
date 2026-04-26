import { io } from 'socket.io-client';
import Constants from 'expo-constants';

let socket;

export function getDriverSocket() {
  if (!socket) {
    const socketUrl = Constants.expoConfig?.extra?.socketUrl || 'http://localhost:5000';
    socket = io(socketUrl, { transports: ['websocket'] });
  }
  return socket;
}
