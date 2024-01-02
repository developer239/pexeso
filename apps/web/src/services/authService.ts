export const login = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const logout = () => {
  localStorage.removeItem('accessToken')
}
