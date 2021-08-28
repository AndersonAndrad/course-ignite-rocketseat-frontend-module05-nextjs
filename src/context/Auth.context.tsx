import { createContext, ReactNode, useContext } from "react"
import { api } from "../services/api.services"

type SingInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  singIn ( credentials: SingInCredentials ): Promise<void>
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext( {} as AuthContextData )

export function AuthProvider ( { children }: AuthProviderProps ) {
  const isAuthenticated = false

  async function singIn ( { email, password }: SingInCredentials ) {
    try {
      const response = await api.post( '/sessions', { email, password } )

      return response.data
    } catch ( error ) {
      console.log( error.message )
    }
  }

  return (
    <AuthContext.Provider value={{ singIn, isAuthenticated }} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext( AuthContext )
}