import { Button, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useUsersControllerMe } from 'src/api/apiComponents'
import { Game, CreateGameRequestDto } from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'
import { useSocketQuery } from 'src/hooks/useSocketQuery'

// TODO: sometimes games are not loaded on init for some reason
export const LobbyPage: React.FC = () => {
  const me = useUsersControllerMe({})
  useSocketQuery(me.data?.id)

  const { data: games } = useQuery<Game[]>({
    queryKey: ['games', 'list'],
  })

  const createGame = useSocketMutation<CreateGameRequestDto>('createGame')

  const handleCreateGame = () => {
    if (me.data?.id) {
      createGame({ hostId: me.data.id })
    }
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
            Id: {game.id} | Host: {game.host.id}
          </div>
        ))}
      </div>
    </>
  )
}
