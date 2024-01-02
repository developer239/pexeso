import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
} from 'react'
import { io, Socket } from 'socket.io-client'

type WebSocketContextType = Socket | null

const WebSocketContext = createContext<WebSocketContextType>(null)

export const useWebSocket = (): WebSocketContextType =>
  useContext(WebSocketContext)

export const WebSocketProvider: FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}/games`)
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  )
}
