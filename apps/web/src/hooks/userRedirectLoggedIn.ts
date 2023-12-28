import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe } from 'src/hooks/useMe'

export const useRedirectLoggedIn = () => {
  const navigate = useNavigate()
  const me = useMe()

  useEffect(() => {
    if (me.data) {
      navigate('/lobby')
    }
  }, [me.data])
}
