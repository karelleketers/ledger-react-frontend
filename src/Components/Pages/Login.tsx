import { useEffect } from "react";
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup';
import { TextFieldError, Button } from '../Components';
import {LOGIN_USER_MUTATION} from '../../GraphQL/Mutations'
import {useMutation} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/images/ledger-ltwds.png';
import signup from './../../assets/images/sign-up.png';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";

interface Login {
    email: string,
    password: string,
}

const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })

export const LoginPage = () => {
    let navigate = useNavigate();
    const [loginUser, {error, data}] = useMutation(LOGIN_USER_MUTATION);

    const proceedLogin = (values: Login) => {
        loginUser({
            variables: {
                email: values.email,
                password: values.password
            }
        });
    }
    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data.login.token);
            navigate('/account', { replace: true})
        }
    // eslint-disable-next-line
    }, [data]);

    return (
        <>
        <div className="xl:flex xl:flex-wrap w-full">
            <div className="w-full xl:w-1/3 xl:h-full flex flex-wrap content-between">
                <div className="xl:w-full mt-8 xl:mx-8 mx-auto">
                        <Link to="/">
                            <img src={logo} alt="logo" className='w-40'/>
                        </Link>
                </div>
                <div className="mt-8 mx-auto xl:my-0 xl:mx-8">
                    <img src={signup} alt="signup" className="w-72 xl:w-full"/>
                </div>  
            </div>
            <div className="bg-dark flex-1 pb-24 xl:pb-0">
                <div className="h-25vh flex flex-wrap items-start pt-10 mx-12">
                    <div className="flex flex-wrap items-center">
                        <NavLink to="/login" className="pr-6 opacity-20 text-lg">
                            Sign In
                        </NavLink>
                        <NavLink to="/register" className="pl-6 text-2xl border-2 border-transparent border-l-ltgreen hover:text-ltgreen duration-300">
                            Sign Up
                        </NavLink>
                    </div>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        proceedLogin(values);
                        resetForm({})
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="text-ltgreen mx-12 mt-24">
                            <Field name="email" type="email" label="Email" format="styled" as={TextFieldError}/>
                            <Field name="password" type="password" label="Password" format="styled" as={TextFieldError}/>
                            <div className="mt-8 inline-block px-4 py-2 rounded-full text-mdgreen bg-light font-nunitoblack hover:bg-opacity-70 transition-300">
                                <Button disabled={isSubmitting} type="submit" content="Log In"/>
                            </div>
                        </Form>
                    )}
                </Formik>
            {error && <p className="font-nunitomedium 2xl mx-12 my-2 text-transaction-red">Either your email or password were incorrect. Try again.</p>}
            </div>
        </div>
        </>
        
    )
}
