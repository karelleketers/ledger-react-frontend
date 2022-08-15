import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { Context } from "../../../App";
import { DELETE_LOAN, EDIT_LOAN, SET_LOAN } from '../../../GraphQL/Mutations';
import { LOAD_LOANS } from '../../../GraphQL/Queries';
import { Button, Header, SideBar, TextFieldError } from '../../Components';
import { ReactComponent as AddIcon } from './../../../assets/images/add.svg';
import { ReactComponent as CloseIcon } from './../../../assets/images/close.svg';
import logo from './../../../assets/images/leder-grnwds.png';


interface Loan {
    count: number, 
    items: {
        id: number
        inviteName: string
        inviteEmail: string
        owed: boolean
        updatedAt?: Date
        loan: {
            id: number
            amount: number
            paid: boolean
            reason: string
        }
        
    }
}

interface LoansOut {
    id?: number
    invite: string
    amount: number
    paid: boolean | string
    owed: boolean | null | string
    reason: string
}

const validationAdd = yup.object({
    invite: yup.string().max(48).required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
    owed: yup.string().required('Input is required'),
    paid: yup.string().required('Input is required'),
    
});

const validationAdjust = yup.object({
    invite: yup.string().max(48).required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
    owed: yup.string().required('Input is required'),
    paid: yup.string().required('Input is required'),
})

