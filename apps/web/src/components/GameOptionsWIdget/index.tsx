import { Button, Paper, Progress, Space } from '@mantine/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Game,
  LeaveGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly me: User
  readonly game: Game
}

export const GameOptionsWidget: React.FC<IProps> = ({ me, game }) => {
  const navigate = useNavigate()
  const leaveGame = useSocketMutation<LeaveGameRequestDto>(
    WebSocketEventEvent.leaveGame
  )

  const handleLeaveGame = () => {
    leaveGame({ userId: me.id, gameId: game.id })
    navigate('/lobby')
  }

  const isMeHost = game.host.id === me.id

  return (
    <Paper p="md" shadow="xs">
      0:00 total time played
      <Space h="sm" />
      <Progress radius="xs" size="xl" value={30} />
      <Space h="md" />
      <Button disabled={!isMeHost} fullWidth>
        {isMeHost ? 'Start Game' : 'Waiting for host to start'}
      </Button>
      <Space h="md" />
      <Button onClick={handleLeaveGame} fullWidth variant="filled" color="red">
        Leave Game
      </Button>
    </Paper>
  )
}
