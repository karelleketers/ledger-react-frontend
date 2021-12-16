//To continue to the intended page an admin role is required. If no such role is present, redirect to 404 page

import { Navigate } from 'react-router'
import { useAuth } from '../Hooks/UseAuth'

export const RequireAdmin = ({children} : { children: JSX.Element }) => {
    let { isAdmin } = useAuth()
    if(!isAdmin) return (
        <Navigate to="/404"/>
    )
    return children;
}
