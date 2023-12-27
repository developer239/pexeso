import { Title } from '@mantine/core'
import React from 'react'
import { useUsersControllerMe } from 'src/api/apiComponents'

export const LobbyPage = () => {
  const me = useUsersControllerMe({})

  if (me.isLoading) {
    return <Title>Loading...</Title>
  }

  return <Title>Welcome, {me.data?.username}</Title>
}
