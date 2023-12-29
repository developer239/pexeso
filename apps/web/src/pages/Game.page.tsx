import { Grid, Space } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Game, User } from 'src/api/apiSchemas'
import { GameBoard } from 'src/components/GameBoard'
import { GameFinishedModal } from 'src/components/GameFinishedModal'
import { GameOptionsWidget } from 'src/components/GameOptionsWIdget'
import { GamePlayersWidget } from 'src/components/GamePlayersWidget'
import { useSocketQuery } from 'src/hooks/useSocketQuery'

export interface IProps {
  readonly me: User
}

export const GamePage: FC<IProps> = ({ me }) => {
  useSocketQuery(me.id)

  const { gameId } = useParams()
  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ['games', Number(gameId)],
  })

  if (isLoading) {
    return null
  }

  if (!game) {
    // TODO: redirect user to lobby if game not loaded at all (if user didn't join the room or created the game)
    return null
  }

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
          <GameBoard rowsCount={4} columnsCount={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
          <GameOptionsWidget me={me} />
          <Space h="lg" />
          <GamePlayersWidget
            users={game.players.map((player) => player.user)}
          />
        </Grid.Col>
      </Grid>
      <GameFinishedModal />
    </>
  )
}
