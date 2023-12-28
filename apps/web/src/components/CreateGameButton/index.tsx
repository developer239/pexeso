import { Button } from '@mantine/core'
import React, { FC } from 'react'
import {
  CreateGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly me: User
}

export const CreateGameButton: FC<IProps> = (props) => {
  const createGame = useSocketMutation<CreateGameRequestDto>(
    WebSocketEventEvent.createGame
  )

  const handleCreateGame = () => {
    const {
      me: { id },
    } = props

    createGame({ hostId: id })
  }

  return (
    <Button fullWidth mb="10" onClick={handleCreateGame}>
      Create New Game
    </Button>
  )
}
