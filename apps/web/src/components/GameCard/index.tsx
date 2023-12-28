import React, { useState } from 'react'
import styles from 'src/components/GameCard/GameCard.module.css'

export const GameCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div
      role="button"
      aria-pressed={isFlipped}
      tabIndex={0}
      className={styles.card}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleClick()
        }
      }}
    >
      <div
        className={`${styles.cardInner} ${isFlipped ? styles.cardFlipped : ''}`}
      >
        <div className={`${styles.cardFace} ${styles.cardFront}`} />
        <div className={`${styles.cardFace} ${styles.cardBack}`}>?</div>
      </div>
    </div>
  )
}
