//export const TOKEN_KEY = "@appUsinas-Token"
export const USER_DATA ="@appUsinas-User"

export const isAuthenticated = () => localStorage.getItem(USER_DATA) !== null

export const getToken = () => localStorage.getItem(USER_DATA)

export const getUser = () => localStorage.getItem(USER_DATA)

export const login = (user) => {
  localStorage.setItem(USER_DATA, JSON.stringify(user))
};

export const logout = () => {
  //localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_DATA)
};