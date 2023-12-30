import { Avatar, Flex, Paper } from '@mantine/core'
import React, { FC } from 'react'
import { Game } from 'src/api/apiSchemas'
import { ElapsedTime } from 'src/components/ElapsedTime'

export interface IProps {
  readonly game: Game
}

export const GameInfoWidget: FC<IProps> = ({ game }) => {
  // TODO: write generic selectors
  const currentPlayer = game.players.find((player) => player.turnStartedAt)

  if (!currentPlayer) {
    return null
  }

  const isTwoCardsFlipped = currentPlayer?.cardsFlippedThisTurn === 2
  const isAllCardsFlippedAllCardsMatched =
    game.cards.find((card) => card.isMatched) ===
    game.cards.find((card) => card.isFlipped)

  return (
    <Paper p="md" shadow="xs">
      <Flex align="center">
        <Avatar key={1} mr={8} />
        {currentPlayer?.user.username || 'unknown'}
        's turn
      </Flex>
      <ElapsedTime
        startedAt={currentPlayer.turnStartedAt}
        shouldShowProgressBar
        text="turn time left"
        timeLimitSeconds={game.turnLimitSeconds}
        shouldCountInReverse
        isFull={isTwoCardsFlipped}
        playerMatchedBothCards={isAllCardsFlippedAllCardsMatched}
      />
    </Paper>
  )
}
