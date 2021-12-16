import { useEffect, useState } from 'react'
import {REGISTER_USER_MUTATION} from '../../GraphQL/Mutations'
import {useMutation} from '@apollo/client';
import { useNavigate } from 'react-router';

interface Register {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

export const RegisterPage = () => {

    const [register, setRegister] = useState<Register>({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });

    const [registerUser, {error, data}] = useMutation(REGISTER_USER_MUTATION);
    const navigate = useNavigate();

    const addUser = (e: any) => {
        e.preventDefault();
        registerUser({
            variables: {
                email: register.email,
                password: register.password,
                firstName: register.firstName,
                lastName: register.lastName,
            }
        })
    }

    if (error) {
        console.log(error)
    }

    useEffect(() => {
        if (data) {
            navigate('/login', { replace: true })
        }
    }, [data])

    return (
        <>
            <form>
                <input type="email"
                placeholder="email"
                onChange={(e) => {
                    setRegister({...register, email: e.target.value});
                }}
                />
                <input type="password"
                placeholder="password"
                onChange={(e) => {
                    setRegister({...register, password: e.target.value});
                }}
                />
                <input type="text"
                placeholder="Fill in First Name"
                onChange={(e) => {
                    setRegister({...register, firstName: e.target.value});
                }}
                />
                <input type="text"
                placeholder="Fill in Last Name"
                onChange={(e) => {
                    setRegister({...register, lastName: e.target.value});
                }}
                />
                <button onClick={addUser}>Create User</button>
            </form>
        </>
    )
}
