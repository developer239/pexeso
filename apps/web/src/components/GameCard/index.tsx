import React from 'react'
import { Game } from 'src/api/apiSchemas'
import styles from 'src/components/GameCard/GameCard.module.css'

export interface IProps {
  readonly game: Game
  readonly row: number
  readonly column: number
}

// TODO: prevent user who is not part of the game from flipping the card
export const GameCard: React.FC<IProps> = ({ game, row, column }) => {
  const getGameCard = () =>
    game.cards.find((card) => card.row === row && card.col === column)

  const card = getGameCard()!

  const handleClick = () => {
    // Do something special
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
        cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
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
