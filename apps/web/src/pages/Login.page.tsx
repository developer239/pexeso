import { Title, Center } from '@mantine/core'
import React from 'react'
import { LoginForm } from 'src/components/LoginForm'
import { useRedirectLoggedIn } from 'src/hooks/userRedirectLoggedIn'

export const LoginPage = () => {
  useRedirectLoggedIn()

  return (
    <>
      <Center>
        <Title mb="xl">Join</Title>
      </Center>
      <LoginForm />
    </>
  )
}
