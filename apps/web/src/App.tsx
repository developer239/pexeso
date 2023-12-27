import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Router } from './Router'
import { theme } from './theme'

export const App = () => (
  <MantineProvider theme={theme}>
    <Router />
  </MantineProvider>
)
