import { Button, Group, Switch, useMantineColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { useSessionControllerLogout } from 'src/api/apiComponents'
import classes from 'src/components/Header/Header.module.css'
import { useMe } from 'src/hooks/useMe'
import { logout } from 'src/services/authService'

export const Header = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const [isDark, { toggle }] = useDisclosure(colorScheme === 'dark')
  const logoutMutation = useSessionControllerLogout()
  const me = useMe()

  const handleToggleDarkMode = () => {
    setColorScheme(isDark ? 'light' : 'dark')
    toggle()
  }

  const handleLogout = () => {
    logoutMutation.mutate({})
    logout()
    window.location.href = '/'
  }

  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        Pexeso
        <Group justify="center">
          <Switch
            checked={isDark}
            onChange={handleToggleDarkMode}
            label="Light | Dark"
          />
          {me.data && (
            <Button size="xs" onClick={handleLogout}>
              {me.data.username} Logout
            </Button>
          )}
        </Group>
      </Group>
    </header>
  )
}
