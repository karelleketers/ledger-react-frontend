import { Formik, Form, Field } from 'formik'
import * as yup from 'yup';
import { TextFieldError, Button } from './../Components';

import {REGISTER_USER_MUTATION} from './../../GraphQL/Mutations'
import {useMutation} from '@apollo/client';
import { useNavigate } from 'react-router';
import logo from './../../assets/images/ledger-ltwds.png';
import signup from './../../assets/images/sign-up.png';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useEffect } from 'react';

interface Register {
    email: string,
    password: string,
    firstName: string,
    lastName: string
    passwordCheck: string,
}

const validationSchema = yup.object({
    firstName: yup.string().required().min(2),
    lastName: yup.string().required().min(2),
    email: yup.string().email().required().max(64),
    password: yup.string().required().min(8),
    passwordCheck: yup.string().oneOf([yup.ref('password'), null], "passwords must match").required(),
  })

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [registerUser, {error, data}] = useMutation(REGISTER_USER_MUTATION);

    if (error) {console.log(error)};

    const capitalize = (word: string) => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }

    const addUser = (values: Register) => {
        registerUser({
            variables: {
                email: values.email,
                password: values.password,
                firstName: capitalize(values.firstName),
                lastName: capitalize(values.lastName),
            }
        })
    }

    useEffect(() => {
        if (data) {
            navigate('/login', { replace: true})
        }
    // eslint-disable-next-line
    }, [data]);
    
    return (
        <div className="xl:flex xl:flex-wrap w-full">
            <div className="w-full xl:w-33 xl:h-full relative">
                <div className='w-full xl:w-33 xl:fixed flex flex-wrap content-between xl:h-screen xl:top-0 xl:left-0'>
                    <div className="xl:w-full mt-8 xl:mx-8 mx-auto">
                            <Link to="/">
                                <img src={logo} alt="logo" className='w-40'/>
                            </Link>
                    </div>
                    <div className="mt-8 mx-auto xl:my-0 xl:mx-8">
                        <img src={signup} alt="signup" className="w-72 xl:w-full"/>
                    </div>  
                </div>
            </div>
            <div className="bg-dark flex-1 pb-24 xl:pb-0">
                <div className="h-25vh flex flex-wrap items-start pt-10 mx-12">
                    <div className="flex flex-wrap items-center">
                        <NavLink to="/login" className="pr-6 text-2xl border-2 border-transparent border-r-ltgreen hover:text-ltgreen duration-300">
                            Sign In
                        </NavLink>
                        <NavLink to="/register" className="pl-6 opacity-20 text-lg ">
                            Sign Up
                        </NavLink>
                    </div>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        passwordCheck: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addUser(values);
                        resetForm({})
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="text-ltgreen mx-12 mt-24">
                            <section>
                                <div className='mb-16'>
                                    <Field name="firstName" type="text" label="First name" format="styled" as={TextFieldError}/>
                                </div>
                                <div className=''>
                                    <Field name="lastName" type="text" label="Last name" format="styled" as={TextFieldError}/>
                                </div>
                            </section>
                                <div className='my-16'>
                                    <Field name="email" type="email" label="email" format="styled" as={TextFieldError}/>
                                </div>
                                <div className='my-16'>
                                    <Field name="password" type="text" label="Password" format="styled" as={TextFieldError}/>
                                </div>
                                <div className='my-16'>
                                    <Field name="passwordCheck" type="text" label="Password confirmation"format="styled"  as={TextFieldError}/>
                                </div>
                                <div className="mb-16 inline-block px-4 py-2 rounded-full text-mdgreen bg-light font-nunitoblack hover:bg-opacity-70 transition-300">
                                    <Button disabled={isSubmitting} type="submit" content="Register"/>
                                </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
