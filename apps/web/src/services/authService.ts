export const login = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
  window.location.href = '/lobby'
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  window.location.href = '/'
}
