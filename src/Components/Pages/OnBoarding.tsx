import { Formik, Form, Field } from 'formik';
import { TextFieldError, Button } from './../Components';
import * as yup from 'yup';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as Routes from './../../routes';

import { useApolloClient, useMutation } from "@apollo/client";
import { LOAD_REFRESHTOKEN, SET_QUESTIONNAIRE, SKIP_QUESTIONNAIRE } from "../../GraphQL/Mutations";

import picOne from './../../assets/images/onboarding-1.png';
import ageOne from './../../assets/images/age-1.png';
import ageTwo from './../../assets/images/age-2.png';
import ageThree from './../../assets/images/age-3.png';
import ageFour from './../../assets/images/age-4.png';
import budgeting from './../../assets/images/budget.png';
import saving from './../../assets/images/saving.png';
import investing from './../../assets/images/invest.png';
import profiting from './../../assets/images/profits.png';
import decision from './../../assets/images/decide.png';


interface Questionnaire {
    id?: null | number,
    ageGroup: string | null ,
    improve: string | null, 
    savedLastMonth: string | null,
    goal: string | null,
    savings: number,
    balance: number
}

const validationSchema = yup.object({
    balance: yup.number().min(1).max(100000000).required('Input is required'),
    savings: yup.number().min(1).max(100000000).required('Input is required'),
})

