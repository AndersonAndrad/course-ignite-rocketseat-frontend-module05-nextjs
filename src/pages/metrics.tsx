import { GetServerSidePropsContext } from "next"
import { useAuth } from "../context/Auth.context"
import { setupAPIClient } from "../services/api.services"
import { withSSRAuth } from "../utils/withSSRAuth.utils"

export default function Metrics () {
  const { user } = useAuth()

  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth( async ( context: GetServerSidePropsContext ) => {
  const apiClient = setupAPIClient( context )
  const response = await apiClient.get( '/me' )


  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
} )