//export const TOKEN_KEY = "@appUsinas-Token"
export const TOKEN_KEY = "@appUsinas-Token"

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null

export const getToken = () => localStorage.getItem(TOKEN_KEY)


//login
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token) 
};


//logout
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
};