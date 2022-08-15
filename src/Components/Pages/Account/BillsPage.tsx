import { Formik, Form, Field } from 'formik';
import { TextFieldError, Button, Header, SideBar } from '../../Components';
import * as yup from 'yup';

import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import { LOAD_BILLS } from '../../../GraphQL/Queries'
import { DELETE_BILL, EDIT_BILL, SET_BILL } from '../../../GraphQL/Mutations';
import {ReactComponent as AddIcon} from './../../../assets/images/add.svg';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import logo from './../../../assets/images/leder-grnwds.png';
import { Context } from '../../../App';

interface Bills {
    count: number, 
    unpaidCount: number,
    items: {
        id: number,
        name: string,
        amount: number
        paid: string | boolean
        reminder?: boolean | null 
        updatedAt?: Date
    }
}

interface BillsOut {
    id?: number,
    name: string,
    amount: number
    paid?: boolean | string
}

const validationAdd = yup.object({
    name: yup.string().max(32).required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
});

const validationAdjust = yup.object({
    name: yup.string().max(32).required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
    paid: yup.string().required('Input is required'),
});

export const BillsPage = () => {
    const client = useApolloClient();
    const {navHovered} = useContext(Context)

    const { loading, data, fetchMore } = useQuery(LOAD_BILLS, {
        variables: {
            offset: 0,
            limit: 10,
        }
    });
    
    const [billRemoveMut] = useMutation(DELETE_BILL, {
        onCompleted: async () => {
        await client.refetchQueries({include: "all"})
        }
    });
    const [editBill] = useMutation(EDIT_BILL, {
        update(cache, {data: {adjustBill} }) {
            cache.modify({
                fields: {
                    updateBill(existingBills = []) {
                        const editBillRef = cache.writeFragment({
                            data: adjustBill,
                            fragment: gql`
                                fragment adjustedBill on Bill {
                                    id,
                                    amount,
                                    name,
                                    paid
                                }
                            `
                        });
                        return [...existingBills, editBillRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [addBill] = useMutation(SET_BILL, {
        update(cache, {data: {addBill} }) {
            cache.modify({
                fields: {
                    createBill(existingBills = []) {
                        const addBillRef = cache.writeFragment({
                            data: addBill,
                            fragment: gql`
                                fragment createdBill on Bill {
                                    id,
                                    amount,
                                    name
                                }
                            `
                        });
                        return [...existingBills, addBillRef];
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
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [count, setCount] = useState(0);
    const [currentDate, setCurrentDate] = useState<Date>();
    const [unpaidBills, setUnpaidBills] = useState(0);
    const [reminderOpen, setReminderOpen] = useState(false);
    
    //Get total count of bills and count of fetched bills to compare and disable load more button when needed
    useEffect(() => {
        data && setTotalCount(data.getBills[0].count)
        data && setCount(data.getBills[0].items.length);
        data && setUnpaidBills(data.getBills[0].unpaidCount)
        data && data.getBills[0].unpaidCount > 0 && setReminderOpen(true);
    }, [data]);

    //Get today's date
    useEffect(() => {
        const d = new Date()
        setCurrentDate(d)  
    }, []);
 
    //Add new bill mutation
    const addNewBill = (values: BillsOut) => {
        addBill({
            variables: {
                name: values.name,
                amount: Math.round(values.amount * 100),
            }
        });
    }


    //Edit existing bill mutation
    const editBillMut = (values: BillsOut) => {
        editBill({
            variables: {
                id: values.id,
                name: values.name,
                amount: Math.round(values.amount * 100),
                paid: values.paid === "true",
            }
        });
    }

    //Remove existing bill mutation
    const removeBillMut = (id: number) => {
        billRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    //Toggle options to edit and delete for specific bill
    const handleChangeOpen = (billId: number) => {
        const id = changeOpen === billId ? 0 : billId;
        setChangeOpen(id);
        setSideBarOpen(false);
    }

    //Toggle sidebar open/close depending on action (edit, remove, add)
    const handleSideBarOpen = (action: string, id: number) => {
        setChangeOpen(0);
        setSideBarOpen(!sideBarOpen);
        action === "edit"? setSelectedOpen({selected: "edit", id: id}) : action === "remove" ? setSelectedOpen({selected: "remove", id: id}) : setSelectedOpen({selected: "add", id: id})
    }

    return (
        <div className={`w-full xl:w-main mx-4 md:mx-8 xl:ml-main-ext relative pb-24 xl:pb-0 ${unpaidBills > 0 ? "mb-4" : "my-4"} ${navHovered && "xl:opacity-20"} ease-in-out duration-300`} >
            <div>
                {unpaidBills > 0 && reminderOpen && 
                <div className='bg-light rounded-b-3xl relative flex'>
                    <p className='m-auto p-2 text-lg font-nunitoblack text-dkgreen'>You have <span className='text-mdgreen text-2xl'>{unpaidBills}</span> unpaid bills!</p>
                    <button className="absolute top-4 right-4" onClick={() => {setReminderOpen(false)}}>
                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                    </button>
                </div>
                }
                <Header />
                <div className='xl:hidden max-w-48 w-2/5 m-auto mt-8 mb-16'>
                    <img src={logo} alt="logo" className='w-full'/>
                </div>
            </div>
            <main className="py-4">
                <div className='flex flex-wrap items-center w-full my-4'>
                    <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Bills</h4>
                    <button className="" onClick={() => handleSideBarOpen("add", -1)}>
                        <AddIcon className='mx-3 fill-ltgreen hover:fill-dark w-1/8 h-1/8 transition duration-200'/>
                    </button>
                </div>

                {/* Opens side bar when new bill is added */}
                {(selectedOpen.selected === "add" ) &&
                <SideBar sideBarOpen={sideBarOpen}>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        name: "",
                        amount: 0,
                    }}
                    validationSchema={validationAdd}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addNewBill(values);
                        resetForm({})
                        setSubmitting(false);
                        setSideBarOpen(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form> 
                            <div className='my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start'>
                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Add A New Bill <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>Fill in details below</span></h3>
                                <Field name="name" type="text" label="For " placeholder="purpose of bill" as={TextFieldError}/>
                                <Field name="amount" type="text" label="Amount " placeholder="monthly amount of bill" as={TextFieldError}/> 
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

                <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    {loading && <div>...Loading</div>}
                    {data && data.getBills[0].items.map((bill: Bills["items"]) => {
                    return (
                    <li className='mx-auto md:mx-0 my-12 flex flex-wrap  w-4/5' key={bill.id}>
                        <div className='group w-3/5 flex flex-wrap'>
                            <div className={`${bill.paid && "opacity-40"} w-full p-6 rounded-l-2xl flex flex-wrap bg-mdgreen xl:bg-dkgreen hover:bg-ltgreen xl:hover:bg-dark hover:bg-opacity-80 duration-300`}>
                                <h4 className='first-letter:uppercase font-nunitobold text-2xl group-hover:text-light duration-300 mb-8 w-full'>{bill.name}</h4>
                                <div className='w-full self-end'>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Amount:</p>
                                        <p>{(bill.amount/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Paid:</p>
                                        <p>{bill.paid ? "Yes" : "No"}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Frequency:</p>
                                        <p>Monthly</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Due:</p>
                                        <p>{moment(currentDate).add(7, 'days').format("DD/MM")}</p>
                                    </div>
                                </div>
                            </div>
                            

                        {/* Opens side bar when existing bill is adjusted */}

                        {selectedOpen.selected === "edit" && selectedOpen.id === bill.id &&
                            <SideBar sideBarOpen={sideBarOpen}>
                                <Formik
                                enableReinitialize
                                initialValues={{
                                    amount: parseFloat((bill.amount/100).toFixed(2)),
                                    id: bill.id,
                                    name: bill.name,
                                    paid: bill.paid
                                }}
                                validationSchema={validationAdjust}
                                onSubmit={(values, {setSubmitting, resetForm}) => {
                                    setSubmitting(true);
                                    editBillMut(values);
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
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Adjust Bill</h3>
                                            <Field name="name" type="text" label="Name " placeholder="name of bill" as={TextFieldError}/>
                                            <Field name="amount" type="text" label="Amount " placeholder="amount of bill" as={TextFieldError}/>
                                            <div id="paid-group">Has this bill been settled?</div>
                                            <div role="group" aria-labelledby='paid-group'>
                                                <label className='mx-2'>
                                                    <Field name="paid" type="radio" value="false"/>
                                                    <span className='mx-2'>Unpaid</span>
                                                </label>
                                                <label className='mx-2'>
                                                    <Field name="paid" type="radio" value="true"/>
                                                    <span className='mx-2'>Paid</span>
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

                        {selectedOpen.selected === "remove" && selectedOpen.id === bill.id && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: bill.id,
                                name: bill.name,
                                removeBill: ""
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                if (values.removeBill === "true") {removeBillMut(values.id)}
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
                                            <p>Name of Bill <span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{bill.name}</span></p>
                                            <div id="remove-group" className=''>Would you like to remove this bill from your account? <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This action is permanent</span></div>
                                            <div role="group" aria-labelledby='remove-group'>
                                                <label className='mx-2'>
                                                    <Field name="removeBill" type="radio" value="false"/>
                                                    <span className='mx-2'>No</span>
                                                </label>
                                                <label className='mx-2 px-2'>
                                                    <Field name="removeBill" type="radio" value="true"/>
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
                        <div className={`${bill.paid && "opacity-40"} py-3 bg-light bg-opacity-80 flex flex-1 flex-wrap justify-end rounded-r-2xl`}>
                            { changeOpen !== bill.id &&
                            <button onClick={() => handleChangeOpen(bill.id)} className="group px-2 h-10 w-8 justify-evenly items-center flex flex-col duration-300">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                            </button>}
                            {   
                                changeOpen === bill.id &&
                                <div className='flex flex-col items-end'>
                                    <button onClick={() => handleChangeOpen(bill.id)}>
                                        <CloseIcon className='m-1 fill-dkgreen opacity-40 hover:opacity-70 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                    <button className='px-3 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("edit", bill.id)}>Edit</button>
                                    <button className='px-2 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("remove", bill.id)}>Delete</button>
                                </div>
                            }
                            <div className="my-4 w-full">
                            <SVG src={`../icons/bill-${Math.floor(Math.random() * 6 + 1)}.svg`} className="mx-auto w-14 h-14 fill-dark relative"/>
                            </div>
                        </div>
                    </li>)
                    })}
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