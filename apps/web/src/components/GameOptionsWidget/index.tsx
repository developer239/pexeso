import { Button, CopyButton, Flex, Paper, Progress, Space } from '@mantine/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Game,
  LeaveGameRequestDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import { ElapsedTime } from 'src/components/ElapsedTime'
import { StartGameButton } from 'src/components/StartGameButton'
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

  const isMeInPlayers = game.players.some((player) => player.user.id === me.id)

  const handleLeaveGame = () => {
    leaveGame({ userId: me.id, gameId: game.id })
    navigate('/lobby')
  }

  return (
    <Paper p="md" shadow="xs">
      {Boolean(game.startedAt) && (
        <ElapsedTime
          startedAt={game.startedAt}
          timeLimitSeconds={game.timeLimitSeconds}
          shouldShowProgressBar
        />
      )}
      {!game.startedAt && (
        <>
          <StartGameButton me={me} game={game} />
          <Space h="md" />
          <CopyButton value={window.location.href}>
            {({ copied, copy }) => (
              <Button
                fullWidth
                variant="light"
                color={copied ? 'teal' : 'blue'}
                onClick={copy}
              >
                {copied ? 'Copied join link' : 'Copy join link'}
              </Button>
            )}
          </CopyButton>
        </>
      )}

      {isMeInPlayers && (
        <>
          <Space h="md" />
          <Button
            onClick={handleLeaveGame}
            fullWidth
            variant="filled"
            color="red"
          >
            {game.startedAt ? 'Forfeit' : 'Leave Game'}
          </Button>
        </>
      )}
    </Paper>
  )
}
