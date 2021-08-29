import { GetServerSidePropsContext } from "next"
import { useAuth } from "../context/Auth.context"
import { setupAPIClient } from "../services/api.services"
import { withSSRAuth } from "../utils/withSSRAuth.utils"

export default function Dashboard () {
  const { user } = useAuth()

  return (
    <div>
      <h1>{user?.email}</h1>
    </div>
  )
}

export const getServerSideProps = withSSRAuth( ( context: GetServerSidePropsContext ) => {
  const apiClient = setupAPIClient( context )


  return {
    props: {}
  }
} )