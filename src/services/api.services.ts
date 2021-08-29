import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies"
import { singOut } from "../context/Auth.context"

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue: any[] = []

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
    if ( error.response.data?.code === "token.expired" ) {
      cookies = parseCookies()

      const { 'nextauth.refreshToken': refreshToken } = cookies
      const originalRequest = error.config

      if ( !isRefreshing ) {
        isRefreshing = true

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

            failedRequestsQueue.forEach( request => {
              request.resolve( token )
            } )

            failedRequestsQueue = []

          } )
          .catch( ( error ) => {
            failedRequestsQueue.forEach( request => request.reject( error ) )
            failedRequestsQueue = []
          } )
          .finally( () => { isRefreshing = false } )

      }

      return new Promise( ( resolve, reject ) => {
        failedRequestsQueue.push( {
          resolve: ( token: string ) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve( api( originalRequest ) )
          },
          reject: ( error: AxiosError ) => {
            reject( error )
          }
        } )
      } )

    } else {
      singOut()
    }
  }

  return Promise.reject( error )
} )