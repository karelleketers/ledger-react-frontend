import { Formik, Form, Field } from 'formik';
import { TextFieldError, Button } from './../../Components';
import * as yup from 'yup';

import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import { LOAD_PROFILE } from '../../../GraphQL/Queries'
import { SET_PROFILE, REMOVE_USER } from '../../../GraphQL/Mutations';
import { useAuth } from '../../Hooks';
import { Link, useNavigate } from 'react-router-dom';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import logo from './../../../assets/images/leder-grnwds.png';
import { Context } from '../../../App';

interface Profile {
    id?: null | number,
    firstName: string | null
    lastName: string | null,
    bank: string | null,
    reminder: boolean | null
}

const validationSchema = yup.object({
    firstName: yup.string().max(32).required('Input is required'),
    lastName: yup.string().max(32).required('Input is required'),
    bank: yup.string().max(48).required('Input is required'),
})

export const ProfilePage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const client = useApolloClient();
    const {navHovered} = useContext(Context)
    
    const {loading, data: queryProfileData} = useQuery(LOAD_PROFILE);

    const [updateNewProfile] = useMutation(SET_PROFILE, {
        update(cache, {data: {adjustProfile} }) {
            cache.modify({
                fields: {
                    updateOwnProfile(existingProfile = []) {
                        const createdProfileRef = cache.writeFragment({
                            data: adjustProfile,
                            fragment: gql`
                                fragment createdProfile on Profile {
                                    id,
                                    firstName,
                                    lastName,
                                    bank,
                                    reminder
                                }
                            `
                        });
                        return [...existingProfile, createdProfileRef];
                    }
                }
            });
        }
    });
    const [removeUserMut, {data: deletedData}] = useMutation(REMOVE_USER, 
        {
            onCompleted: async () => {
                await client.refetchQueries({include: "all"})
            }
        });
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [reminderOpen, setReminderOpen] = useState(false);

    const updateProfile = (values: Profile) => {
        updateNewProfile({
            variables: {
                firstName: values.firstName,
                lastName: values.lastName,
                bank: values.bank,
                reminder: values.reminder,
            }
        });
    }

    const handleRemoveUser = (deleteAcc: string) => {
        deleteAcc === "true" && removeUserMut()
    }

    useEffect(() => {
        auth.onboarding !== "finished" && setReminderOpen(true);
    }, []);

    useEffect(() => {
        if (deletedData) {
            localStorage.clear();
            client.clearStore();
            navigate('/login');
        }
    // eslint-disable-next-line 
    }, [deletedData])

    return (
        <div className={`w-full xl:w-main xl:ml-main-ext relative mx-4 md:mx-8 pb-24 xl:pb-0 ${reminderOpen ? "xl:mb-8" : "xl:my-8"} ${navHovered && "xl:opacity-20"} ease-in-out duration-300`}>
        {loading && <div>...Loading</div>}
        {queryProfileData &&
            <>
            {/* Show link to onboarding in case still not filled in  */}
            { reminderOpen && 
                <div className='bg-light rounded-b-3xl relative flex items-center justify-center flex-wrap mb-8'>
                    <p className='py-4 text-lg font-nunitoblack text-dkgreen'>Please fill in the questionnaire if you haven't yet.</p>
                    <div className="mx-6 py-4 font-nunitoblack">
                        <Link to="/onboarding" className='mx-auto inline-block px-4 py-2 rounded-full text-ltgreen bg-dkgreen hover:bg-opacity-70 transition-300'>
                            Yes, take me there!
                        </Link>
                    </div>
                    <button className="absolute top-4 right-4" onClick={() => {setReminderOpen(false)}}>
                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                    </button>
                </div>
            }
            <div className='xl:hidden max-w-48 w-2/5 m-auto mt-8 mb-16'>
                <img src={logo} alt="logo" className='w-full'/>
            </div>
            <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Profile</h4>

            {/* Shows profile data with option to change data */}

                <Formik
                    enableReinitialize
                    initialValues={{
                        firstName: queryProfileData.getOwnProfile.firstName,
                        lastName: queryProfileData.getOwnProfile.lastName,
                        bank: queryProfileData.getOwnProfile.bank || "",
                        reminder: queryProfileData.getOwnProfile.reminder
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        updateProfile(values);
                        resetForm({})
                        setSubmitting(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form className='my-8 flex h-64 flex-col justify-between'>
                            <Field name="firstName" type="text" label="First Name" placeholder={values.firstName} as={TextFieldError}/>
                            <Field name="lastName" type="text" label="Last Name" placeholder={values.lastName} as={TextFieldError}/>
                            <Field name="bank" type="text" label="Bank" placeholder={values.bank} as={TextFieldError}/>
                            <label>
                                <span className='mr-4'>Show Bill reminders</span>
                                <Field type="checkbox" name="reminder" />
                            </label>
                            <div className='w-20 flex justify-center px-3 py-1 rounded-full bg-light text-dkgreen xl:text-light xl:bg-dkgreen font-nunitoblack hover:bg-opacity-70 duration-300'>
                                <Button disabled={isSubmitting} type="submit" content="Save"/>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* Delete profile */}

                <div>
                    <button className="px-4 py-2 rounded-full text-light bg-dark font-nunitoblack hover:bg-opacity-70 duration-300" onClick={(e) => {e.preventDefault(); setOpenConfirmation(!openConfirmation)}}>Delete my profile</button>
                {openConfirmation && 
                    <Formik
                    enableReinitialize
                    initialValues={{
                        delete: ""
                    }}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        handleRemoveUser(values.delete)
                        resetForm({})
                        setSubmitting(false);
                    }}
                    >
                    {({ isSubmitting }) => (
                        <Form>
                            <div id="delete-group" className='my-2 text-dkgreen font-nunitobold'>Are you sure you want to remove your profile?<span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This is action is permanent</span></div>
                            <div role="group" aria-labelledby='delete-group' className='my-4'>
                                <label className='mx-2'>
                                    <Field name="delete" type="radio" value="false"/>
                                    <span className='mx-2'>No</span>
                                </label>
                                <label className='mx-2'>
                                    <Field name="delete" type="radio" value="true"/>
                                    <span className='mx-2'>Yes</span>
                                </label>
                            </div>
                            <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                <Button disabled={isSubmitting} type="submit" content="Confirm"/>
                            </div>
                        </Form>
                    )}
                    </Formik>
                }
                </div>
            </>}
        </div>
    )
}