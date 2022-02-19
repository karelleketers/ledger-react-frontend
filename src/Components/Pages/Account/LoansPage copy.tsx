import { Formik, Form, Field } from 'formik';
import { TextFieldError, SelectField, Button } from './../../Components';
import * as yup from 'yup';

import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_LOANS } from '../../../GraphQL/Queries'
import { SET_LOAN, DELETE_LOAN, EDIT_LOAN } from '../../../GraphQL/Mutations';

interface OutLoan {
    id: number,
    invite: string,
    amount: number
    paid: boolean
    owed: boolean | null,
    reason: string
}

interface InLoan {
    id: number,
    inviteName: string,
    inviteEmail: string,
    owed: boolean,
    loan: {
        id: number,
        amount: number
        paid: boolean
        reason: string
    }
}

const validationSchema = yup.object({})

const selectionOptions = [
    { value: "edit", label: "edit" },
    { value: "remove", label: "remove" }
]

export const LoansPage = () => {
    const {data: queryData} = useQuery(LOAD_LOANS);

    const [addLoan] = useMutation(SET_LOAN);
    const [loanRemoveMut] = useMutation(DELETE_LOAN);
    const [editLoan] = useMutation(EDIT_LOAN);


    const [changeOpen, setChangeOpen] = useState(0);
    const [selectedOpen, setSelectedOpen] = useState({selected: "", id: -1});

    const [editOpen, setEditOpen] = useState(0);
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeLoan, setRemoveLoan] = useState(false)
    const [loans, setLoans] = useState<OutLoan>({
        id: 0,
        invite: "",
        amount: 0,
        paid: false,
        owed: null,
        reason: ""
    });

    const [loanEdit, setLoanEdit] = useState<OutLoan>({
        id: 0,
        invite: "",
        amount: 0,
        paid: false,
        owed: null,
        reason: ""
    });

    const addNewLoan = () => {
        addLoan({
            variables: {
                invite: loans.invite,
                amount: loans.amount * 100,
                paid: loans.paid,
                owed: loans.owed,
                reason: loans.reason
            }
        });
    }

    const editLoanMut = () => {
        editLoan({
            variables: {
                id: loanEdit.id,
                invite: loanEdit.invite,
                amount: loanEdit.amount * 100,
                paid: loanEdit.paid,
                owed: loanEdit.owed,
                reason: loanEdit.reason
            }
        });
    }

    const removeLoanMut = (id: number) => {
        loanRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    const handleChangeOpen = (e: any, id: number) => {
        e.preventDefault();
        const idOpen = changeOpen === id ? 0 : id;
        setChangeOpen(idOpen);
        setLoanEdit({
            id: 0,
            invite: "",
            amount: 0,
            paid: false,
            owed: null,
            reason: ""
        })
        setRemoveLoan(false);
    }

    const handleChangeSelection = (e: any, loan: InLoan) => {
        e.preventDefault();
        if (e.target.value === "edit") {
            setEditOpen(loan.id);
            setLoanEdit({
                ...loanEdit,
                id: loan.loan.id,
                invite: loan.inviteEmail,
                amount: loan.loan.amount/100,
                paid: loan.loan.paid,
                owed: loan.owed,
                reason: loan.loan.reason
            })
        } else {
            setEditOpen(0);
            setLoanEdit({
                ...loanEdit,
                invite: "",
                amount: 0,
                paid: false,
                owed: null,
                reason: "",
            })
        }
        if (e.target.value === "delete") {
            setRemoveOpen(loan.id);
        } else {
            setRemoveOpen(0);
        }
    }

    const handleRemoveLoan = (e: any, id: number) => {
        if (removeLoan) {
            removeLoanMut(id)
        }
    }

    return (
        <div className="border border-yellow-300">
            <h2 className="text-yellow-700 text-2xl">Loans<span className="text-base">(entries adjust when settled)</span></h2>
            <Formik
            enableReinitialize
            initialValues={{
                name: "",
                total: 0,
                hidden: false,
            }}
            onSubmit={(values, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                console.log(values);
                resetForm({})
                setSubmitting(false);
            }}
            >
            {({ isSubmitting }) => (
                <Form>
                    <h3 className="text-blue-500 text-xl">Add a new loan</h3>
                    <Field name="name" type="text" label="Name:" placeholder="name" as={TextFieldError}/>
                    <Field name="total" type="text" label="Total:" placeholder="total for category?" as={TextFieldError}/>
                    <div id="owe-group">Owed?</div>
                        <div role="group" aria-labelledby='owe-group'>
                            <label>
                                <Field name="owed" type="radio" value="false"/>
                                TO
                            </label>
                            <label>
                                <Field name="owed" type="radio" value="true"/>
                                FROM
                            </label>
                        </div>
                    <div id="settled-group">Settled?</div>
                    <div role="group" aria-labelledby='settled-group'>
                        <label>
                            <Field name="paid" type="radio" value="false"/>
                            SETTLED
                        </label>
                        <label>
                            <Field name="paid" type="radio" value="true"/>
                            UNSETTLED
                        </label>
                    </div>
                    <Button disabled={isSubmitting} type="submit" content="Save"/>
                </Form>
            )}
            </Formik>
            <form>
                <label>Amount:</label>
                <input type="text"
                placeholder="amount"
                onChange={(e) => {
                    setLoans({
                        ...loans,
                        amount: parseFloat((e.target.value).replace(',', '.'))
                    });
                }}
                />
                <label>Who?</label>
                <input type="text"
                placeholder="add someone by email"
                onChange={(e) => {
                    setLoans({
                        ...loans,
                        invite: e.target.value
                    });
                }}
                />
                <label>Reason:</label>
                <input type="text"
                placeholder="reason for loan"
                onChange={(e) => {
                    setLoans({
                        ...loans,
                        reason: e.target.value
                    });
                }}
                />
                <button className="border border-green-400" onClick={addNewLoan}>Save</button>
            </form>
            <ul>
            {queryData && queryData.getLoans.map((inLoan: InLoan) => {
                return (
                <li className="border border-yellow-400" key={inLoan.id}>
                    <div>
                    <p>who: {inLoan.inviteName}</p>
                    <p>owed: {(inLoan.owed).toString()}</p>
                    { editOpen !== inLoan.id &&
                        <>
                        <p>amount: {(inLoan.loan.amount/100).toFixed(2).replace('.', ',')}</p>
                        <p>paid: {(inLoan.loan.paid).toString()}</p>
                        <p>reason: {inLoan.loan.reason}</p>
                        </>}
                        {
                        editOpen === inLoan.id &&
                        <form>
                            <label>amount:</label>
                            <input type="text" placeholder={(inLoan.loan.amount/100).toFixed(2).replace('.', ',')} onChange={(e) => {
                            setLoanEdit({
                                ...loanEdit,
                                amount: parseFloat((e.target.value).replace(',', '.'))
                                });
                            }}/>
                            <label>paid:</label>
                            <div>
                                <input type="radio" name="editpaid" value="true" onChange={(e) => {
                                setLoanEdit({
                                    ...loanEdit,
                                    paid: true
                                });
                                }}/> yes
                                <input type="radio" name="editpaid" value="false" onChange={(e) => {
                                setLoanEdit({
                                    ...loanEdit,
                                    paid: false
                                });
                                }}/> no
                            </div>
                            <label>reason:</label>
                            <input type="text" placeholder={(inLoan.loan.reason)?.toString()} onChange={(e) => {
                            setLoanEdit({
                                ...loanEdit,
                                reason: e.target.value
                                });
                            }}/>
                            <button onClick={editLoanMut}>SAVE</button>
                        </form>
                        }
                        {removeOpen === inLoan.id && 
                        <form>
                            <p>Are you sure you want to remove this loan?</p>
                            <input type="radio" onChange={() => setRemoveLoan(false)}/> no
                            <input type="radio" onChange={() => setRemoveLoan(true)}/> yes
                            <button onClick={(e) => handleRemoveLoan(e, inLoan.loan.id)}>confirm</button>
                        </form>
                        }
                    </div>
                    <div>
                        <button onClick={(e) => handleChangeOpen(e, inLoan.id)} className="border border-green-400">change</button>
                        {
                            changeOpen === inLoan.id && 
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    selected: null
                                }}
                                onSubmit={() => {}}
                                >
                                    {() => (
                                        <Form>
                                            <SelectField name="selection" id={inLoan.id} options={selectionOptions} setSelectedOpen={setSelectedOpen}/>
                                        </Form>
                                    )}

                                </Formik>
                        }
                    </div>
                </li>)
                })}
            </ul>
        </div>
    )
}