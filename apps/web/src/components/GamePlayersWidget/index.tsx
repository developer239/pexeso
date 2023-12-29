import { Avatar, Paper, Table, TableData } from '@mantine/core'
import React, { FC } from 'react'
import { User } from 'src/api/apiSchemas'

export interface IProps {
  readonly users: User[]
}

export const GamePlayersWidget: FC<IProps> = ({ users }) => {
  const tableData: TableData = {
    head: ['', 'Name'],
    body: users.map((user) => [<Avatar key={0} />, user.username]),
  }

  return (
    <Paper p="md" shadow="xs">
      <Table data={tableData} />
    </Paper>
  )
}
