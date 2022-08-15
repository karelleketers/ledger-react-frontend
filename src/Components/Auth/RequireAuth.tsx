//To continue to the intended page the user needs to be authenticated. 
//If a non-authenticated user or user with expired token tries to access 
//the page, redirect to login page

import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../Hooks/UseAuth'

export const RequireAuth = ({children} : { children: JSX.Element }) => {
    //seperate authorised and onboarding from jwt token
    let { authorised, onboarding, isAdmin } = useAuth();
    let location = useLocation();
    //return to login page if not authorised
    if (isAdmin) return (
        <Navigate to="/admin" />
    )
    if(!authorised) return (
        <Navigate to="/login" state={{ from: location}} />
    )
    //checks state of onboarding process and takes you to appropriate location 
    if(onboarding === "initialised") return (
        <Navigate to="/onboarding" />
    )
    return children;
}
