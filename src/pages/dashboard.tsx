import { GetServerSidePropsContext } from "next"
import { Can } from '../components/Can'
import { useAuth } from "../context/Auth.context"
import { setupAPIClient } from "../services/api.services"
import { withSSRAuth } from "../utils/withSSRAuth.utils"

export default function Dashboard () {
  const { user } = useAuth()

  return (
    <div>
      <h1>{user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>
          metrics
        </div>
      </Can>
    </div>
  )
}

export const getServerSideProps = withSSRAuth( async ( context: GetServerSidePropsContext ) => {
  const apiClient = setupAPIClient( context )
  const response = await apiClient.get( '/me' )

  return {
    props: {}
  }
} )