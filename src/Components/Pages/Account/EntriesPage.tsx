import { Formik, Form, Field } from 'formik';
import { TextFieldError, SelectField, Button, Header, SideBar } from '../../Components';
import * as yup from 'yup';

import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import { LOAD_CATEGORIES_LIST, LOAD_ENTRIES } from '../../../GraphQL/Queries'
import { SET_ENTRY, DELETE_ENTRY, EDIT_ENTRY } from '../../../GraphQL/Mutations';
import {ReactComponent as AddIcon} from './../../../assets/images/add.svg';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import moment from 'moment';
import logo from './../../../assets/images/leder-grnwds.png';
import { Context } from '../../../App';

interface Entries {
    count: number, 
    items: {
        id: number
        incoming: boolean | null
        amount: number
        category: string
        description: string
        type: string
        updatedAt?: Date
    }
}

interface EntryOut {
    id?: number
    incoming: string | null
    amount: number
    category?: {value: string, label: string, type: string, id?: number | null}
    description: string
}

interface Category {
    __typename: string,
    id: number | null
    name: string,
}

const validationAdd = yup.object({
    incoming: yup.string().required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
});

const validationAdjust = yup.object({
    category: yup.string().required('Input is required'),
    amount: yup.number().max(100000000).required('Input is required'),
    incoming: yup.string().required('Input is required'),
});

let categoryOptions: {value: string, label: string, type: string, id: number | null}[] = [
    {value: "bills", label: "bills", type: "bills", id: null},
    {value: "loans", label: "loans", type: "loans", id: null},
    {value: "savings", label: "savings", type: "savings", id: null},
    {value: "other", label: "other", type: "other", id: null},
];

