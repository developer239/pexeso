/* eslint-disable import/no-extraneous-dependencies,react/jsx-no-useless-fragment */
import { MantineProvider } from '@mantine/core'
import { render as testingLibraryRender } from '@testing-library/react'
import { theme } from '../src/theme'

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>{children}</MantineProvider>
    ),
  })
}
