import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { api } from "../services/apiClient.services"

type SingInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  singIn ( credentials: SingInCredentials ): Promise<void>
  isAuthenticated: boolean
  user: User
}

type AuthProviderProps = {
  children: ReactNode
}

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

const AuthContext = createContext( {} as AuthContextData )

export function singOut () {
  destroyCookie( undefined, 'nextauth.token' )
  destroyCookie( undefined, 'nextauth.refreshToken' )

  Router.push( '/' )
}

export function AuthProvider ( { children }: AuthProviderProps ) {
  const [user, setUser] = useState<User>( {} as User )
  const isAuthenticated = !!user

  useEffect( () => {
    const { 'nextauth.token': token } = parseCookies()

    if ( token ) {
      api
        .get( '/me' ).then( ( { data } ) => {
          const { email, permissions, roles } = data

          setUser( { email, permissions, roles } )
        } )
        .catch( () => {
          singOut()
        } )
    }
  }, [] )

  async function singIn ( { email, password }: SingInCredentials ) {
    try {
      const { data } = await api.post( '/sessions', { email, password } )

      const { permissions, roles, token, refreshToken } = data

      setCookie( undefined, 'nextauth.token', token,
        {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        }
      )

      setCookie( undefined, 'nextauth.refreshToken', refreshToken,
        {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        }
      )

      setUser( {
        email,
        permissions,
        roles
      } )

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push( '/dashboard' )
    } catch ( error ) {
      console.log( error.message )
    }
  }

  return (
    <AuthContext.Provider value={{ singIn, isAuthenticated, user }} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext( AuthContext )
}