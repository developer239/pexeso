// src/services/socketService.js
import io from 'socket.io-client'

const socket = io('http://localhost:8080/games', {
  transports: ['websocket'],
})

export const useSocket = () => socket
