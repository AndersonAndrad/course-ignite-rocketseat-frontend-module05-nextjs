import decode from "jwt-decode"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import { destroyAllAuthCookies } from "../context/Auth.context"
import { AuthTokenError } from "../services/errors/AuthToken.error"
import { validateUserPermissions } from "./validatUserPermissions"

type WithSSRAuthOptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<P> ( fn: GetServerSideProps<P>, options?: WithSSRAuthOptions ) {
  return async ( context: GetServerSidePropsContext ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies( context )
    const token = cookies['nextauth.token']

    if ( !token ) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    if ( options ) {
      const user = decode<{ permissions: string[], roles: string[] }>( token )
      const { permissions, roles } = options


      const useHasValidPermissions = validateUserPermissions( {
        user,
        permissions,
        roles
      } )

      if ( !useHasValidPermissions ) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }

    }

    try {
      return await fn( context )
    } catch ( error ) {
      if ( error instanceof AuthTokenError ) {
        destroyAllAuthCookies( context )

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }

  }
}