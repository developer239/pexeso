import { Paper, Table, TableData } from '@mantine/core'
import React, { FC } from 'react'
import { Game } from 'src/api/apiSchemas'

export interface IProps {
  readonly game: Game
}

export const GamePlayersWidget: FC<IProps> = ({ game }) => {
  const tableData: TableData = {
    head: game.startedAt ? ['Name', 'Score'] : ['Name'],
    body: game.players.map((player) => {
      if (game.startedAt) {
        return [player.user.username, (player.matchedCards || []).length / 2]
      }

      return [player.user.username]
    }),
  }

  return (
    <Paper p="md" shadow="xs">
      <Table data={tableData} />
    </Paper>
  )
}
