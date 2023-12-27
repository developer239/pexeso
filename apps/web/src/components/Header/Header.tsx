import { Group } from '@mantine/core'
import { ColorSchemeToggle } from 'src/components/ColorSchemeToggle/ColorSchemeToggle'
import classes from 'src/components/Header/Header.module.css'

export const Header = () => (
  <header className={classes.header}>
    <Group justify="space-between" h="100%">
      Pexeso
      <ColorSchemeToggle />
    </Group>
  </header>
)
