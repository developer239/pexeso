import { Button } from '@mantine/core'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Game,
  JoinGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { ElapsedTime } from 'src/components/ElapsedTime'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly gameId: number
  readonly me: User
  readonly isMine: boolean
  readonly game: Game
}

export const JoinGameButton: FC<IProps> = ({ gameId, me, game }) => {
  const navigate = useNavigate()
  const joinGame = useSocketMutation<JoinGameRequestDto>(
    WebSocketEventEvent.joinGame
  )

  const handleJoinGame = () => {
    joinGame({ gameId, userId: me.id })

    setTimeout(() => {
      navigate(`/game/${gameId}`)
    }, 100)
  }

  const isMeJoined = game.players?.some((player) => player.user.id === me.id)
  if (isMeJoined) {
    return (
      <Button variant="light" size="xs" w={150} onClick={handleJoinGame}>
        Open
      </Button>
    )
  }

  if (game.startedAt) {
    return (
      <Button disabled variant="light" size="xs" w={150}>
        Started:{' '}
        <ElapsedTime
          startedAt={game.startedAt!}
          timeLimitSeconds={game.timeLimitSeconds}
          // TODO: this text is doubled
          text=" "
        />
      </Button>
    )
  }

  const isFull = game.players?.length === game.maxPlayers
  if (isFull && !isMeJoined) {
    return (
      <Button disabled variant="light" size="xs" w={150}>
        full
      </Button>
    )
  }

  return (
    <Button variant="light" size="xs" onClick={handleJoinGame} w={150}>
      join
    </Button>
  )
}
