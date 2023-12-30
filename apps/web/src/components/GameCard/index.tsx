import React from 'react'
import {
  Game,
  RequestFlipCardDto,
  User,
  WebSocketEventEvent,
} from 'src/api/apiSchemas'
import styles from 'src/components/GameCard/GameCard.module.css'
import { useSocketMutation } from 'src/hooks/useSocketMutation'

export interface IProps {
  readonly me: User
  readonly game: Game
  readonly row: number
  readonly column: number
}

export const GameCard: React.FC<IProps> = ({ game, row, column, me }) => {
  const flipCard = useSocketMutation<RequestFlipCardDto>(
    WebSocketEventEvent.requestFlipCard
  )

  // TODO: write generic selectors
  const getGameCard = () =>
    game.cards.find((card) => card.row === row && card.col === column)

  // TODO: write generic selectors
  const currentPlayer = game.players.find((player) => player.turnStartedAt)
  const isMyTurn = currentPlayer?.user.id === me.id

  const card = getGameCard()!

  const handleClick = () => {
    flipCard({
      gameId: game.id,
      cardId: card.id,
      userId: me.id,
    })
  }

  if (!card) {
    return null
  }

  return (
    <div
      role="button"
      aria-pressed={card.isFlipped || card.isMatched}
      tabIndex={0}
      className={styles.card}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleClick()
        }
      }}
      style={{
        cursor:
          card.isFlipped || card.isMatched || !isMyTurn ? 'default' : 'pointer',
        opacity: !(card.isFlipped || card.isMatched) && !isMyTurn ? 0.5 : 1,
      }}
    >
      <div
        className={`${styles.cardInner} ${
          card.isFlipped || card.isMatched ? styles.cardFlipped : ''
        }`}
      >
        <div
          style={{
            backgroundImage: `url(/assets/cards/${card.card?.image})`,
          }}
          className={`${styles.cardFace} ${styles.cardFront}`}
        />
        <div className={`${styles.cardFace} ${styles.cardBack}`}>?</div>
      </div>
    </div>
  )
}
