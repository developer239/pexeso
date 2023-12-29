import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  ExceptionResponseDto,
  Game,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useWebSocket } from 'src/contexts/WebSocketContext'

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
      queryClient.setQueryData(['games', newGame.id], () => newGame)
    })

    socket.on(WebSocketEventEvent.gameUpdated, (game: Game) => {
      queryClient.setQueryData(['games', game.id], game)
    })

    socket.on(WebSocketEventEvent.joinGame, (game: Game) => {
      queryClient.setQueryData(['games', game.id], game)
    })

    socket.on(WebSocketEventEvent.createGame, () => {
      socket.emit(WebSocketEventEvent.createGame, userId)
    })

    socket.on(
      WebSocketEventEvent.exception,
      (exception: ExceptionResponseDto) => {
        // TODO: handle error
      }
    )

    return () => {
      socket.off(WebSocketEventEvent.allGames)
      socket.off(WebSocketEventEvent.gameCreated)
      socket.off(WebSocketEventEvent.gameUpdated)
      socket.off(WebSocketEventEvent.joinGame)
      socket.off(WebSocketEventEvent.createGame)
    }
  }, [socket, userId, queryClient])
}
