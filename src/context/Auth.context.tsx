import Router from 'next/router'
import { createContext, ReactNode, useContext, useState } from "react"
import { api } from "../services/api.services"

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

export function AuthProvider ( { children }: AuthProviderProps ) {
  const [user, setUser] = useState<User>( {} as User )
  const isAuthenticated = !!user

  async function singIn ( { email, password }: SingInCredentials ) {
    try {
      const { data } = await api.post( '/sessions', { email, password } )

      const { permissions, roles } = data

      setUser( {
        email,
        permissions,
        roles
      } )

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