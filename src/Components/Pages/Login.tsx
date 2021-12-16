import { useState, useEffect } from 'react'
import {LOGIN_USER_MUTATION} from '../../GraphQL/Mutations'
import {useMutation} from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface Props {
    
}

export const Login = (props: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginUser, {error, data}] = useMutation(LOGIN_USER_MUTATION);
    const navigate = useNavigate();

    const proceedLogin = (e: any) => {
        e.preventDefault()
        loginUser({
            variables: {
                email: email,
                password: password
            }
        });
    }

    if (error) {
        console.log(error)
    }

    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data.login.token);
            navigate('/account', { replace: true})
        }
    // eslint-disable-next-line
    }, [data]);

    return (
        <form>
            <input type="email"
            placeholder="email"
            onChange={(e) => {
                setEmail(e.target.value);
            }}
            />
            <input type="password"
            placeholder="password"
            onChange={(e) => {
                setPassword(e.target.value)
            }}
            />
            <button onClick={proceedLogin}>Login</button>
        </form>
    )
}
