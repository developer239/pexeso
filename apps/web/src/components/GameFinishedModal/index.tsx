import { Modal } from '@mantine/core'
import React from 'react'

export const GameFinishedModal = () => (
  <Modal
    opened={false}
    onClose={() => {
      // navigate to /lobby
      window.location.href = '/lobby'
    }}
    centered
  >
    Player XY won!
  </Modal>
)
