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
    // TODO: set from config
    const newSocket = io('http://localhost:8080/games')
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
