import { Formik, Form, Field } from 'formik';
import { TextFieldError, SelectField, Button, Header, SideBar } from './../../Components';
import * as yup from 'yup';

import {useContext, useEffect, useState} from 'react';
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { LOAD_SAVINGSBALANCE, LOAD_SAVINGS } from '../../../GraphQL/Queries';
import { SET_SAVINGS, SET_MONTHLY_SAVINGS, DELETE_SAVINGS, EDIT_SAVINGS, ADJUST_SAVINGS_BALANCE, ASSIGN_SAVINGS} from '../../../GraphQL/Mutations';
import {ReactComponent as AddIcon} from './../../../assets/images/add.svg';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import logo from './../../../assets/images/leder-grnwds.png';
import { Context } from '../../../App';

interface Savings {
    count: number, 
    items: {
        id: number,
        name: string,
        saved: number, 
        goal: number,
        goal_date: string,
        amount: number,
        type: string
    }
}

interface SavingsOut {
    id?: number,
    amount: number,
    name?: string,
    goal: number,
    goal_date: string,
    type: {value: string, label: string}
}

/* const validationSchemaGoals = yup.object({
    name: yup.string().max(32).required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
    goal: yup.number().max(100000000).required('Input is required'),
});

const validationSchemaSavings = yup.object({
    amount: yup.number().max(100000000).required('Input is required'),
    incoming: yup.string().max(100000000).required("An option is required")
});

const validationSchemaMonthlySavings = yup.object({
    amount: yup.number().max(100000000).required('Input is required'),
}); */

const amountOptions = [
    { value: "all", label: "all" },
    { value: "amount", label: "amount" }
]

const savingGoalOptions =  [
    { value: "percentage", label: "percentage" },
    { value: "amount", label: "amount" }
]

