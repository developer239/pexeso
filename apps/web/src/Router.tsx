import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LobbyPage } from 'src/pages/Lobby.page'
import { LoginPage } from 'src/pages/Login.page'

const router = createBrowserRouter([
  {
    path: '/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/',
    element: <LoginPage />,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
