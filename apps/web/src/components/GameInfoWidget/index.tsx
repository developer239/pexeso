import { Avatar, Flex, Paper, Progress, Space } from '@mantine/core'
import React, { FC } from 'react'
import { Game } from 'src/api/apiSchemas'

export interface IProps {
  readonly game: Game
}

export const GameInfoWidget: FC<IProps> = ({ game }) => {
  const currentPlayer = game.players.find((player) => player.isOnTurn)

  console.log('currentPlayer', currentPlayer)
  console.log('game.players', game.players)

  return (
    <Paper p="md" shadow="xs">
      <Flex align="center">
        <Avatar key={1} mr={8} />
        {currentPlayer?.user.username || 'unknown'}'s turn
      </Flex>
      {/*<Space h="sm" />*/}
      {/*1:12 second left*/}
      {/*<Space h="sm" />*/}
      {/*<Progress radius="xs" size="xl" value={30} />*/}
    </Paper>
  )
}
