import { Button } from '@mantine/core'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Game,
  JoinGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly gameId: number
  readonly me: User
  readonly isMine: boolean
  readonly game: Game
}

export const JoinGameButton: FC<IProps> = ({ gameId, me, isMine, game }) => {
  const navigate = useNavigate()
  const joinGame = useSocketMutation<JoinGameRequestDto>(
    WebSocketEventEvent.joinGame
  )

  const handleCreateGame = () => {
    joinGame({ gameId, userId: me.id })

    setTimeout(() => {
      navigate(`/game/${gameId}`)
    }, 100)
  }

  const isFull = game.players?.length === game.maxPlayers
  const isMeJoined = game.players?.some((player) => player.user.id === me.id)
  if (isFull && !isMeJoined) {
    return (
      <Button disabled variant="light" size="xs">
        full
      </Button>
    )
  }

  return (
    <Button variant="light" size="xs" onClick={handleCreateGame}>
      {isMine || isMeJoined ? 'open' : 'join'}
    </Button>
  )
}
