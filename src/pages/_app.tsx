import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/Auth.context'
import '../styles/globals.css'

function MyApp ( { Component, pageProps }: AppProps ) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
export default MyApp