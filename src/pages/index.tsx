import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { FormEvent, useState } from 'react'
import { useAuth } from '../context/Auth.context'
import styles from '../styles/Home.module.scss'

export default function Home () {
  const [email, setEmail] = useState( '' )
  const [password, setPassword] = useState( '' )

  const { singIn } = useAuth()

  async function handleSubmit ( event: FormEvent ) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    await singIn( data )
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.content}>
        <label>Email</label>
        <input type='email' value={email} onChange={event => setEmail( event.target.value )} />
        <label>Password</label>
        <input type='password' value={password} onChange={event => setPassword( event.target.value )} />
        <div>
          <button type='submit'>Login</button>
        </div>
      </div>

    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async ( context ) => {
  const cookies = parseCookies( context )

  if ( !cookies['nextauth.token'] ) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}