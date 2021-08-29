import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import { destroyAllAuthCookies } from "../context/Auth.context"
import { AuthTokenError } from "../services/errors/AuthToken.error"

export function withSSRAuth<P> ( fn: GetServerSideProps<P> ) {
  return async ( context: GetServerSidePropsContext ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies( context )

    if ( !cookies['nextauth.token'] ) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
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