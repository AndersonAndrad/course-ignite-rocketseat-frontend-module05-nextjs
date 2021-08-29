import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies"
import { singOut } from "../context/Auth.context"

let isRefreshing = false
let failedRequestsQueue: any[] = []

export function setupAPIClient ( context = undefined ) {
  let cookies = parseCookies( context )
  const api = axios.create( {
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
        cookies = parseCookies( context )

        const { 'nextauth.refreshToken': refreshToken } = cookies
        const originalRequest = error.config

        if ( !isRefreshing ) {
          isRefreshing = true

          api
            .post( '/refresh', { refreshToken } )
            .then( ( { data } ) => {
              const { token } = data

              setCookie( context, 'nextauth.token', token,
                {
                  maxAge: 30 * 24 * 60 * 60, // 30 days
                  path: '/',
                }
              )

              setCookie( context, 'nextauth.refreshToken', data.refreshToken,
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

              if ( process.browser ) {
                singOut()
              }
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
        if ( process.browser ) {
          singOut()
        }
      }
    }

    return Promise.reject( error )
  } )

  return api
}