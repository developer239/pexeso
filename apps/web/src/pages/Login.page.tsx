import { TextInput, Button, Title, Center } from '@mantine/core'
import React, { useState } from 'react'

interface ILoginPageProps {
  readonly onLogin: (username: string) => void
}

export const LoginPage = ({ onLogin }: ILoginPageProps) => {
  const [username, setUsername] = useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin(username)
  }

  return (
    <>
      <Center>
        <Title mb="xl">Join</Title>
      </Center>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Pick any username"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
        />
        <Button type="submit" fullWidth mt="xl">
          Join
        </Button>
      </form>
    </>
  )
}
