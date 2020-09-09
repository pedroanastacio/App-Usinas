//export const TOKEN_KEY = "@appUsinas-Token"
export const USER_DATA = "@appUsinas-User"

export const isAuthenticated = () => localStorage.getItem(USER_DATA) !== null

export const getToken = () => localStorage.getItem(USER_DATA)

export const getUser = () => localStorage.getItem(USER_DATA)


//login
export const setToken = (user) => {
  localStorage.setItem(USER_DATA, JSON.stringify(user)) 
};


//logout
export const removeToken = () => {
  localStorage.removeItem(USER_DATA)
};