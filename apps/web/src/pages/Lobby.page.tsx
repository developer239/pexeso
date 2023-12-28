import { Button, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useUsersControllerMe } from 'src/api/apiComponents'
import {
  useReactQuerySocketSubscription,
  IGame,
} from 'src/hooks/useReactQuerySocketSubscription'

export const LobbyPage: React.FC = () => {
  const me = useUsersControllerMe({})
  const socketUrl = 'http://localhost:8080/games'

  // Use the custom hook for Socket.IO subscription
  useReactQuerySocketSubscription(socketUrl, me.data?.id)

  const { data: games } = useQuery<IGame[]>({
    queryKey: ['games', 'list'],
    queryFn: () =>
      // Placeholder function, replace with your actual data fetching logic
      new Promise<IGame[]>((resolve) => {
        // Fetching logic here
      }),
  })

  const handleCreateGame = () => {
    // This will trigger the 'createGame' event listener in the custom hook
    // Nothing needs to be done here if the socket event is emitted from the hook
  }

  if (me.isLoading) {
    return <Title>Loading...</Title>
  }

  return (
    <>
      <Title>Welcome, {me.data?.username}</Title>
      <Button onClick={handleCreateGame}>Create New Game</Button>
      <div>
        {games?.map((game) => (
          <div key={game.id}>
            {game.name} - Id: {game.id}
            {game.name} - Host: {game.host.id}
          </div>
        ))}
      </div>
    </>
  )
}
