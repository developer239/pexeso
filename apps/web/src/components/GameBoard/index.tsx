import { Grid } from '@mantine/core'
import React from 'react'
import { Game, User } from 'src/api/apiSchemas'
import { GameCard } from 'src/components/GameCard'

interface IGameBoardProps {
  readonly game: Game
  readonly me: User
}

export const GameBoard: React.FC<IGameBoardProps> = ({ game, me }) => {
  const cards = Array.from(
    { length: game.gridSize.height * game.gridSize.width },
    () => ({
      id: Math.random().toString(36).substr(2, 9),
    })
  )

  return (
    <Grid columns={game.gridSize.width}>
      {cards.map((card, index) => {
        const row = Math.floor(index / game.gridSize.width)
        const column = index % game.gridSize.width
        return (
          <Grid.Col key={`${row}-${column}`} span={1}>
            <GameCard me={me} game={game} row={row} column={column} />
          </Grid.Col>
        )
      })}
    </Grid>
  )
}
