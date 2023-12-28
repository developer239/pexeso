import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

export interface IGame {
  id: number
  name: string
  host: { id: number }
}

export const useReactQuerySocketSubscription = (
  url: string,
  userId: number | undefined
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket: Socket = io(url)

    socket.on('connect', () => {
      console.log('Socket.IO connected')
      socket.emit('requestAllGames')
    })

    socket.on('allGames', (games: IGame[]) => {
      queryClient.setQueryData(['games', 'list'], games)
    })

    socket.on('gameCreated', (newGame: IGame) => {
      queryClient.setQueryData(
        ['games', 'list'],
        (oldGames: IGame[] | undefined) => [...(oldGames || []), newGame]
      )
    })

    if (userId !== undefined) {
      socket.on('createGame', () => {
        socket.emit('createGame', userId)
      })
    }

    return () => {
      socket.disconnect()
    }
  }, [queryClient, url, userId])
}
