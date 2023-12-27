import { Button, Group, useMantineColorScheme } from '@mantine/core'

export const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme()

  return (
    <Group justify="center">
      <Button size="xs" onClick={() => setColorScheme('light')}>
        Light
      </Button>
      <Button size="xs" onClick={() => setColorScheme('dark')}>
        Dark
      </Button>
    </Group>
  )
}
