import { Avatar, Paper, Table, TableData } from '@mantine/core'
import React from 'react'

export const GamePlayersWidget = () => {
  const tableData: TableData = {
    head: ['', 'Name'],
    body: [
      [<Avatar key={0} />, 'John Doe'],
      [<Avatar key={1} />, 'Jane Doe'],
      [<Avatar key={2} />, 'Jane Doe'],
    ],
  }

  return (
    <Paper p="md" shadow="xs">
      <Table data={tableData} />
    </Paper>
  )
}
