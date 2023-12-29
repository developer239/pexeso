import { Button } from '@mantine/core'
import React, { FC } from 'react'
import {
  User,
  WebSocketEventEvent,
  StartGameRequestDto,
  Game,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly me: User
  readonly game: Game
}

export const StartGameButton: FC<IProps> = ({ me, game }) => {
  const startGame = useSocketMutation<StartGameRequestDto>(
    WebSocketEventEvent.requestStartGame
  )

  const handleCreateGame = () => {
    startGame({
      userId: me.id,
      gameId: game.id,
    })
  }

  const isMeHost = game.host.id === me.id

  if (!isMeHost) {
    return (
      <Button disabled fullWidth>
        Waiting for host to start
      </Button>
    )
  }

  return (
    <Button fullWidth onClick={handleCreateGame}>
      Start Game
    </Button>
  )
}
