import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../Hooks/UseAuth'

export const RequireOnboarding = ({children} : { children: JSX.Element }) => {
    let { authorised, onboarding } = useAuth();
    let location = useLocation();
    return (
        <>
        {!authorised && <Navigate to="/login" state={{ from: location}} />}
        {onboarding === "finished" && <Navigate to="/account" state={{ from: location}} />}
        {onboarding !== "finished" && children}
        </>
    )
}