//Authenticated user cannot go to landing/login/register page. Instead they will be redirected

import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../Hooks/UseAuth';

export const RedirectAuth = ({children} : { children: JSX.Element }) => {
    //retrieve authorised status
    let { authorised } = useAuth();
    let location = useLocation();
    //return to dashboard page if authorised
    if(authorised) return (
        <Navigate to="/account" state={{ from: location}} />
    )
    return children;
}
