import { Button, Paper, Progress, Space } from '@mantine/core'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LeaveGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly me: User
}

export const GameOptionsWidget: React.FC<IProps> = (props) => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const leaveGame = useSocketMutation<LeaveGameRequestDto>(
    WebSocketEventEvent.leaveGame
  )

  const handleLeaveGame = () => {
    const {
      me: { id },
    } = props

    leaveGame({ userId: id, gameId: Number(gameId!) })
    navigate('/lobby')
  }

  return (
    <Paper p="md" shadow="xs">
      0:00 total time played
      <Space h="sm" />
      <Progress radius="xs" size="xl" value={30} />
      <Space h="md" />
      <Button fullWidth>Start Game</Button>
      <Space h="md" />
      <Button onClick={handleLeaveGame} fullWidth variant="filled" color="red">
        Leave Game
      </Button>
    </Paper>
  )
}
