import { Modal } from '@mantine/core'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Game, GamePlayer } from 'src/api/apiSchemas'

export interface IProps {
  readonly game: Game
}

// TODO: refactor
export const GameFinishedModal: FC<IProps> = ({ game }) => {
  const navigate = useNavigate()

  const winners = game.players.reduce((acc, player) => {
    if (!acc.length) {
      return [player]
    }

    if (player.matchedCards?.length === acc[0].matchedCards?.length) {
      return [...acc, player]
    }

    if (player?.matchedCards?.length > acc[0].matchedCards?.length) {
      return [player]
    }

    return acc
  }, [] as GamePlayer[])
  const isTie = winners.length > 1
  const message = isTie
    ? `It is a tie! ${winners
        .map((winner) => winner.user.username)
        .join(', ')} won!`
    : `${winners[0].user.username} won!`

  return (
    <Modal
      opened={Boolean(game.finishedAt)}
      onClose={() => {
        navigate('/lobby')
      }}
      centered
    >
      Game finished: {message}
    </Modal>
  )
}
