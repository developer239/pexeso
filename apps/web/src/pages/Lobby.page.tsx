import { Title } from '@mantine/core'
import React from 'react'

interface ILobbyPageProps {
  readonly username: string
}

export const LobbyPage = ({ username }: ILobbyPageProps) => (
  <Title>Welcome, {username}</Title>
)
