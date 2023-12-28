import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Game, WebSocketEventEvent } from 'src/api/apiSchemas'
import { useWebSocket } from 'src/hooks/useWebSocket'

export const useSocketQuery = (userId: number | undefined) => {
  const queryClient = useQueryClient()
  const socket = useWebSocket()

  useEffect(() => {
    if (!socket) return

    socket.emit(WebSocketEventEvent.requestAllGames)

    socket.on(WebSocketEventEvent.allGames, (games: Game[]) => {
      queryClient.setQueryData(['games', 'list'], games)
    })

    socket.on(WebSocketEventEvent.gameCreated, (newGame: Game) => {
      queryClient.setQueryData(
        ['games', 'list'],
        (oldGames: Game[] | undefined) => [...(oldGames || []), newGame]
      )
    })

    if (userId !== undefined) {
      socket.on(WebSocketEventEvent.createGame, () => {
        socket.emit(WebSocketEventEvent.createGame, userId)
      })
    }

    return () => {
      socket.off(WebSocketEventEvent.allGames)
      socket.off(WebSocketEventEvent.gameCreated)
    }
  }, [socket, userId, queryClient])
}
