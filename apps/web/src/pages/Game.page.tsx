import { Grid, Space } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Game,
  JoinGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { GameBoard } from 'src/components/GameBoard'
import { GameFinishedModal } from 'src/components/GameFinishedModal'
import { GameInfoWidget } from 'src/components/GameInfoWidget'
import { GamePlayersWidget } from 'src/components/GamePlayersWidget'
import { useSocketMutation } from 'src/hooks/useSocketMutation'
import { useSocketQuery } from 'src/hooks/useSocketQuery'
import { GameOptionsWidget } from '../components/GameOptionsWidget'

export interface IProps {
  readonly me: User
}

export const GamePage: FC<IProps> = ({ me }) => {
  const { gameId } = useParams()

  useSocketQuery(me.id)
  const joinGame = useSocketMutation<JoinGameRequestDto>(
    WebSocketEventEvent.joinGame
  )

  useEffect(() => {
    joinGame({ gameId: Number(gameId), userId: me.id })
  }, [])

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
          <GameOptionsWidget game={game} me={me} />
          <Space h="lg" />
          {Boolean(game.startedAt) && (
            <>
              <GameInfoWidget game={game} />
              <Space h="lg" />
            </>
          )}
          <GamePlayersWidget
            users={game.players.map((player) => player.user)}
          />
        </Grid.Col>
      </Grid>
      <GameFinishedModal game={game} />
    </>
  )
}
