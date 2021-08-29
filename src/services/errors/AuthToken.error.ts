export class AuthTokenError extends Error {
  constructor( message: string ) {
    super( message )
    this.name = 'AuthTokenError'
  }
}