export const EntriesPage = () => {
    const client = useApolloClient();
    const {navHovered, fromDashboard, setFromDashboard} = useContext(Context)

    const {data: queryData, fetchMore} = useQuery(LOAD_ENTRIES, {
        variables: {
            offset: 0,
            limit: 10,
        }
    });
    
    const {loading, data: catData} = useQuery(LOAD_CATEGORIES_LIST); 

    const [entryRemoveMut] = useMutation(DELETE_ENTRY, {
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [editEntry] = useMutation(EDIT_ENTRY, {
        update(cache, {data: {editEntry} }) {
            cache.modify({
                fields: {
                    updateEntry(existingEntries = []) {
                        const editEntryRef = cache.writeFragment({
                            data: editEntry,
                            fragment: gql`
                                fragment editedEntry on Entry {
                                    id,
                                    incoming,
                                    amount,
                                    category,
                                    description,
                                    type
                                }
                            `
                        });
                        return [...existingEntries, editEntryRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [addEntry] = useMutation(SET_ENTRY, {
        update(cache, {data: {addEntry} }) {
            cache.modify({
                fields: {
                    createEntry(existingEntries = []) {
                        const addEntryRef = cache.writeFragment({
                            data: addEntry,
                            fragment: gql`
                                fragment createdEntry on Entry {
                                    id,
                                    incoming,
                                    amount,
                                    category,
                                    description,
                                    type,
                                }
                            `
                        });
                        return [...existingEntries, addEntryRef];
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
    const [catOptions, setCatOptions] = useState<{value: string, label: string, type: string, id: number | null}[]>(categoryOptions);


    //Storing data in state prevents replicate entries in Category Options
    useEffect(() => {
        catData && catData.getCategoriesList.forEach((category: Category) => {
            const newCatOption = { value: category.name, label: category.name, type: "category", id: category.id };
            setCatOptions((prevCatOptions) => [...prevCatOptions, newCatOption])
        })
    }, [catData])

    
    //Get total count of entries and count of fetched entries to compare and disable load more button when needed
    useEffect(() => {
        queryData && setTotalCount(queryData.getEntries[0].count)
        queryData && setCount(queryData.getEntries[0].items.length);
    }, [queryData]);
    
    //Add new entry mutation
    const addNewEntry = (values: EntryOut) => {
        addEntry({
            variables: {
                incoming: values.incoming === "true",
                amount: Math.round(values.amount * 100),
                category: values.category ? values.category.value : "incoming",
                description: values.description,
                type: values.category ? values.category.type : "incoming",
                categoryId: values.category ? values.category.id : 0,
            }
        });
    }


    //Edit existing entry mutation
    const editEntryMut = (values: Entries["items"]) => {
        editEntry({
            variables: {
                id: values.id,
                incoming: values.incoming,
                amount: Math.round(values.amount * 100),
                category: values.category,
                description: values.description,
                type: values.type,
            }
        });
    }

    //Remove existing entry mutation
    const removeEntryMut = (id: number) => {
        entryRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    //Toggle options to edit and delete for specific entry
    const handleChangeOpen = (entryId: number) => {
        const id = changeOpen === entryId ? 0 : entryId;
        setChangeOpen(id);
        setSideBarOpen(false);
    }

    //Toggle show reason for entry (if existing)
    const handleOpenReason = (entryId: number) => {
        const id = reasonOpen === entryId ? 0 : entryId;
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
                    <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Transaction History</h4>
                    <button className="" onClick={() => handleSideBarOpen("add", -1)}>
                        <AddIcon className='mx-3 fill-ltgreen hover:fill-dark w-1/8 h-1/8 transition duration-200'/>
                    </button>
                </div>

                {/* Opens side bar when new transaction is added */}
                {(selectedOpen.selected === "add" || fromDashboard ) &&
                <SideBar sideBarOpen={sideBarOpen} fromLocation={fromDashboard}>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        incoming: null,
                        amount: 0,
                        description: "",
                    }}
                    validationSchema={validationAdd}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addNewEntry(values);
                        resetForm({})
                        setSubmitting(false);
                        setSideBarOpen(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form> 
                            <div className='my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start'>
                                <h3 className="text-dark text-xl my-6 font-leaguespartan">Add A New Transaction</h3>
                                <div id="direction-group">What's the nature of your transaction?</div>
                                <div role="group" aria-labelledby='direction-group'>
                                    <label className='mx-2'>
                                        <Field name="incoming" type="radio" value="true"/>
                                        <span className='mx-2'>Incoming</span>
                                    </label>
                                    <label>
                                        <Field name="incoming" type="radio" value="false"/>
                                        <span className='mx-2'>Expense</span>
                                    </label>
                                </div>
                                <Field name="amount" type="text" label="Amount " placeholder="amount?" as={TextFieldError}/>
                                {values.incoming === "false" &&
                                <>
                                    <SelectField name="category" options={catOptions}/>
                                    <Field name="description" type="text" label="Description:" placeholder="give a description" as={TextFieldError}/>
                                </>
                                }
                                <div className='inline px-3 py-1 rounded-full text-light bg-dkgreen font-nunitoreg hover:bg-opacity-70 transition-300'>
                                    <Button disabled={isSubmitting} type="submit" content="Save"/>
                                </div>
                            </div>
                            <button className="absolute top-4 right-4" onClick={() => {setSelectedOpen({selected: "", id: -1}); handleChangeOpen(0); setFromDashboard(false)}}>
                                <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                            </button>
                        </Form>
                    )}
                    </Formik>
                </SideBar>}

                {/* Shows list of transaction history */}

                <ul>
                    {loading && <div>...Loading</div>}
                    {queryData && queryData.getEntries[0].items.map((entry: Entries["items"]) => {
                    return (
                    <li className="group my-12 min-h-55 md:min-h-0 md:h-18 rounded-full bg-light bg-opacity-60 hover:bg-dark hover:bg-opacity-70 duration-300" key={entry.id}>
                        <div className='min-h-55 md:min-h-0 text-left cursor-default rounded-full bg-transaction bg-repeat-space w-full h-full flex flex-wrap items-center hover:bg-transaction-lt duration-300'>
                            <div className='w-4/5 md:w-70'>
                                <button className='text-left cursor-default pl-6 xl:px-10 grid grid-cols-10 gap-2 md:gap-0 w-full items-center' onClick={() => entry.description && handleOpenReason(entry.id)}>
                                    { reasonOpen !== entry.id &&
                                    <>
                                    <p className='col-span-3 text-xs md:text-sm text-dark opacity-60 group-hover:text-light duration-300'>{moment(entry.updatedAt).format("DD MMM YYYY")}</p>
                                    <p className='col-span-4 md:col-span-5 first-letter:uppercase font-nunitobold text-dark text-lg md:text-2xl group-hover:text-light duration-300'>{entry.category ? entry.category : entry.incoming ? "money added": "unknown"}</p>
                                    <p className={`${entry.incoming ? "text-mdgreen" : "text-transaction-red"} col-span-3 md:col-span-2 font-nunitobold text-sm md:text-base lg:text-xl`}>{entry.incoming ? "+" : "-"} {(entry.amount/100).toFixed(2).replace('.', ',')}</p>
                                    </>
                                    }
                                    { reasonOpen === entry.id &&
                                    <p className='col-span-5 text-sm opacity-60 text-dark font-nunitobold group-hover:text-light duration-300'>Reason For Transaction: {entry.description}</p>
                                    }
                                </button>

                            {/* Opens side bar when existing transaction is adjusted */}

                            {selectedOpen.selected === "edit" && selectedOpen.id === entry.id &&
                                <SideBar sideBarOpen={sideBarOpen}>
                                    <Formik
                                    enableReinitialize
                                    initialValues={{
                                        amount: parseFloat((entry.amount/100).toFixed(2)),
                                        id: entry.id,
                                        incoming: entry.incoming,
                                        category: entry.category,
                                        description: entry.description || "",
                                        type: entry.type,
                                    }}
                                    validationSchema={validationAdjust}
                                    onSubmit={(values, {setSubmitting, resetForm}) => {
                                        setSubmitting(true);
                                        editEntryMut(values);
                                        setSelectedOpen({selected: "", id: -1})
                                        setChangeOpen(0)
                                        resetForm({})
                                        setSubmitting(false);
                                        setSideBarOpen(false);
                                    }}
                                    >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className='my-24 mx-4 text-dkgreen font-nunitobold h-80 flex flex-col justify-between items-start'>
                                                <h3 className="text-dark text-xl my-6 font-leaguespartan">Adjust Transaction</h3>
                                                <Field name="amount" type="text" label="Amount " placeholder="amount of loan" as={TextFieldError}/>
                                                { entry.category && 
                                                <>
                                                    <p>Category <span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{entry.category}</span></p>
                                                    <Field name="description" type="text" label="Description " placeholder="Give a description" as={TextFieldError}/>
                                                </>}
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

                            {/* Opens side bar when existing transaction is removed */}

                            {selectedOpen.selected === "remove" && selectedOpen.id === entry.id && 
                            <SideBar sideBarOpen={sideBarOpen}>
                                <Formik
                                enableReinitialize
                                initialValues={{
                                    id: entry.id,
                                    removeEntry: ""
                                }}
                                onSubmit={(values, {setSubmitting, resetForm}) => {
                                    setSubmitting(true);
                                    if (values.removeEntry === "true") {removeEntryMut(values.id)}
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
                                                <h3 className="text-dark text-xl my-6 font-leaguespartan">Remove Transaction</h3>
                                                <p>Name of Transaction <span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{entry.category}</span></p>
                                                <div id="remove-group" className=''>Would you like to remove this transaction from your history? <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This action is permanent</span></div>
                                                <div role="group" aria-labelledby='remove-group'>
                                                    <label className='mx-2'>
                                                        <Field name="removeEntry" type="radio" value="false"/>
                                                        <span className='mx-2'>No</span>
                                                    </label>
                                                    <label className='mx-2 px-2'>
                                                        <Field name="removeEntry" type="radio" value="true"/>
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

                            {  selectedOpen.id !== entry.id &&
                            <div className='flex-1 flex flex-wrap justify-evenly'>
                                { changeOpen !== entry.id &&
                                <button onClick={() => handleChangeOpen(entry.id)} className="group-hover:bg-light group-hover:bg-opacity-60 px-2 py-2 md:py-0 h-14 md:h-8 rounded-full w-6 md:w-12 justify-between items-center bg-dark bg-opacity-40 flex flex-wrap duration-300 xl:ml-auto xl:mr-20">
                                    <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                    <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                    <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-light duration-300'></div>
                                </button>}
                                {   
                                    changeOpen === entry.id &&
                                    <div className='flex flex-col lg:flex-row lg:flex-wrap h-full text-xs lg:text-base'>
                                        <button className='lg:px-3 h-6 lg:h-8 rounded-full opacity-40 bg-dark lg:mx-4 group-hover:bg-light group-hover:opacity-40 group-hover:text-dark duration-300 hover:!opacity-70' onClick={() => handleSideBarOpen("edit", entry.id)}>Edit</button>
                                        <button className='lg:px-2 h-6 lg:h-8 rounded-full opacity-40 bg-dark group-hover:bg-light group-hover:opacity-40 group-hover:text-dark duration-300 hover:!opacity-70' onClick={() => handleSideBarOpen("remove", entry.id)}>Delete</button>
                                        <button onClick={() => handleChangeOpen(entry.id)}>
                                            <CloseIcon className='mx-3 fill-light opacity-30 hover:opacity-70 w-1/8 h-1/8 transition duration-300'/>
                                        </button>
                                    </div> 
                                }
                            </div>}
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