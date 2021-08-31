import { GetServerSidePropsContext } from "next"
import { Can } from '../components/Can'
import { useAuth } from "../context/Auth.context"
import { setupAPIClient } from "../services/api.services"
import { withSSRAuth } from "../utils/withSSRAuth.utils"

export default function Dashboard () {
  const { user, singOut } = useAuth()

  return (
    <>
      <h1>{user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <>
          metrics
        </>
      </Can>

      <button onClick={singOut}>Sing out</button>
    </>
  )
}

export const getServerSideProps = withSSRAuth( async ( context: GetServerSidePropsContext ) => {
  const apiClient = setupAPIClient( context )
  const response = await apiClient.get( '/me' )

  return {
    props: {}
  }
} )