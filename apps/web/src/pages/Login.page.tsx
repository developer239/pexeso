import { TextInput, Button, Title, Center } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionControllerLogin } from 'src/api/apiComponents'

export const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const navigate = useNavigate()

  const { data, mutate, error } = useSessionControllerLogin()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutate({ body: { username } })
  }

  useEffect(() => {
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
      navigate('/lobby')
    }
  }, [data])

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
          error={error?.message}
        />
        <Button type="submit" fullWidth mt="xl">
          Join
        </Button>
      </form>
    </>
  )
}
