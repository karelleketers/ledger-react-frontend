import React, {useEffect, useState} from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_SAVINGSBALANCE, LOAD_SAVINGS } from '../../../GraphQL/Queries';
import { SET_SAVINGS, SET_MONTHLY_SAVINGS, DELETE_SAVINGS, EDIT_SAVINGS, ADJUST_SAVINGS_BALANCE, ASSIGN_SAVINGS} from '../../../GraphQL/Mutations';

interface Savings {
    id: number,
    name: string,
    saved: number, 
    goal: number,
    goal_date: string,
    amount: number,
    type: string
}

interface SavingsBalance {
    id?: null | number,
    total?: null | number,
    unassigned?: null | number,
    monthly_savings: string,
}

export const SavingsPage = () => {
    const {data: balanceData} = useQuery(LOAD_SAVINGSBALANCE);
    const {data: savingsData} = useQuery(LOAD_SAVINGS); //make more efficient
    const [addSavings] = useMutation(SET_SAVINGS);
    const [addMonthlySavings] = useMutation(SET_MONTHLY_SAVINGS);
    const [savingsRemoveMut] = useMutation(DELETE_SAVINGS);
    const [editSavings] = useMutation(EDIT_SAVINGS);
    const [adjustSavings] = useMutation(ADJUST_SAVINGS_BALANCE);
    const [assignSavings] = useMutation(ASSIGN_SAVINGS);
    const savingGoalsList: {name: string, id: number}[] = []
    const [changeOpen, setChangeOpen] = useState(0);
    const [editOpen, setEditOpen] = useState(0);
    const [savingsOpen, setSavingsOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [savingsAdjustment, setSavingsAdjustment] = useState({amount: 0, incoming: true})
    const [savingsAssignment, setSavingsAssignment] = useState({amount: 0, incoming: true, savingsId: 0})
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeSavings, setRemoveSavings] = useState(false)
    const [savings, setSavings] = useState<Savings>({
        id: 0,
        name: "",
        saved: 0, 
        goal: 0,
        goal_date: "",
        amount: 0,
        type: "amount"
    });
    const [balance, setBalance] = useState<SavingsBalance>({
        total: null,
        unassigned: null,
        monthly_savings: "",
    });
    const [selectedAmount, setSelectedAmount] = useState("");
    const [selectedSavings, setSelectedSavings] = useState("amount");
    const [selectedSavingsEdit, setSelectedSavingsEdit] = useState("");
    const [savingsEdit, setSavingsEdit] = useState<Savings>({
        id: 0,
        name: "",
        saved: 0, 
        goal: 0,
        goal_date: "",
        amount: 0,
        type: ""
    });

    const handleOnOptionChange = (e : any) => {
        setSelectedAmount(e.target.value);
        if (e.target.value === "all") {setBalance({...balance, monthly_savings: "all"})}
      };

    useEffect(() => {
        if (balanceData) {
            setBalance(balanceData.getSavingsBalance);
            if (balanceData.getSavingsBalance.monthly_savings === "all") {
                setSelectedAmount("all");
            } else {
                setSelectedAmount("amount");
            }
        }
    }, [balanceData, savingsData]);

    const addNewMonthlySavings = (e: any) => {
        e.preventDefault()
        addMonthlySavings({
            variables: {
                monthly_savings: balance.monthly_savings,
            }
        });
    }
    const addNewSavings = (e: any) => {
        e.preventDefault()
        const d = savings.goal_date ? new Date(savings.goal_date) : null
        addSavings({
            variables: {
                name: savings.name,
                goal: savings.goal,
                goal_date: d,
                amount: savings.amount,
                type: savings.type
            }
        });
    }

    const editSavingsMut = (e: any) => {
        e.preventDefault()
        const d = savingsEdit.goal_date ? new Date(savingsEdit.goal_date) : null
        editSavings({
            variables: {
                id: savingsEdit.id,
                name: savingsEdit.name,
                goal: savingsEdit.goal,
                goal_date: d,
                amount: savingsEdit.amount,
                type: savingsEdit.type
            }
        });
    }

    const removeSavingsMut = (id: number) => {
        savingsRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    const handleChangeOpen = (e: any, id: number) => {
        e.preventDefault();
        const idOpen = changeOpen === id ? 0 : id;
        setChangeOpen(idOpen);
        setSavingsEdit({
            id: 0,
            name: "",
            saved: 0, 
            goal: 0,
            goal_date: "",
            amount: 0,
            type: ""
        })
        setRemoveSavings(false);
    }

    const handleChangeSelection = (e: any, savings_change: Savings) => {
        e.preventDefault();
        if (e.target.value === "edit") {
            setEditOpen(savings_change.id);
            setSelectedSavingsEdit(savings_change.type)
            setSavingsEdit({
                ...savingsEdit,
                id: savings_change.id,
                name: savings_change.name,
                saved: savings_change.saved, 
                goal: savings_change.goal,
                goal_date: savings_change.goal_date,
                amount: savings_change.amount,
                type: savings_change.type
            })
        } else {
            setEditOpen(0);
            setSavingsEdit({
                ...savingsEdit,
                id: 0,
                name: "",
                saved: 0, 
                goal: 0,
                goal_date: "",
                amount: 0,
                type: ""
            })
        }
        if (e.target.value === "delete") {
            setRemoveOpen(savings_change.id);
        } else {
            setRemoveOpen(0);
        }
    }

    const handleRemoveSavings = (e: any, id: number) => {
        e.preventDefault();
        if (removeSavings) {
            removeSavingsMut(id)
        }
    }

    const handleSavingsAdjustments =(e: any) => {
        e.preventDefault();
        adjustSavings({
            variables: {
                incoming: savingsAdjustment.incoming,
                amount: savingsAdjustment.amount
            }
        });
    }

    const handleSavingsAssignments =(e: any) => {
        e.preventDefault();
        assignSavings({
            variables: {
                incoming: savingsAssignment.incoming,
                amount: savingsAssignment.amount,
                savingsId: savingsAssignment.savingsId,
            }
        });
        console.log(savingsAssignment);
    }

    const savingGoals = savingsData && savingsData.getAllSavings.map((savings: Savings) => {
        const months = Math.ceil((savings.goal - savings.saved)/savings.amount);
        savingGoalsList.push({name: savings.name, id: savings.id})
        return (
        <li className="border-2 border-blue-300" key={savings.id}>
            <div>
            <p>name: {savings.name}</p>
            <p>saved: {savings.saved}</p>
            {editOpen !== savings.id &&
            <>
                <p>goal: {savings.goal}</p>
                <p>goalDate: {savings.goal_date && new Date(savings.goal_date).toDateString()}</p>
                <p>type: {savings.type}</p>
                <p>Monthly amount: {savings.amount}</p>
            </>}
            {editOpen === savings.id &&
                <>
                    <label>goal:</label>
                    <input type="text" placeholder={(savings.goal)?.toString()} onChange={(e) => {
                    setSavingsEdit({
                        ...savingsEdit,
                        goal: parseInt(e.target.value)
                        });
                    }}/>
                    <label>goalDate:</label>
                    <input type="text" placeholder={savings.goal_date && new Date(savings.goal_date).toDateString()} onChange={(e) => {
                    setSavingsEdit({
                        ...savingsEdit,
                        goal_date: e.target.value
                        });
                    }}/>
                    <label>Select:</label>
                    <select value={selectedSavingsEdit} onChange={(e) => {
                            setSavingsEdit({
                                ...savingsEdit,
                                type: e.target.value
                            });
                            setSelectedSavingsEdit(e.target.value)
                        }}>
                        <option value="percentage">PERCENTAGE</option>
                        <option value="amount">AMOUNT</option>
                    </select>
                    <label>Monthly {selectedSavingsEdit}:</label>
                    <input type="text" placeholder={(savings.amount)?.toString()} onChange={(e) => {
                    setSavingsEdit({
                        ...savingsEdit,
                        amount: parseInt(e.target.value)
                        });
                    }}/>
                    <button onClick={editSavingsMut}>SAVE</button>
                </>
                }
            <p>{months ? `${months} more month${months > 0 ? "s" : ""} to go!` : "Done!"}</p>
            {removeOpen === savings.id && 
                <>
                    <p>Are you sure you want to remove this savings goal?</p>
                    <input type="radio" onChange={() => setRemoveSavings(false)}/> no
                    <input type="radio" onChange={() => setRemoveSavings(true)}/> yes
                    <button onClick={(e) => handleRemoveSavings(e, savings.id)}>confirm</button>
                </>
            }
            </div>
            <div>
                <button onClick={(e) => handleChangeOpen(e, savings.id)} className="border border-green-400">change</button>
                {
                    changeOpen === savings.id && 
                    <select onChange={(e: any) => handleChangeSelection(e, savings)}>
                        <option value="">--choose--</option>
                        <option value="edit">EDIT</option>
                        <option value="delete">DELETE</option>
                    </select>
                }
            </div>
        </li>)
        })

    return (
        <>
        <div>
            <h2 className="text-4xl">You have {balance.total} money in your savings account</h2>
            <button onClick={(e) => {e.preventDefault(); setSavingsOpen(!savingsOpen)}} className="border-2 border-red-400">Add to Savings</button>
            {savingsOpen && 
            <>
            <label>Add to Savings</label>
            <input type="text" placeholder="fill in amount" onChange={(e) => {
                setSavingsAdjustment({
                    ...savingsAdjustment,
                    amount: parseInt(e.target.value)});
            }}/>
            <label>
                <input type="radio" value="true" onChange={(e) => {
                setSavingsAdjustment({
                    ...savingsAdjustment,
                    incoming: true
                });
                }}/>
                    incoming
            </label>
            <label>
                <input type="radio" value="false" onChange={(e) => {
                setSavingsAdjustment({
                    ...savingsAdjustment,
                    incoming: false
                });
            }}/>
                outgoing
            </label>
            <button onClick={handleSavingsAdjustments}>SAVE</button>
            </>}
            <h2 className="text-4xl">You have {balance.unassigned} unassigned money in your savings account</h2>
            <button onClick={(e) => {e.preventDefault(); setAssignOpen(!assignOpen)}} className="border-2 border-red-400">Assign Savings</button>
            {assignOpen && 
            <>
            <label>Assign</label>
            <input type="text" placeholder="fill in amount" onChange={(e) => {
                setSavingsAssignment({
                    ...savingsAssignment,
                    amount: parseInt(e.target.value)});
            }}/>
            <label>
                <input type="radio" value="true" onChange={(e) => {
                setSavingsAssignment({
                    ...savingsAssignment,
                    incoming: true
                });
                }}/>
                    TO
            </label>
            <label>
                <input type="radio" value="false" onChange={(e) => {
                setSavingsAssignment({
                    ...savingsAssignment,
                    incoming: false
                });
            }}/>
                FROM
            </label>
            <select onChange={(e) => setSavingsAssignment({
                ...savingsAssignment,
                savingsId: parseInt(e.target.value)
            })}>
                <option value="0">--choose--</option>
                {savingGoalsList.map(goal => {
                    return (
                        <option value={goal.id}>{goal.name}</option>
                    )
                })}
            </select>
            <button onClick={handleSavingsAssignments}>SAVE</button>
            </>}
            <p className="text-4xl">Monthly total Savings: {balance.monthly_savings}</p>
            <form className="border-2 border-blue-500">
                <h3 className="text-blue-400 text-xl">Change monthly saving amount <span className="text-base">(deducted from balance at start of new month)</span></h3>
                <label>select</label>
                <select value={selectedAmount} onChange={handleOnOptionChange}>
                    <option value="all">ALL</option>
                    <option value="amount">AMOUNT</option>
                </select>
                {selectedAmount === "amount" && 
                <>
                <label>Amount</label>
                <input type="text"
                placeholder="fill in amount"
                onChange={(e) => {
                    setBalance({
                        ...balance,
                        monthly_savings: (e.target.value).toString()
                    });
                }}
                />
                </>}
                <button className="border border-green-400" onClick={addNewMonthlySavings}>Save</button>
            </form>
        </div>
        <form>
        <h3 className="text-blue-700 text-2xl">Add a new saving goal <span className="text-base">(assigned at the start of each month)</span></h3>
            <label>select</label>
            <select value={selectedSavings} onChange={(e) => {
                    setSavings({
                        ...savings,
                        type: e.target.value
                    });
                    setSelectedSavings(e.target.value)
                }}>
                <option value="percentage">PERCENTAGE</option>
                <option value="amount">AMOUNT</option>
            </select>
            <label className="capitalize">{selectedSavings}</label>
            <input type="text"
            placeholder={`fill in ${selectedSavings}`}
            onChange={(e) => {
                setSavings({
                    ...savings,
                    amount: parseInt(e.target.value)
                });
            }}
            />
            <label>Savings Name</label>
            <input type="text"
            placeholder="add a name for your savings goal" //gives category options!
            onChange={(e) => {
                setSavings({
                    ...savings,
                    name: e.target.value
                });
            }}
            />
            <label>Savings goal</label>
            <input type="text"
            placeholder="give in the total amount you'd like to save"
            onChange={(e) => {
                setSavings({
                    ...savings,
                    goal: parseInt(e.target.value)
                });
            }}
            />
            <label>Goal Date</label>
            <input type="text"
            placeholder="when would you like to be finished?"
            onChange={(e) => {
                setSavings({
                    ...savings,
                    goal_date: e.target.value
                });
            }}
            />
            <button className="border border-green-400" onClick={addNewSavings}>Save</button>
        </form>
        <h3 className="text-blue-600 text-2xl">Saving goals</h3>
        <ul>
            {savingGoals}
        </ul>
        </>
        
    )
} 
