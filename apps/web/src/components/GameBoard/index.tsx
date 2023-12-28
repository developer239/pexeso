import { Grid } from '@mantine/core'
import React from 'react'
import { GameCard } from 'src/components/GameCard'

interface IGameBoardProps {
  readonly rowsCount: number
  readonly columnsCount: number
}

export const GameBoard: React.FC<IGameBoardProps> = ({
  rowsCount,
  columnsCount,
}) => {
  const cards = Array.from({ length: rowsCount * columnsCount }, () => ({
    id: Math.random().toString(36).substr(2, 9),
  }))

  return (
    <Grid columns={columnsCount}>
      {cards.map((card) => (
        <Grid.Col key={card.id} span={1}>
          <GameCard />
        </Grid.Col>
      ))}
    </Grid>
  )
}
