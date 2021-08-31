import { useAuth } from "../context/Auth.context"
import { validateUserPermissions } from "../utils/validatUserPermissions"

type UserCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan ( { permissions = [], roles = [] }: UserCanParams ) {
  const { user, isAuthenticated } = useAuth()

  if ( !isAuthenticated ) {
    return false
  }

  const useHasValidPermissions = validateUserPermissions( {
    user,
    permissions,
    roles
  } )

  return useHasValidPermissions

}