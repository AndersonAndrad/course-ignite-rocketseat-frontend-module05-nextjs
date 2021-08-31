import { ReactNode } from "react"
import { useCan } from "../../hooks/useCan.hook"

interface CanProps {
  children: ReactNode
  permissions?: string[]
  roles?: string[]
}

export function Can ( { children, permissions, roles }: CanProps ) {
  const useCanSeeComponent = useCan( { permissions, roles } )

  if ( !useCanSeeComponent ) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}