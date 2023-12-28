import '@mantine/core/styles.css'
import { Box, Center, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { Header } from 'src/components/Header'
import { Router } from 'src/Router'
import { theme } from 'src/theme'
import 'src/global.css'

const queryClient = new QueryClient()

export const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Header />
        <Center
          maw="100%"
          h="calc(100% - 60px)"
          bg="var(--mantine-color-gray-light)"
        >
          <Box mt="-120px" maw="90%" w={400}>
            <Router />
          </Box>
        </Center>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
