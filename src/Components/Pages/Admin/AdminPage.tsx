import { Formik, Form, Field } from 'formik';
import { TextFieldError, Button } from './../../Components';
import * as yup from 'yup';

import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_USER_DATA } from "../../../GraphQL/Mutations";
import { GET_USER, LOAD_DASHBOARD } from "../../../GraphQL/Queries";
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';

interface UserData {
    id: number,
    email: string,
    profile: {
        id: number,
        firstName: string,
        lastName: string,
        bank: string,
    }
}

interface AdjustedUserData {
    id: number,
    profileId: number,
    bank: string;
}

const validationEdit = yup.object({
    bank: yup.string().max(48).required('Input is required'),
})

const validationSearch = yup.object({
    user: yup.string().email('must be a valid email').max(48).required('Input is required'),
})

export const AdminPage = () => {
    const [name, setName] = useState("");
    const [searching, setSearching] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        id: 0,
        email: "",
        profile: {
        id: 0,
        firstName: "",
        lastName: "",
        bank: "",
    }
    });
    const [getUserData, {loading: userLoading, data: queryData}] = useLazyQuery(GET_USER);
    const [editUserData] = useMutation(EDIT_USER_DATA, {
        update(cache, {data: {adjustUserData} }) {
            cache.modify({
                fields: {
                    updateUserDetails(existingUserData = []) {
                        const createdUserDataRef = cache.writeFragment({
                            data: adjustUserData,
                            fragment: gql`
                                fragment createdUserData on UserData {
                                    id,
                                    bank,
                                }
                            `
                        });
                        return [...existingUserData, createdUserDataRef];
                    }
                }
            });
        }
    });
    const {loading: dashboardLoad, data: dashboardData} = useQuery(LOAD_DASHBOARD);
    useEffect(() => {
        if (queryData) {setUserData({...queryData.getUser})}
    }, [queryData])

    useEffect(() => {
        if (dashboardData) {
            setName(dashboardData.getOwnProfile.firstName);
        }
    // eslint-disable-next-line
    }, [dashboardData]);

    const handleGetUser = (email: string) => {
        getUserData({
            variables: {
                email: email
            }
        })
    }

    const mutUserData = (values: AdjustedUserData) => {
        editUserData({
            variables: {
                id: values.id,
                profileId: values.profileId,
                bank: values.bank, 
            }
        });
    }

    return (
        <div className='w-full h-80vh flex flex-wrap'>
        {dashboardLoad && <div>...Loading</div>}
        <div className='w-2/5 px-8'>
            <h1 className="font-nunitomedium text-light text-3xl">Welcome back, <span className='text-dkgreen text-4xl'>{name}</span></h1>
        </div>
        <Formik
            enableReinitialize
            initialValues={{
                user: ""
            }}
            validationSchema={validationSearch}
            onSubmit={(values, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                handleGetUser(values.user);
                setSearching(true);
                resetForm({})
                setSubmitting(false);
            }}
            >
            {({ isSubmitting }) => (
                <Form className='px-8'>
                    <h3 className="font-leaguespartan text-3xl text-dark mt-2 mb-8">Look up details below</h3>
                    <div className='text-xl font-nunitobold'>
                        <div className='my-8'>
                            <Field name="user" type="email" label="Search for a user " placeholder="fill in email-address" as={TextFieldError}/>
                        </div>
                        <div className='inline px-4 py-2 rounded-full text-light bg-dkgreen font-nunitoblack hover:bg-opacity-70 transition-300'>
                            <Button disabled={isSubmitting} type="submit" content="Search"/>
                        </div>
                    </div>
                </Form>
            )}
            </Formik>
        {userLoading && <div>...Loading</div>}
        {queryData && searching && <div className="relative flex-1 mx-6 px-6 bg-light text-dkgreen font-nunitomedium rounded-2xl">
            <div className='mb-8'>
                <p className='font-leaguespartan text-lg my-6 text-dark'>User</p>
                <p className=''>Email: <span className='font-nunitoblack ml-4'>{userData.email}</span></p>
                <p>Name: <span className='font-nunitoblack ml-4'>{userData.profile.firstName} {(userData.profile.lastName).charAt(0)}.</span></p>
                {!editOpen && <p>Bank: <span className='font-nunitoblack ml-4'>{userData.profile.bank}</span></p>}
                {editOpen &&
                <Formik
                enableReinitialize
                initialValues={{
                    id: userData.id,
                    profileId: userData.profile.id,
                    bank: userData.profile.bank
                }}
                validationSchema = {validationEdit}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    setSubmitting(true);
                    mutUserData(values);
                    resetForm({})
                    setSubmitting(false);
                }}
                >
                {({ isSubmitting }) => (
                    <Form>
                        <Field name="bank" type="text" label="Bank:" placeholder="fill in adjustment" as={TextFieldError}/>
                        <div className='pt-8 flex flex-wrap items-center'>
                            <div className='w-1/5 xl:w-18 inline px-4 py-2 rounded-full text-light bg-mdgreen font-nunitoblack hover:bg-opacity-70 transition-300'>
                                <Button disabled={isSubmitting} type="submit" content="Save"/>
                            </div>
                            <button className='ml-4 w-20 inline px-4 py-2 rounded-full text-light bg-dkgreen font-nunitoblack hover:bg-opacity-70 transition-300' onClick={() => setEditOpen(false)}>
                                Close
                            </button>
                        </div>
                    </Form>
                )}
                </Formik>}
            </div>
            {!editOpen && <div className='inline px-4 py-2 rounded-full text-light bg-dark font-nunitoblack hover:bg-opacity-70 transition-300'>
                <button onClick={() => setEditOpen(!editOpen)}>Change</button>
            </div>}
            <button className="absolute top-4 right-4" onClick={() => {setSearching(false)}}>
                <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
            </button>
            
        </div>}
        </div>
    )
}
