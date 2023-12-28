import { Grid, Space } from '@mantine/core'
import React, { FC } from 'react'
import { User } from 'src/api/apiSchemas'
import { GameBoard } from 'src/components/GameBoard'
import { GameFinishedModal } from 'src/components/GameFinishedModal'
import { GameOptionsWidget } from 'src/components/GameOptionsWIdget'
import { GamePlayersWidget } from 'src/components/GamePlayersWidget'

export interface IProps {
  readonly me: User
}

export const GamePage: FC<IProps> = ({ me }) => (
  <>
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
        <GameBoard rowsCount={4} columnsCount={4} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <GameOptionsWidget me={me} />
        <Space h="lg" />
        <GamePlayersWidget />
      </Grid.Col>
    </Grid>
    <GameFinishedModal />
  </>
)
