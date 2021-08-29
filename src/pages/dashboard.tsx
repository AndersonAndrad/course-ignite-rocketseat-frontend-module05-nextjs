import { useAuth } from "../context/Auth.context"

export default function Dashboard () {
  const { user } = useAuth()

  return (
    <div>
      <h1>{user?.email}</h1>
    </div>
  )
}