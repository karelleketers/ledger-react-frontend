import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_LOANS } from '../../../GraphQL/Queries'
import { SET_LOAN, DELETE_LOAN, EDIT_LOAN } from '../../../GraphQL/Mutations';

interface OutLoan {
    id: number,
    invite: string,
    amount: number | null
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
        amount: number | null
        paid: boolean
        reason: string
    }
}

export const LoansPage = () => {
    const {data: queryData} = useQuery(LOAD_LOANS);
    const [addLoan] = useMutation(SET_LOAN);
    const [loanRemoveMut] = useMutation(DELETE_LOAN);
    const [editLoan] = useMutation(EDIT_LOAN);
    const [changeOpen, setChangeOpen] = useState(0);
    const [editOpen, setEditOpen] = useState(0);
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeLoan, setRemoveLoan] = useState(false)
    const [loans, setLoans] = useState<OutLoan>({
        id: 0,
        invite: "",
        amount: null,
        paid: false,
        owed: null,
        reason: ""
    });

    const [loanEdit, setLoanEdit] = useState<OutLoan>({
        id: 0,
        invite: "",
        amount: null,
        paid: false,
        owed: null,
        reason: ""
    });

    const addNewLoan = (e: any) => {
        e.preventDefault()
        addLoan({
            variables: {
                invite: loans.invite,
                amount: loans.amount,
                paid: loans.paid,
                owed: loans.owed,
                reason: loans.reason
            }
        });
    }

    const editLoanMut = (e: any) => {
        e.preventDefault()
        editLoan({
            variables: {
                id: loanEdit.id,
                invite: loanEdit.invite,
                amount: loanEdit.amount,
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
            amount: null,
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
                amount: loan.loan.amount,
                paid: loan.loan.paid,
                owed: loan.owed,
                reason: loan.loan.reason
            })
        } else {
            setEditOpen(0);
            setLoanEdit({
                ...loanEdit,
                invite: "",
                amount: null,
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
        e.preventDefault();
        if (removeLoan) {
            removeLoanMut(id)
        }
    }

    return (
        <div className="border border-yellow-300">
            <h2 className="text-yellow-700 text-2xl">Loans<span className="text-base">(entries adjust when settled)</span></h2>
            <form>
                <h3 className="text-yellow-500 text-xl">Add a new loan</h3>
                <label>
                    <input type="radio" value="true" onChange={(e) => {
                    setLoans({
                        ...loans,
                        owed: true
                    });
                }}/>
                    FROM
                </label>
                <label>
                    <input type="radio" value="false" onChange={(e) => {
                    setLoans({
                        ...loans,
                        owed: false
                    });
                }}/>
                    TO
                </label>
                <label>
                    <input type="radio" value="paid" onChange={(e) => {
                    setLoans({
                        ...loans,
                        paid: true
                    });
                }}/>
                    PAID
                </label>
                <label>
                    <input type="radio" value="unpaid" onChange={(e) => {
                    setLoans({
                        ...loans,
                        paid: false
                    });
                }}/>
                    UNPAID
                </label>
                <label>Amount:</label>
                <input type="text"
                placeholder="amount"
                onChange={(e) => {
                    setLoans({
                        ...loans,
                        amount: parseInt(e.target.value)
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
                        <p>amount: {inLoan.loan.amount}</p>
                        <p>paid: {(inLoan.loan.paid).toString()}</p>
                        <p>reason: {inLoan.loan.reason}</p>
                        </>}
                        {
                        editOpen === inLoan.id &&
                        <>
                            <label>amount:</label>
                            <input type="text" placeholder={(inLoan.loan.amount)?.toString()} onChange={(e) => {
                            setLoanEdit({
                                ...loanEdit,
                                amount: parseInt(e.target.value)
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
                        </>
                        }
                        {removeOpen === inLoan.id && 
                        <>
                            <p>Are you sure you want to remove this loan?</p>
                            <input type="radio" onChange={() => setRemoveLoan(false)}/> no
                            <input type="radio" onChange={() => setRemoveLoan(true)}/> yes
                            <button onClick={(e) => handleRemoveLoan(e, inLoan.loan.id)}>confirm</button>
                        </>
                        }
                    </div>
                    <div>
                        <button onClick={(e) => handleChangeOpen(e, inLoan.id)} className="border border-green-400">change</button>
                        {
                            changeOpen === inLoan.id && 
                            <select onChange={(e: any) => handleChangeSelection(e, inLoan)}>
                                <option value="">--choose--</option>
                                <option value="edit">EDIT</option>
                                <option value="delete">DELETE</option>
                            </select>
                        }
                    </div>
                </li>)
                })}
            </ul>
        </div>
    )
}