export const LoansPage = () => {
    const client = useApolloClient();
    const {navHovered} = useContext(Context)

    const { loading, data, fetchMore } = useQuery(LOAD_LOANS, {
        variables: {
            offset: 0,
            limit: 10,
        }
    });
    
    const [loanRemoveMut] = useMutation(DELETE_LOAN, {
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [editLoan] = useMutation(EDIT_LOAN, {
        update(cache, {data: {adjustLoan} }) {
            cache.modify({
                fields: {
                    updateLoan(existingLoans = []) {
                        const adjustLoanRef = cache.writeFragment({
                            data: adjustLoan,
                            fragment: gql`
                                fragment adjustedLoan on Loan {
                                    id,
                                    amount,
                                    paid,
                                    reason,
                                    userloans {
                                        owed,
                                        inviteEmail,
                                        inviteName
                                    }
                                }
                            `
                        });
                        return [...existingLoans, adjustLoanRef];
                    }
                }
            });
        },

        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [addLoan] = useMutation(SET_LOAN, {
        update(cache, {data: {addLoan} }) {
            cache.modify({
                fields: {
                    createLoan(existingLoans = []) {
                        const createdLoanRef = cache.writeFragment({
                            data: addLoan,
                            fragment: gql`
                                fragment createdLoan on Loan {
                                    id,
                                    amount,
                                    paid,
                                    reason,
                                    userloans {
                                        owed,
                                        inviteEmail,
                                        inviteName
                                    }
                                }
                            `
                        });
                        return [...existingLoans, createdLoanRef];
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
    const [reasonOpen, setReasonOpen] = useState(0);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [count, setCount] = useState(0);
    
    //Get total count of loans and count of fetched loans to compare and disable load more button when needed
    useEffect(() => {
        data && setTotalCount(data.getLoans[0].count)
        data && setCount(data.getLoans[0].items.length);
    }, [data]);
 
    //Add new loan mutation
    const addNewLoan = (values: LoansOut) => {
        addLoan({
                variables: {
                    invite: values.invite,
                    amount: Math.round(values.amount * 100),
                    paid: values.paid === "true",
                    owed: values.owed === "true",
                    reason: values.reason
            }
        });
    }


    //Edit existing bill mutation
    const editLoanMut = (values: LoansOut) => {
        editLoan({
            variables: {
                id: values.id,
                invite: values.invite,
                amount: Math.round(values.amount * 100),
                paid: values.paid === "true",
                owed: values.owed,
                reason: values.reason
            }
        });
    }

    //Remove existing bill mutation
    const removeLoanMut = (id: number) => {
        loanRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    //Toggle options to edit and delete for specific bill
    const handleChangeOpen = (loanId: number) => {
        const id = changeOpen === loanId ? 0 : loanId;
        setChangeOpen(id);
        setSideBarOpen(false);
    }

    //Toggle show reason for bill (if existing)
    const handleOpenReason = (loanId: number) => {
        const id = reasonOpen === loanId ? 0 : loanId;
        setReasonOpen(id);
    }

    //Toggle sidebar open/close depending on action (edit, remove, add)
    const handleSideBarOpen = (action: string, id: number) => {
        setChangeOpen(0);
        setSideBarOpen(!sideBarOpen);
        action === "edit"? setSelectedOpen({selected: "edit", id: id}) : action === "remove" ? setSelectedOpen({selected: "remove", id: id}) : setSelectedOpen({selected: "add", id: id})
    }

    return (
        <div className={`w-full xl:w-main xl:ml-main-ext relative mx-4 md:mx-8 pb-24 xl:pb-0 ${navHovered && "xl:opacity-20"} ease-in-out duration-300`}>
            <Header />
            <div className='xl:hidden max-w-48 w-2/5 m-auto mt-8 mb-16'>
                <img src={logo} alt="logo" className='w-full'/>
            </div>
            <main className="py-4">
                <div className='flex flex-wrap items-center w-full my-4'>
                    <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Loans</h4>
                    <button className="" onClick={() => handleSideBarOpen("add", -1)}>
                        <AddIcon className='mx-3 fill-ltgreen hover:fill-dark w-1/8 h-1/8 transition duration-200'/>
                    </button>
                </div>

                {/* Opens side bar when new loan is added */}
                {(selectedOpen.selected === "add" ) &&
                <SideBar sideBarOpen={sideBarOpen}>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        invite: "",
                        amount: 0,
                        reason: "",
                        owed: "",
                        paid: "",
                    }}
                    validationSchema={validationAdd}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addNewLoan(values);
                        resetForm({})
                        setSubmitting(false);
                        setSideBarOpen(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form> 
                            <div className='my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start'>
                                <h3 className="text-dark text-xl my-6 font-leaguespartan">Add A New Loan <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>Fill in details below</span></h3>
                                <div role="group" aria-labelledby='owe-group'>
                                    <label className='mx-2'>
                                        <Field name="owed" type="radio" value="true"/>
                                        <span className='mx-2'>To <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>(receiver)</span></span>
                                    </label>
                                    <label className='mx-2'>
                                        <Field name="owed" type="radio" value="false"/>
                                        <span className='mx-2'>From <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>(sender)</span></span>
                                    </label>
                                </div>
                                <Field name="invite" type="text" label="Who " placeholder="add someone by email" as={TextFieldError}/>
                                <Field name="amount" type="text" label="Amount " placeholder="amount of loan" as={TextFieldError}/>
                                <Field name="reason" type="text" label="Purpose " placeholder="purpose of loan" as={TextFieldError}/>
                                <div id="settled-group">Has this loan been settled?</div>
                                <div role="group" aria-labelledby='settled-group'>
                                    <label className='mx-2'>
                                        <Field name="paid" type="radio" value="false"/>
                                        <span className='mx-2'>Unsettled</span>
                                    </label>
                                    <label className='mx-2'>
                                        <Field name="paid" type="radio" value="true"/>
                                        <span className='mx-2'>Settled</span>
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
                </SideBar>}

                {/* Shows list of bills history */}

                <ul>
                    {loading && <div>...Loading</div>}
                    {data && data.getLoans[0].items.map((loan: Loan["items"]) => {
                    return (
                    <li className={`group my-12 min-h-55 md:min-h-0 md:h-18 flex flex-wrap items-center rounded-full bg-dark ${loan.loan.paid ? "bg-opacity-40 hover:bg-opacity-30" : "hover:bg-opacity-70"} duration-300`} key={loan.id}>
                        <div className='w-4/5 lg:w-70 xli:w-4/5 h-full'>
                            <button className={`${loan.loan.paid && "opacity-40"} text-left text-light cursor-default px-10 grid grid-cols-5 w-full h-full items-center`} onClick={() => loan.loan.reason && handleOpenReason(loan.id)}>
                                { reasonOpen !== loan.id &&
                                <>
                                    <p className='col-span-1 text-xs lg:text-sm opacity-60 duration-300'>{moment(loan.updatedAt).format("DD MMM YYYY")}</p>
                                    <p className="col-span-1 text-xs font-nunitobold duration-300 lg:text-xl">{(loan.loan.amount/100).toFixed(2).replace('.', ',')}</p>
                                    <p className='col-span-1 text-xs lg:text-sm uppercase duration-300'>{loan.owed ? "SENT TO ": "RECEIVED FROM "}</p>
                                    <p className='col-span-1 text-xs first-letter:uppercase font-nunitobold lg:text-xl duration-300'>{loan.inviteName}</p>
                                    <p className='col-span-1 text-xs lg:text-sm uppercase duration-300'>{loan.loan.paid ? "SETTLED" : "UNSETTLED"}</p>
                                </>
                                }
                                { reasonOpen === loan.id &&
                                <p className='col-span-5 text-sm opacity-60 text-light font-nunitobold'>{loan.loan.reason}</p>
                                }
                            </button>

                        {/* Opens side bar when existing bill is adjusted */}

                        {selectedOpen.selected === "edit" && selectedOpen.id === loan.id &&
                            <SideBar sideBarOpen={sideBarOpen}>
                                <Formik
                                enableReinitialize
                                initialValues={{
                                    amount: parseFloat((loan.loan.amount/100).toFixed(2)),
                                    id: loan.id,
                                    invite: loan.inviteEmail,
                                    paid: loan.loan.paid,
                                    owed: loan.owed,
                                    reason: loan.loan.reason,
                                }}
                                validationSchema={validationAdjust}
                                onSubmit={(values, {setSubmitting, resetForm}) => {
                                    setSubmitting(true);
                                    editLoanMut(values);
                                    setSelectedOpen({selected: "", id: -1})
                                    setChangeOpen(0)
                                    resetForm({})
                                    setSubmitting(false);
                                    setSideBarOpen(false);
                                }}
                                >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className='my-24 mx-4 text-dkgreen font-nunitobold h-60 flex flex-col justify-between items-start'>
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Adjust Loan {loan.owed ? "to" : "from"} {loan.inviteName}</h3>
                                            <Field name="amount" type="text" label="Amount " placeholder="amount of loan" as={TextFieldError}/>
                                            <Field name="reason" type="text" label="Purpose " placeholder="purpose of loan" as={TextFieldError}/>
                                            <div id="settled-group">Has this loan been settled?</div>
                                                <div role="group" aria-labelledby='settled-group'>
                                                    <label className='mx-2'>
                                                        <Field name="paid" type="radio" value="false"/>
                                                        <span className='mx-2'>Unsettled</span>
                                                    </label>
                                                    <label className='mx-2'>
                                                        <Field name="paid" type="radio" value="true"/>
                                                        <span className='mx-2'>Settled</span>
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

                        {/* Opens side bar when existing bill is removed */}

                        {selectedOpen.selected === "remove" && selectedOpen.id === loan.id && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: loan.id,
                                removeLoan: ""
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                if (values.removeLoan === "true") {removeLoanMut(values.id)}
                                setSelectedOpen({selected: "", id: -1})
                                setChangeOpen(0)
                                resetForm({})
                                setSubmitting(false);
                                setSideBarOpen(false);
                            }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className='my-24 mx-4 text-dkgreen font-nunitobold h-60 flex flex-col justify-between items-start'>
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Remove Bill</h3>
                                            <p>Loan {loan.owed ? "to" : "from"}<span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{loan.inviteName}</span></p>
                                            <div id="remove-group" className=''>Would you like to remove this loan from your account? <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This action is permanent</span></div>
                                            <div role="group" aria-labelledby='remove-group'>
                                                <label className='mx-2'>
                                                    <Field name="removeLoan" type="radio" value="false"/>
                                                    <span className='mx-2'>No</span>
                                                </label>
                                                <label className='mx-2 px-2'>
                                                    <Field name="removeLoan" type="radio" value="true"/>
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
                        </SideBar>
                        }
                        </div>

                        {/* edit/delete button */}

                        {  selectedOpen.id !== loan.id &&
                        <div className={`${loan.loan.paid && "opacity-40"} flex-1 flex flex-wrap items-center justify-evenly h-full`}>
                            { changeOpen !== loan.id &&
                            <button onClick={() => handleChangeOpen(loan.id)} className="bg-light bg-opacity-60 hover:bg-opacity-80 px-2 py-2 md:py-0 h-14 md:h-8 rounded-full w-6 md:w-12 justify-between items-center flex flex-wrap duration-300 xl:ml-auto xl:mr-20">
                                <div className='w-2 h-2 rounded-full bg-light duration-300'></div>
                                <div className='w-2 h-2 rounded-full bg-light duration-300'></div>
                                <div className='w-2 h-2 rounded-full bg-light duration-300'></div>
                            </button>}
                            {   
                                changeOpen === loan.id &&
                                <div className='flex flex-col lg:flex-row lg:flex-wrap h-full text-xs lg:text-base items-center'>
                                    <button className='lg:px-3 h-6 lg:h-8 w-full lg:w-auto rounded-full opacity-40 bg-light lg:mx-4 text-dark duration-300 hover:opacity-70' onClick={() => handleSideBarOpen("edit", loan.id)}>Edit</button>
                                    <button className='lg:px-2 h-6 lg:h-8 w-full lg:w-auto rounded-full opacity-40 bg-light text-dark duration-300 hover:opacity-70' onClick={() => handleSideBarOpen("remove", loan.id)}>Delete</button>
                                    <button onClick={() => handleChangeOpen(loan.id)}>
                                        <CloseIcon className='mx-3 fill-light opacity-30 hover:opacity-70 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                </div> 
                            }
                        </div>}
                    </li>)
                    })}
                </ul>
                { count < totalCount &&
                <div className='w-full flex'>
                <button className="mx-auto font-leaguespartan bg-light hover:bg-opacity-80 rounded-full px-6 py-4 text-dkgreen duration-300" onClick={() => {
                    fetchMore({
                        variables: {offset: data.getLoans[0].items.length}
                    })
                }}>LOAD MORE</button>
                </div>}
            </main>
        </div>
    )
}