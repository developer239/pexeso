import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketIo = io(url)

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [url])

  return socket
}
