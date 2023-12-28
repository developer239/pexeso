import { Button, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionControllerLogin } from 'src/api/apiComponents'
import { login } from 'src/services/authService'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')

  const { data, mutate, error } = useSessionControllerLogin()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutate({ body: { username } })
  }

  useEffect(() => {
    if (data?.accessToken) {
      login(data.accessToken)
      navigate('/lobby')
    }
  }, [data])

  return (
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
  )
}
