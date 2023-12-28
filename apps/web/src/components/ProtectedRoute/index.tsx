import { ElementType } from 'react'
import { useMe } from 'src/hooks/useMe'
import { LoginPage } from 'src/pages/Login.page'

interface IProps {
  readonly component: ElementType
}

export const ProtectedRoute = ({ component: ComponentRoute }: IProps) => {
  const me = useMe()

  if (me.isLoading) {
    return <div>Loading...</div>
  }

  if (!me.data) {
    return <LoginPage />
  }

  return <ComponentRoute me={me.data} />
}
