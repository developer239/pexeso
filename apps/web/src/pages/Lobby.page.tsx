import React from 'react'
import { User } from 'src/api/apiSchemas'
import { AvailableGamesTable } from 'src/components/AvailableGamesTable'
import { CreateGameButton } from 'src/components/CreateGameButton'
import { useSocketQuery } from 'src/hooks/useSocketQuery'

export interface IProps {
  readonly me: User
}

export const LobbyPage: React.FC<IProps> = ({ me }) => {
  useSocketQuery(me.id)

  return (
    <>
      <CreateGameButton me={me} />
      <AvailableGamesTable me={me} />
    </>
  )
}
