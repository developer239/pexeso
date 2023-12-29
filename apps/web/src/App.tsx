import '@mantine/core/styles.css'
import { AppShell, Container, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { Header } from 'src/components/Header'
import { WebSocketProvider } from 'src/contexts/WebSocketContext'
import { Router } from 'src/Router'
import { theme } from 'src/theme'
import 'src/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

export const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
              <Header />
            </AppShell.Header>
            <AppShell.Main bg="var(--mantine-color-gray-light)">
              <Container maw="1200" size="80%">
                <Router />
              </Container>
            </AppShell.Main>
          </AppShell>
        </MantineProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
