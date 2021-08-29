import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies"

let cookies = parseCookies()

export const api = axios.create( {
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
} )

api.interceptors.response.use( response => {
  return response
}, ( error: AxiosError ) => {
  if ( error.response?.status === 401 ) {
    if ( error.response.data?.code === "token_expired" ) {
      cookies = parseCookies()
      const { 'nextauth.refreshToken': refreshToken } = cookies

      api
        .post( '/refresh', { refreshToken } )
        .then( ( { data } ) => {
          const { token } = data

          setCookie( undefined, 'nextauth.token', token,
            {
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/',
            }
          )
          setCookie( undefined, 'nextauth.refreshToken', data.refreshToken,
            {
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/',
            }
          )

          api.defaults.headers['Authorization'] = `Bearer ${token}`

        } )

    } else {

    }
  }
} )