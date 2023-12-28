import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const url = 'http://localhost:8080/games'

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection only if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(url)
    }

    // Return the cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return socketRef.current
}
