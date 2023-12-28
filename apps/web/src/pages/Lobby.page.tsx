// src/pages/LobbyPage.tsx
import { Button, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useUsersControllerMe } from 'src/api/apiComponents'
import { useWebSocket } from 'src/hooks/useWebSocket'

export const LobbyPage = () => {
  const me = useUsersControllerMe({})
  const [games, setGames] = useState<any[]>([])
  const socket = useWebSocket('http://localhost:8080/games')

  const handleCreateGame = () => {
    socket?.emit('createGame', me.data?.id)
  }

  useEffect(() => {
    socket?.on('gameCreated', (newGame) => {
      setGames((prevGames) => [...prevGames, newGame])
    })

    socket?.on('allGames', (existingGames) => {
      setGames(existingGames)
    })

    socket?.emit('requestAllGames')

    return () => {
      socket?.off('gameCreated')
      socket?.off('allGames')
    }
  }, [socket])

  if (me.isLoading) {
    return <Title>Loading...</Title>
  }

  return (
    <>
      <Title>Welcome, {me.data?.username}</Title>
      <Button onClick={handleCreateGame}>Create New Game</Button>
      <div>
        {games.map((game) => (
          <div key={game.id}>
            {game.name} - Id: {game.id}
            {game.name} - Host: {game.host.id}
          </div>
        ))}
      </div>
    </>
  )
}
