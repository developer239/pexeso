import { Button, Table, TableData } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { Game, User } from 'src/api/apiSchemas'

export interface IProps {
  readonly me: User
}

export const AvailableGamesTable: FC<IProps> = ({ me }) => {
  const { data: games } = useQuery<Game[]>({
    queryKey: ['games', 'list'],
  })

  const tableData: TableData = {
    head: ['Game ID', 'Host Name', 'Players', ''],
    body: games?.map((game) => [
      game.id,
      game.host.username,
      `${game.players.length}/${game.maxPlayers}`,
      <Button
        key={game.id}
        variant="light"
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log('join game as user', game.id, me.id)
        }}
      >
        join
      </Button>,
    ]),
  }

  return <Table data={tableData} />
}
