import { Button } from '@mantine/core'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  JoinGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly gameId: number
  readonly me: User
  readonly isMine: boolean
}

export const JoinGameButton: FC<IProps> = ({ gameId, me, isMine }) => {
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

  return (
    <Button variant="light" size="xs" onClick={handleCreateGame}>
      {isMine ? 'open' : 'join'}
    </Button>
  )
}
