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

  const rows = games?.map((game) => (
    <Table.Tr key={game.id}>
      <Table.Td>{game.host.username}</Table.Td>
      <Table.Td>
        {game.players?.length || 0}/{game.maxPlayers}
      </Table.Td>
      <Table.Td>
        <JoinGameButton
          key={game.id}
          gameId={game.id}
          me={me}
          isMine={game.host.id === me.id}
          game={game}
        />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: '35%' }}>Host Name</Table.Th>
          <Table.Th style={{ width: '35%' }}>Players</Table.Th>
          <Table.Th style={{ width: '30%' }} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
