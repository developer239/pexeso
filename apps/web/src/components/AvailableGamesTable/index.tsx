import { Table, TableData } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { Game, User } from 'src/api/apiSchemas'
import { JoinGameButton } from 'src/components/JoinGameButton'

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
      `${game.players?.length || 0}/${game.maxPlayers}`,
      <JoinGameButton
        key={game.id}
        gameId={game.id}
        me={me}
        isMine={game.host.id === me.id}
      />,
    ]),
  }

  return <Table data={tableData} />
}
