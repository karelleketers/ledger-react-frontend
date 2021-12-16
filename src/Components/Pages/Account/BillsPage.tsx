import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_BILLS } from '../../../GraphQL/Queries'
import { SET_BILL, EDIT_BILL, DELETE_BILL } from '../../../GraphQL/Mutations';

interface Bill {
    id: number,
    name: string,
    amount: number | null
    paid: boolean
    reminder?: boolean | null,
}

interface BillsProps {
    profileReminder: boolean
}

export const BillsPage = ({profileReminder}: BillsProps) => {
    const {data: queryData} = useQuery(LOAD_BILLS);
    const unpaidBillsList: string[] = []
    const [addBill] = useMutation(SET_BILL);
    const [billRemoveMut] = useMutation(DELETE_BILL);
    const [editBill] = useMutation(EDIT_BILL);
    const [changeOpen, setChangeOpen] = useState(0);
    const [editOpen, setEditOpen] = useState(0);
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeBill, setRemoveBill] = useState(false)
    const [bill, setBill] = useState<Bill>({
        id: 0,
        name: "",
        amount: null,
        paid: true,
        reminder: null,
    });

    const [billEdit, setBillEdit] = useState<Bill>({
        id: 0,
        name: "",
        amount: null,
        paid: false,
    });

    const addNewBill = (e: any) => {
        e.preventDefault()
        addBill({
            variables: {
                name: bill.name,
                amount: bill.amount,
            }
        });
    }

    const editBillMut = (e: any) => {
        e.preventDefault()
        editBill({
            variables: {
                id: billEdit.id,
                name: billEdit.name,
                amount: billEdit.amount,
                paid: billEdit.paid,
            }
        });
    }

    const removeBillMut = (id: number) => {
        billRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    const handleChangeOpen = (e: any, billId: number) => {
        e.preventDefault();
        const id = changeOpen === billId ? 0 : billId;
        setChangeOpen(id);
        setBillEdit({
            id: id,
            amount: null,
            paid: false,
            name: "",
        })
        setRemoveBill(false);
    }

    const handleChangeSelection = (e: any, bill: Bill) => {
        e.preventDefault();
        if (e.target.value === "edit") {
            setEditOpen(bill.id);
            setBillEdit({
                ...billEdit,
                id: bill.id,
                name: bill.name,
                paid: bill.paid,
                amount: bill.amount
            })
        } else {
            setEditOpen(0);
            setBillEdit({
                id: 0,
                amount: null,
                paid: false,
                name: "",
            })
        }
        if (e.target.value === "delete") {
            setRemoveOpen(bill.id);
        } else {
            setRemoveOpen(0);
        }
    }

    const handleRemoveBill = (e: any, id: number) => {
        e.preventDefault();
        if (removeBill) {
            removeBillMut(id)
        }
    }

    const bills = queryData && queryData.getBills.map((bill: Bill, index: number) => {
        if (!bill.paid) {unpaidBillsList.push(bill.name)}
        return (
        <li className="border-2 border-red-400" key={bill.id}>
            <div>
                <p>name: {bill.name}</p>
                { editOpen !== bill.id  && 
                <>
                <p>amount: {bill.amount}</p>
                <p>paid: {(bill.paid).toString()}</p>
                </>}
                { editOpen === bill.id &&
                <>
                <label>amount:</label>
                <input type="text" placeholder={(bill.amount)?.toString()} onChange={(e) => {
                setBillEdit({
                    ...billEdit,
                    amount: parseInt(e.target.value)
                });
            }}/>
                <label>paid:</label>
                <div>
                    <input type="radio" name="editpaid" value="true" onChange={(e) => {
                setBillEdit({
                    ...billEdit,
                    paid: true
                });
                }}/> yes
                    <input type="radio" name="editpaid" value="false" onChange={(e) => {
                setBillEdit({
                    ...billEdit,
                    paid: false
                });
                }}/> no
                </div>
                <button onClick={editBillMut}>SAVE</button>
                </>}
                {removeOpen === bill.id && 
                    <>
                        <p>Are you sure you want to remove this bill?</p>
                        <input type="radio" onChange={() => setRemoveBill(false)}/> no
                        <input type="radio" onChange={() => setRemoveBill(true)}/> yes
                        <button onClick={(e) => handleRemoveBill(e, bill.id)}>confirm</button>
                    </>
                }
            </div>
            <div>
                <button onClick={(e) => handleChangeOpen(e, bill.id)} className="border border-green-400">change</button>
                {
                    changeOpen === bill.id && 
                    <select onChange={(e: any) => handleChangeSelection(e, bill)}>
                        <option value="">--choose--</option>
                        <option value="edit">EDIT</option>
                        <option value="delete">DELETE</option>
                    </select>
                }
            </div>
        </li>)
        })

    return (
        <div className="border-2 border-blue-700">
        <h2 className="text-blue-700 text-2xl">Bills <span className="text-base">(entries will adjust when bill is paid)</span></h2>
        <p>Do I want reminders: {(profileReminder).toString()}</p>
        <form className="border border-indigo-300">
            <h3 className="text-blue-500 text-xl">Add a Bill</h3>
            <label>Amount:</label>
            <input type="text"
            placeholder="amount"
            onChange={(e) => {
                setBill({
                    ...bill,
                    amount: parseInt(e.target.value)
                });
            }}
            />
            <label>For</label>
            <input type="text"
            placeholder="what's the bill for?"
            onChange={(e) => {
                setBill({
                    ...bill,
                    name: e.target.value
                });
            }}
            />
            <button className="border border-green-300" onClick={addNewBill}>Save</button>
        </form>
        <ul className="border-2 border-yellow-500">
            {bills}
        </ul>
        {profileReminder && unpaidBillsList.length &&<>
        <p>Unpaid Bills:</p>
        <p>{unpaidBillsList.map((bill: string, index: number) => {
            return (
                <li key={`${bill}-${index}`}>{bill}</li>
            )
        })}</p></>}
        </div>
    )}