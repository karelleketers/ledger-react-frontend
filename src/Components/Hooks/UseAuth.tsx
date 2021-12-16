import jwt_decode from 'jwt-decode';

export const useAuth = () => {
    let token: string | null = localStorage.getItem('token');
        if (!token) {return {authorised: false, isAdmin: false}}
        const { exp, isAdmin, onboarding } : any = token && jwt_decode(token)
        const expirationTime = (exp * 1000) - 60000
        if (Date.now() >= expirationTime) {
          localStorage.clear();
          return {authorised: false, isAdmin: false, onboarding: ""}
        };
        return {authorised: true, isAdmin: isAdmin, onboarding: onboarding};
}
