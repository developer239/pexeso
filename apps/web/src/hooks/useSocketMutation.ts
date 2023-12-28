import { useCallback } from 'react'
import { useWebSocket } from 'src/contexts/WebSocketContext'

export const useSocketMutation = <TRequest>(event: string) => {
  const socket = useWebSocket()

  const sendMutation = useCallback(
    (payload: TRequest) => {
      if (!socket) {
        return
      }

      socket.emit(event, payload)
    },
    [socket, event]
  )

  return sendMutation
}
