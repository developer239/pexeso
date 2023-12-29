import { Modal } from '@mantine/core'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Game } from 'src/api/apiSchemas'

export interface IProps {
  readonly game: Game
}

export const GameFinishedModal: FC<IProps> = ({ game }) => {
  const navigate = useNavigate()

  return (
    <Modal
      opened={Boolean(game.finishedAt)}
      onClose={() => {
        navigate('/lobby')
      }}
      centered
    >
      Game finished: TODO show game information
    </Modal>
  )
}
