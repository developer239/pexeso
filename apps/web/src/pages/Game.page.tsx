import { Grid, Space } from '@mantine/core'
import React from 'react'
import { GameBoard } from 'src/components/GameBoard'
import { GameFinishedModal } from 'src/components/GameFinishedModal'
import { GameOptionsWidget } from 'src/components/GameOptionsWIdget'
import { GamePlayersWidget } from 'src/components/GamePlayersWidget'

export const GamePage = () => (
  <>
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
        <GameBoard rowsCount={4} columnsCount={4} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <GameOptionsWidget />
        <Space h="lg" />
        <GamePlayersWidget />
      </Grid.Col>
    </Grid>
    <GameFinishedModal />
  </>
)
