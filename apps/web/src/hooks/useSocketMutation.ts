import { useCallback } from 'react'
import { WebSocketEventEvent } from 'src/api/apiSchemas'
import { useWebSocket } from 'src/contexts/WebSocketContext'

export const useSocketMutation = <TRequest>(
  event: string,
  successEvent?: WebSocketEventEvent
) => {
  const socket = useWebSocket()

  const sendMutation = useCallback(
    (payload: TRequest, callback?: (...args: any[]) => void) => {
      if (!socket) {
        return
      }

      socket.emit(event, payload)
      if (successEvent && callback) {
        socket.on(successEvent, callback)
      }
    },
    [socket, event]
  )

  return sendMutation
}
