import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from 'src/components/ProtectedRoute'
import { GamePage } from 'src/pages/Game.page'
import { LobbyPage } from 'src/pages/Lobby.page'
import { LoginPage } from 'src/pages/Login.page'

const router = createBrowserRouter([
  {
    path: '/lobby',
    element: <ProtectedRoute component={LobbyPage} />,
  },
  {
    path: '/game',
    element: <ProtectedRoute component={GamePage} />,
  },
  {
    path: '/',
    element: <LoginPage />,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
