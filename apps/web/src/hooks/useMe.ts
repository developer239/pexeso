import { useSessionControllerMe } from 'src/api/apiComponents'
import { useSocketQuery } from 'src/hooks/useSocketQuery'

export const useMe = () => {
  const me = useSessionControllerMe({})
  useSocketQuery(me.data?.id)

  return me
}
