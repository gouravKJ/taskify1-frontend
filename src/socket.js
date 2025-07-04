// socket.js
import { io } from 'socket.io-client';

// Use the correct environment variable name
const socket = io(process.env.REACT_APP_API || 'http://localhost:3000');

export default socket;