export const OnBoarding = () => {
    const navigate = useNavigate();
    const client = useApolloClient();

    const [addQuestionnaire, {data: onBoardingData}] = useMutation(SET_QUESTIONNAIRE);
    const [skipQuestionnaire, {data: questionnaireSkipped}] = useMutation(SKIP_QUESTIONNAIRE);
    const [getRefreshToken, {data: refreshToken}] = useMutation(LOAD_REFRESHTOKEN, {
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [skipped, setSkipped] = useState(false);
    const [question, setQuestion] = useState(0);

    const addNewQuestionnaire = (values: Questionnaire) => {
        addQuestionnaire({
            variables: {
                ageGroup: values.ageGroup && parseInt(values.ageGroup),
                improve: values.improve,
                savedLastMonth: values.savedLastMonth === "true",
                goal: values.goal === "true",
                savings: values.savings * 100,
                balance: values.balance * 100,
            }
        });
    }

    useEffect(() => {
        if (onBoardingData || questionnaireSkipped) {
            getRefreshToken();
        }
    // eslint-disable-next-line 
    }, [onBoardingData, questionnaireSkipped])

    useEffect(() => {
        if(refreshToken) {
            localStorage.setItem('token', refreshToken.refreshToken.token);
            navigate(Routes.ACCOUNT, { replace: true})
        }
    // eslint-disable-next-line 
    }, [refreshToken])

    useEffect(() => {
        if(skipped) {
            skipQuestionnaire()
        }
    // eslint-disable-next-line 
    }, [skipped])

    return (
        <>
            {question === 0 && 
            <>
            <div className="w-full md:w-1/2 md:min-h-screen flex flex-wrap">
                <div className='flex flex-wrap w-3/4 m-auto'>
                    <h2 className='m-auto my-12 text-5xl md:text-6xl font-nunitoblack text-center'>Welcome!</h2>
                    <p className='m-auto w-full text-center font-nunitoreg my-3'>Before exploring Ledger, we'd like to get to know you a bit better</p>
                    <p className='m-auto w-full text-center font-nunitoreg my-3'>Don't worry, you can skip the questions and come back to it later</p>
                    <div className='m-auto w-full my-12 flex flex-wrap justify-center'>
                        <div className='mr-6 my-2 inline-block px-4 py-2 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                            <button className='font-nunitoblack' onClick={() => {setSkipped(true)}}>Skip</button>
                        </div>
                        <div className='my-2 inline-block px-4 py-2 rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                            <button className='' onClick={() => {setQuestion(question => question + 1)}}>Proceed</button>
                        </div>        
                    </div>
                </div> 
            </div>
            <div className='w-full md:flex-1 flex items-end'>
                <img src={picOne} alt="signup" className='w-90 m-auto md:m-0'/>
            </div>
            </> }
            <Formik
            enableReinitialize
            initialValues={{
                ageGroup: null,
                improve: null,
                savedLastMonth: null,
                goal: null,
                savings: 0,
                balance: 0,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                addNewQuestionnaire(values)
                resetForm({})
                setSubmitting(false);
            }}
        >
            {({ values, isSubmitting }) => (
                <Form className='m-auto'>
                    {question === 1 && <div className='flex flex-wrap'>
                    <div id="age-group" className='w-full text-center my-8 font-nunitobold text-3xl text-dark'>What's your age-group?</div>
                    <div className="w-full" role="group" aria-labelledby='age-group'>
                        <div className='w-full my-12 flex flex-wrap justify-evenly'>
                            <label className='w-1/3 flex'>
                                <div className='m-auto'>
                                    <Field name="ageGroup" type="radio" value="1"/>
                                    <span className='mx-2'>18-25</span>
                                    <img className="my-4" src={ageOne} alt="age 18-25"/>
                                </div>
                            </label>
                            <label className='w-1/3 flex'>
                                <div className='m-auto'>
                                    <Field name="ageGroup" type="radio" value="2"/>
                                    <span className='mx-2'>26-40</span>
                                    <img className="my-4" src={ageTwo} alt="age 26-40"/>
                                </div>
                            </label>
                        </div>
                        <div className='w-full my-12 flex flex-wrap justify-evenly'>
                            <label className='w-1/3 flex'>
                                <div className='m-auto'>
                                    <Field name="ageGroup" type="radio" value="3"/>
                                    <span className='mx-2'>41-64</span>
                                    <img className="my-4" src={ageThree} alt="age 41-64"/>
                                </div>
                            </label>
                            <label className='w-1/3 flex'>
                                <div className='m-auto'>
                                    <Field name="ageGroup" type="radio" value="4"/>
                                    <span className='mx-2'>65+</span>
                                    <img className="my-4" src={ageFour} alt="age 65+"/>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='mb-6 mx-auto inline-block px-4 py-2 rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                        <button className="m-auto" onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>Next</button>
                    </div>     
                    </div>}
                    {question === 2 && <div className='flex flex-wrap'>
                    <div id="improve-group" className='w-full text-center my-8 font-nunitobold text-3xl text-dark'>What would you like to improve?</div>
                    <div className="w-full" role="group" aria-labelledby='improve-group'>
                        <div className='w-full my-12 flex flex-wrap justify-evenly'>
                            <label className='w-1/3 flex'>
                                <div className='m-auto text-center text-dkgreen'>
                                    <Field name="improve" type="radio" value="budgeting"/>
                                    <span className='mx-2'>Budgeting</span>
                                    <img className="my-4 w-40" src={budgeting} alt="budgeting"/>
                                </div>
                            </label>
                            <label className='w-1/3 flex'>
                                <div className='m-auto text-center text-dkgreen'>
                                    <Field name="improve" type="radio" value="saving"/>
                                    <span className='mx-2'>Saving</span>
                                    <img className="my-4 w-40" src={saving} alt="saving"/>
                                </div>
                            </label>
                        </div>
                        <div className='w-full my-12 flex flex-wrap justify-evenly'>
                            <label className='w-1/3 flex'>
                                <div className='m-auto text-center text-dkgreen'>
                                    <Field name="improve" type="radio" value="investing"/>
                                    <span className='mx-2'>Investing</span>
                                    <img className="my-4 w-40" src={investing} alt="investing"/>
                                </div>
                            </label>
                            <label className='w-1/3 flex'>
                                <div className='m-auto text-center text-dkgreen'>
                                    <Field name="improve" type="radio" value="profiting"/>
                                    <span className='mx-2'>Profiting</span>
                                    <img className="my-4 w-40" src={profiting} alt="profiting"/>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='mb-6 mx-auto inline-block px-4 py-2 rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                        <button className="m-auto" onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>Next</button>
                    </div>   
                    </div>}
                    {question === 3 && <div className='flex flex-wrap'>
                    <div id="save-group" className='w-full text-center my-8 font-nunitobold text-3xl text-dark'>Did you save last month?</div>
                    <div className="w-full flex flex-wrap items-center m-auto justify-evenly my-8" role="group" aria-labelledby='save-group'>
                        <label className='w-1/4 flex'>
                            <div className='m-auto'>
                                <Field name="savedLastMonth" type="radio" value="true"/>
                                <span className='mx-2 text-2xl'>Yes</span>
                            </div>
                        </label>
                        <div className='w-1/3'>
                            <img className="w-full mx-6" src={decision} alt="decide" />
                        </div>
                        <label className='w-1/4 flex'>
                            <div className='m-auto'>
                                <Field name="savedLastMonth" type="radio" value="false"/>
                                <span className='mx-2 text-2xl'>No</span>
                            </div>
                        </label>
                    </div>
                    <div className='mb-6 mx-auto inline-block px-4 py-2 rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                        <button className="m-auto" onClick={(e) => {e.preventDefault(); setQuestion(question => question + (values.savedLastMonth === "false" ? 2 : 1))}}>Next</button>
                    </div>   
                    </div>}
                    {question === 4 && <div className='flex flex-wrap'>
                    <div id="goal-group" className='w-full text-center my-8 font-nunitobold text-3xl text-dark'>Did you save enough last month?</div>
                    <div className="w-full flex flex-wrap items-center m-auto justify-evenly my-8" role="group" aria-labelledby='goal-group'>
                        <label className='w-1/4 flex'>
                            <div className='m-auto'>
                                <Field name="goal" type="radio" value="true"/>
                                <span className='mx-2 text-2xl'>Yes</span>
                            </div>
                        </label>
                        <div className='w-1/3'>
                            <img className="w-full mx-6" src={decision} alt="decide" />
                        </div>
                        <label className='w-1/4 flex'>
                            <div className='m-auto'>
                                <Field name="goal" type="radio" value="false"/>
                                <span className='mx-2 text-2xl'>No</span>
                            </div>
                        </label>
                    </div>
                    <div className='mb-6 mx-auto inline-block px-4 py-2 rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                        <button className="m-auto" onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>Next</button>
                    </div>  
                    </div>}
                    {question === 5 && <div className='font-nunitobold text-2xl text-dark flex flex-wrap'>
                        <div className='w-full'>
                            <Field name="balance" type="text" label="How much money is currently in your balance? " as={TextFieldError}/>
                        </div>
                        <div className='m-auto my-8 inline-block px-4 py-2 text-lg rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                            <button className="m-auto" onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>Next</button>
                        </div>  
                    </div>}
                    {question === 6 && <div className='font-nunitobold text-2xl text-dark flex flex-wrap'>
                        <div className='w-full'>
                            <Field name="savings" type="text" label="How much money is currently in your savings? " as={TextFieldError}/>
                        </div>
                        <div className='m-auto my-8 inline-block px-4 py-2 text-lg rounded-full text-dark bg-light font-nunitoblack hover:bg-opacity-70 transition-300'>
                            <Button disabled={isSubmitting} type="submit" content="Finish"/>
                        </div>  
                    </div>}
                </Form>
            )}
            </Formik>
        </>
    )
}