export const SavingsPage = () => {
    const client = useApolloClient();
    const {navHovered} = useContext(Context)

    const {loading: loadBalance, data: balanceData} = useQuery(LOAD_SAVINGSBALANCE);
    const {loading: loadSavings, data: savingsData, fetchMore} = useQuery(LOAD_SAVINGS, {
        variables: {
            offset: 0,
            limit: 10,
        }
    });

    const [addSavings] = useMutation(SET_SAVINGS, {
        update(cache, {data: {addedSavings} }) {
            cache.modify({
                fields: {
                    createSavings(existingSavings = []) {
                        const createdSavingsRef = cache.writeFragment({
                            data: addedSavings,
                            fragment: gql`
                                fragment createdSavings on Savings {
                                    id,
                                    amount,
                                    name,
                                    goal,
                                    goal_date,
                                    type
                                }
                            `
                        });
                        return [...existingSavings, createdSavingsRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [addMonthlySavings] = useMutation(SET_MONTHLY_SAVINGS, {
        update(cache, {data: {adjustMonthlySavings} }) {
            cache.modify({
                fields: {
                    updateMonthlySavings(existingSavings = []) {
                        const createdMonhtlySavingsRef = cache.writeFragment({
                            data: adjustMonthlySavings,
                            fragment: gql`
                                fragment createdMontlySavings on SavingsBalance {
                                    id,
                                    total,
                                    unassigned,
                                    monthly_savings
                                }
                            `
                        });
                        return [...existingSavings, createdMonhtlySavingsRef];
                    }
                }
            });
        }
    });
    const [savingsRemoveMut] = useMutation(DELETE_SAVINGS, {
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [editSavings] = useMutation(EDIT_SAVINGS, {
        update(cache, {data: {adjustSavings} }) {
            cache.modify({
                fields: {
                    updateSavings(existingSavings = []) {
                        const adjustSavingsRef = cache.writeFragment({
                            data: adjustSavings,
                            fragment: gql`
                                fragment addSavings on Savings {
                                    id,
                                    name,
                                    amount,
                                    goal,
                                    goal_date,
                                    type
                                }
                            `
                        });
                        return [...existingSavings, adjustSavingsRef];
                    }
                }
            });
        },
    });
    const [adjustSavings] = useMutation(ADJUST_SAVINGS_BALANCE, {
        update(cache, {data: {adjustSavingsBalance} }) {
            cache.modify({
                fields: {
                    updateSavingsEntry(existingSavings = []) {
                        const adjustSavBalRef = cache.writeFragment({
                            data: adjustSavingsBalance,
                            fragment: gql`
                                fragment addSavingsBalance on SavingsBalance {
                                    id,
                                    total,
                                    unassigned,
                                    monthly_savings
                                }
                            `
                        });
                        return [...existingSavings, adjustSavBalRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [assignToSavings] = useMutation(ASSIGN_SAVINGS, {
        update(cache, {data: {assignedSavings} }) {
            cache.modify({
                fields: {
                    assignSavings(existingSavings = []) {
                        const assignedSavBalRef = cache.writeFragment({
                            data: assignedSavings,
                            fragment: gql`
                                fragment assignSavlBal on SavingsBalance {
                                    id,
                                    total,
                                    unassigned,
                                    monthly_savings
                                    
                                }
                            `
                        });
                        return [...existingSavings, assignedSavBalRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });


    const [changeOpen, setChangeOpen] = useState(0);
    const [selectedOpen, setSelectedOpen] = useState({selected: "", id: -1});
    const [selectedAmount, setSelectedAmount] = useState({id: -1, amount: "amount"});

    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [count, setCount] = useState(0);
    const [savingsOptions, setSavingsOptions] = useState<{value: string, label: string, id: number}[]>([]);
    
    useEffect(() => {
        if (balanceData) {
            if (balanceData.getSavingsBalance.monthly_savings === "all") {
                setSelectedAmount({id: balanceData.getSavingsBalance.id, amount: "all"});
            } else {
                setSelectedAmount({id: balanceData.getSavingsBalance.id, amount: "amount"});
            }
        }
    }, [balanceData]);

    //Get total count of savings and count of fetched savings to compare and disable load more button when needed
    useEffect(() => {
        savingsData && savingsData.getAllSavings[0].items.forEach((savings: Savings["items"]) => {
            const newSavingOption = { value: savings.name, label: savings.name, id: savings.id };
            setSavingsOptions((prevSavingsOptions) => [...prevSavingsOptions, newSavingOption])
        })
        savingsData && setTotalCount(savingsData.getAllSavings[0].count)
        savingsData && setCount(savingsData.getAllSavings[0].items.length);
    }, [savingsData]);

    const addNewMonthlySavings = (id: number, monthly_savings: string) => {
        addMonthlySavings({
            variables: {
                id: id,
                monthly_savings: monthly_savings
            }
        });
    }
    const addNewSavings = (values: SavingsOut) => {
        const d = values.goal_date ? new Date(values.goal_date) : null
        addSavings({
            variables: {
                name: values.name,
                goal: Math.round(values.goal * 100),
                goal_date: d,
                amount: Math.round(values.amount * 100),
                type: values.type.value
            }
        });
    }

    const editSavingsMut = (values: SavingsOut) => {
        const d = values.goal_date ? new Date(values.goal_date) : null
        editSavings({
            variables: {
                id: values.id,
                name: values.name,
                goal: Math.round(values.goal * 100),
                goal_date: d,
                amount: Math.round(values.amount * 100),
                type: values.type.value
            },
        });
    }

    const removeSavingsMut = (id: number) => {
        savingsRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    const handleSavingsAdjustments = (values: {incoming: string, amount: number}) => {
        adjustSavings({
            variables: {
                incoming: values.incoming === "true",
                amount: Math.round(values.amount * 100)
            }
        });
    }

    const handleSavingsAssignments = (values: {incoming: string, amount: number, amounts?: {value: string, label: string, id: number}}) => {
        assignToSavings({
            variables: {
                incoming: values.incoming === "true",
                amount: Math.round(values.amount * 100),
                savingsId: values.amounts && values.amounts.id,
            }
        });
    }

    //Toggle options to edit and delete for specific saving goal
    const handleChangeOpen = (entryId: number) => {
        const id = changeOpen === entryId ? 0 : entryId;
        setChangeOpen(id);
        setSideBarOpen(false);
    }

    //Toggle sidebar open/close depending on action (edit, remove, add)
    const handleSideBarOpen = (action: string, id: number) => {
        setChangeOpen(0);
        setSideBarOpen(!sideBarOpen);
        setSelectedOpen({selected: action, id});
    }

    return (
        <div className={`w-full xl:w-main xl:ml-main-ext relative mx-4 md:mx-8 pb-24 xl:pb-0 ${navHovered && "xl:opacity-20"} ease-in-out duration-300`}>
            <Header />
            <div className='xl:hidden max-w-48 w-2/5 m-auto mt-8 mb-16'>
                <img src={logo} alt="logo" className='w-full'/>
            </div>
            <main className='py-8'>
                <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Savings</h4>
                {loadBalance && <div>...Loading</div>}
                {balanceData &&
                <div className='font-nunitomedium '>

                    {/* Shows/controls total amount of your savings */}
                    <div>
                        <div className='flex flex-wrap items-center my-10'>
                            <p className="text-xl xs:text-2xl xl:text-3xl">You have <span className='text-2xl xs:text-3xl xl:text-4xl text-ltgreen xl:text-dkgreen'>€ {(balanceData.getSavingsBalance.total/100).toFixed(2).replace('.', ',')}</span> in your savings account</p>
                            <button onClick={() => {handleSideBarOpen("save", -1)}} className="hover:bg-opacity-60 px-2 h-8 rounded-full w-12 justify-between items-center bg-light bg-opacity-40 flex flex-wrap duration-300 md:mx-6 mt-6 md:mt-2">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                            </button>
                        </div>
                        
                        {/* <button onClick={(e) => {e.preventDefault(); setSavingsOpen(!savingsOpen)}} className="border-2 border-red-400">Add to Savings</button> */}
                        {selectedOpen.selected === "save" && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                amount: 0,
                                incoming: "",
                            }}
                            /* validationSchema={validationSchemaSavings} */
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                handleSavingsAdjustments(values)
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start">
                                        <h3 className="text-dark text-xl my-6 font-leaguespartan">Move money between checking and saving account</h3>
                                        <Field name="amount" type="text" label="Amount " placeholder="amount of money" as={TextFieldError}/>
                                        <div id="directionGroup" className=''>Where would you like to move the money to?</div>
                                        <div role="group" aria-labelledby='directionGroup'>
                                            <label className='mx-2'>
                                                <Field name="incoming" type="radio" value="true"/>
                                                <span className='mx-2'>Savings</span>
                                            </label>
                                            <label className='mx-2 px-2'>
                                                <Field name="incoming" type="radio" value="false"/>
                                                <span className='mx-2'>Checkings</span>
                                            </label>
                                        </div>
                                        <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                            <Button disabled={isSubmitting} type="submit" content="Save"/>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                </Form>
                            )}
                            </Formik>
                        </SideBar>
                        }
                    </div>

                    {/* Shows/controls unassigned money of your savings (savings money not assigned to a specific saving goal) */}
                    <div className=''>
                        <div className='flex flex-wrap items-center my-10'>
                            <p className="text-xl xs:text-2xl xl:text-3xl">You have <span className='text-2xl xs:text-3xl xl:text-4xl text-ltgreen xl:text-dkgreen'>€ {(balanceData.getSavingsBalance.unassigned/100).toFixed(2).replace('.', ',')}</span> left to assign in your savings account</p>
                            <button onClick={() => {handleSideBarOpen("assign", -1)}} className="hover:bg-opacity-60 px-2 h-8 rounded-full w-12 justify-between items-center bg-light bg-opacity-40 flex flex-wrap duration-300 md:mx-6 mt-6 md:mt-2">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                            </button>
                        </div>
                        
                        {selectedOpen.selected === "assign" && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                amount: 0,
                                incoming: "",
                            }}
                            /* validationSchema={validationSchemaSavings} */
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                handleSavingsAssignments(values)
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start">
                                        <h3 className="text-dark text-xl my-6 font-leaguespartan">Assign money or take money out of saving goal</h3>
                                        <Field name="amount" type="text" label="Amount " placeholder="amount of (un)assigned money" as={TextFieldError}/>
                                        <div id="directionGroup" className=''>Where would you like to move the money from/to?</div>
                                        <div role="group" aria-labelledby='directionGroup'>
                                            <label className='mx-2'>
                                                <Field name="incoming" type="radio" value="true"/>
                                                <span className='mx-2'>To</span>
                                            </label>
                                            <label className='mx-2 px-2'>
                                                <Field name="incoming" type="radio" value="false"/>
                                                <span className='mx-2'>From</span>
                                            </label>
                                        </div>
                                        <SelectField name="amounts" options={savingsOptions}/>
                                        <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                            <Button disabled={isSubmitting} type="submit" content="Save"/>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                </Form>
                            )}
                            </Formik>
                        </SideBar>}
                    </div>

                    {/* Shows/controls the amount of money siphoned from your regular account to your savings account on monthly basis */}
                    <div>
                        <div className='flex flex-wrap items-center my-10'>
                        <p className="text-xl xs:text-2xl xl:text-3xl">Current Monthly Savings: <span className='whitespace-nowrap text-2xl xs:text-3xl xl:text-4xl text-ltgreen xl:text-dkgreen'>{balanceData.getSavingsBalance.monthly_savings === "all" ? "all" : `€ ${(parseFloat(balanceData.getSavingsBalance.monthly_savings)/100).toFixed(2).replace('.', ',')}`}</span></p>
                            <button onClick={() => {handleSideBarOpen("monthly", -1)}} className="hover:bg-opacity-60 px-2 h-8 rounded-full w-12 justify-between items-center bg-light bg-opacity-40 flex flex-wrap duration-300 md:mx-6 mt-6 md:mt-2">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                            </button>
                        </div>
                        { selectedOpen.selected === "monthly" &&
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: selectedAmount.id,
                                amount: 0,
                                savings: {value: selectedAmount.amount , label: selectedAmount.amount}
                            }}
                            /* validationSchema={validationSchemaMonthlySavings} */
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                const monthlySavings = values.savings.value === "all" ? "all" : (values.amount).toString();
                                addNewMonthlySavings(values.id, monthlySavings);
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                            {({ values, isSubmitting }) => (
                                <Form>
                                    <div className="my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start">
                                        <h3 className="text-dark text-xl my-6 font-leaguespartan">Pick a monthly amount to go into your savings account</h3>
                                        <SelectField name="savings" options={amountOptions}/>
                                        {values.savings.value === "amount" && 
                                            <Field name="amount" type="text" label="Amount " placeholder="amount of savings" as={TextFieldError}/>
                                        }
                                        <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                            <Button disabled={isSubmitting} type="submit" content="Save"/>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                </Form>
                            )}
                            </Formik>
                        </SideBar>}
                    </div>   
                </div>
            }

                {/* Opens side bar when new savings is added */}
                {selectedOpen.selected === "add" && 
                <SideBar sideBarOpen={sideBarOpen}>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        amount: 0,
                        type: {value: "amount" , label: "amount"},
                        name: "",
                        goal: 0,
                        goal_date: ""
                    }}
                    /* validationSchema={validationSchemaGoals} */
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addNewSavings(values);
                        setSelectedOpen({selected: "", id: -1})
                        handleChangeOpen(0)
                        resetForm({})
                        setSubmitting(false);
                        setSideBarOpen(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form>
                            <div className="my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start">
                                <h3 className="text-dark text-xl my-6 font-leaguespartan">Add A New Saving Goal <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>Will be assigned at start of each month</span></h3>
                                <SelectField name="type" options={savingGoalOptions}/>
                                <div className='capitalize'>
                                    <Field name="amount" type="text" label={`${values.type.value}`} placeholder={`fill in ${values.type.value}`} as={TextFieldError}/>
                                </div>
                                <Field name="name" type="text" label="Name " placeholder="name for saving goal" as={TextFieldError}/>
                                <Field name="goal" type="text" label="Total Amount" placeholder="total amount saving goal" as={TextFieldError}/>
                                <Field name="goal_date" type="text" label="Date " placeholder="saving date goal" as={TextFieldError}/>
                                <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                    <Button disabled={isSubmitting} type="submit" content="Save"/>
                                </div>
                            </div>
                            <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                            </button>
                        </Form>
                    )}
                    </Formik>
                </SideBar>}
                <div className='flex flex-wrap items-center w-full mt-24'>
                    <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Saving Goals</h4>
                    <button className="" onClick={() => handleSideBarOpen("add", -1)}>
                        <AddIcon className='mx-3 fill-ltgreen hover:fill-dark w-1/8 h-1/8 transition duration-200'/>
                    </button>
                </div>
                <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                {loadSavings && <div>...Loading</div>}
                {savingsData && savingsData.getAllSavings[0].items.map((savings: Savings["items"]) => {
                const months = Math.ceil((savings.goal - savings.saved)/savings.amount);
                return (
                    <li className='mx-auto md:mx-0 my-12 flex flex-wrap  w-4/5' key={savings.id}>
                        <div className='group w-3/5 flex flex-wrap'>
                            <div className={`${savings.saved === savings.goal && "opacity-40"} w-full p-6 rounded-l-2xl flex flex-wrap  bg-mdgreen xl:bg-dkgreen hover:bg-ltgreen xl:hover:bg-dark hover:bg-opacity-80 duration-300`}>
                                <h4 className='first-letter:uppercase font-nunitobold text-2xl group-hover:text-light duration-300 mb-8 w-full'>{savings.name}</h4>
                                <div className='w-full self-end'>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Saved:</p>
                                        <p>{(savings.saved/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Total:</p>
                                        <p>{(savings.goal/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Type:</p>
                                        <p>{savings.type}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Monthly Amount:</p>
                                        <p>{(savings.amount/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Goal Date:</p>
                                        <p>{moment(savings.goal_date).format("DD/MM")}</p>
                                    </div>
                                    {months > 0 && 
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Months left:</p>
                                        <p>{months}</p>
                                    </div>}
                                </div>
                            </div>
                            

                        {/* Opens side bar when existing saving goal is adjusted */}

                        {selectedOpen.selected === "edit" && selectedOpen.id === savings.id &&
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: savings.id,
                                name: savings.name,
                                amount: parseFloat((savings.amount/100).toFixed(2)),
                                goal: parseFloat((savings.goal/100).toFixed(2)),
                                goal_date: savings.goal_date || moment().format("DD/MM/YY"),
                                type: {value: savings.type , label: savings.type},
                            }}
                        /*  validationSchema={validationSchemaGoals} */
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                editSavingsMut(values);
                                setSelectedOpen({selected: "", id: -1})
                                handleChangeOpen(0)
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                            {({ values, isSubmitting }) => (
                                <Form>
                                        <div className='my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start'>
                                        <h3 className="text-dark text-xl my-6 font-leaguespartan">Adjust Loan</h3>
                                        <SelectField name="type" options={savingGoalOptions}/>
                                        <div className='capitalize'>
                                        <Field name="amount" type="text" label={`${values.type.value}:`} placeholder={`fill in ${values.type.value}`} as={TextFieldError}/>
                                        </div>
                                        <Field name="goal" type="text" label="Goal " placeholder="fill in your goal amount" as={TextFieldError}/>
                                        <Field name="goal_date" type="text" label="Date" placeholder={moment(savings.goal_date).format("DD/MM/YY")} as={TextFieldError}/>
                                        <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                                <Button disabled={isSubmitting} type="submit" content="Save"/>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                </Form>
                            )}
                            </Formik>
                        </SideBar> }
                        
                        {/* Opens side bar when existing saving goal is removed */}

                        {selectedOpen.selected === "remove" && selectedOpen.id === savings.id && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: savings.id,
                                removeSavings: ""
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                if (values.removeSavings === "true") {removeSavingsMut(values.id)}
                                setSelectedOpen({selected: "", id: -1})
                                handleChangeOpen(0)
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className='my-24 mx-4 text-dkgreen font-nunitobold h-60 flex flex-col justify-between items-start'>
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Remove Saving Goal'</h3>
                                            <p>Name of Savings <span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{savings.name}</span></p>
                                            <div id="remove-group" className=''>Would you like to remove this saving goal from your account? <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This action is permanent</span></div>
                                            <div role="group" aria-labelledby='remove-group'>
                                                <label className='mx-2'>
                                                    <Field name="removeSavings" type="radio" value="false"/>
                                                    <span className='mx-2'>No</span>
                                                </label>
                                                <label className='mx-2 px-2'>
                                                    <Field name="removeSavings" type="radio" value="true"/>
                                                    <span className='mx-2'>Yes</span>
                                                </label>
                                            </div>
                                            <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                                    <Button disabled={isSubmitting} type="submit" content="Confirm"/>
                                            </div>
                                        </div>
                                        <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0)}}>
                                            <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                                        </button>
                                    </Form>
                            )}
                            </Formik>
                        </SideBar>}
                        </div>

                        {/* edit/delete button */}
                        <div className={`${savings.saved === savings.goal && "opacity-40"} py-3 bg-light bg-opacity-80 flex flex-1 flex-wrap justify-end rounded-r-2xl`}>
                            { changeOpen !== savings.id &&
                            <button onClick={() => handleChangeOpen(savings.id)} className="group px-2 h-10 w-8 justify-evenly items-center flex flex-col duration-300">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                            </button>}
                            {   
                                changeOpen === savings.id &&
                                <div className='flex flex-col items-end'>
                                    <button onClick={() => handleChangeOpen(savings.id)}>
                                        <CloseIcon className='m-1 fill-dkgreen opacity-40 hover:opacity-70 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                    <button className='px-3 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("edit", savings.id)}>Edit</button>
                                    <button className='px-2 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("remove", savings.id)}>Delete</button>
                                </div>
                            }
                            <div className="my-4 w-full">
                            <SVG src={`../icons/bill-${Math.floor(Math.random() * 6 + 1)}.svg`} className="mx-auto w-14 h-14 fill-dark relative"/>
                            </div>
                        </div>
                    </li>)
                    })
                }
                </ul>
                { count < totalCount &&
                <div className='w-full flex'>
                <button className="mx-auto font-leaguespartan bg-light hover:bg-opacity-80 rounded-full px-6 py-4 text-dkgreen duration-300" onClick={() => {
                    fetchMore({
                        variables: {offset: count}
                    })
                }}>LOAD MORE</button>
                </div>}
            </main>
        </div>
        
    )
} 
