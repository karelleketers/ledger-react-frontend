import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_CATEGORIES_LIST, LOAD_ENTRIES } from '../../../GraphQL/Queries'
import { SET_ENTRY, DELETE_ENTRY, EDIT_ENTRY } from '../../../GraphQL/Mutations';

interface Entries {
    id: number,
    incoming: boolean | null,
    amount: number | null
    category: string,
    description: string,
    type: string,
    categoryId? : number
}

interface Category {
    id: number | null,
    name: string, 
}

export const EntriesPage = () => {
    const {data: queryData} = useQuery(LOAD_ENTRIES);
    const {data: catData} = useQuery(LOAD_CATEGORIES_LIST); 
    const [entryRemoveMut] = useMutation(DELETE_ENTRY);
    const [editEntry] = useMutation(EDIT_ENTRY);
    const [changeOpen, setChangeOpen] = useState(0);
    const [editOpen, setEditOpen] = useState(0);
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeEntry, setRemoveEntry] = useState(false)

    const [addEntry] = useMutation(SET_ENTRY);
    const [entries, setEntries] = useState<Entries>({
        id: 0,
        incoming: null,
        amount: null,
        category: "",
        description: "",
        type: "",
        categoryId: 0,
    });

    const [entryEdit, setEntryEdit] = useState<Entries>({
        id: 0,
        incoming: null,
        amount: null,
        category: "",
        description: "",
        type: "",
        categoryId: 0,
    });

    const addNewEntry = (e: any) => {
        e.preventDefault()
        addEntry({
            variables: {
                incoming: entries.incoming,
                amount: entries.amount,
                category: entries.category,
                description: entries.description,
                type: entries.type,
                categoryId: entries.categoryId,
            }
        });
    }

    const editEntryMut = (e: any) => {
        e.preventDefault()
        editEntry({
            variables: {
                id: entryEdit.id,
                incoming: entryEdit.incoming,
                amount: entryEdit.amount,
                category: entryEdit.category,
                description: entryEdit.description,
                type: entryEdit.type,
            }
        });
        console.log(entryEdit)
    }

    const removeEntryMut = (id: number) => {
        entryRemoveMut({
            variables: {
                id: id,
            }
        });
        console.log(id)
    }

    const handleChangeOpen = (e: any, id: number) => {
        e.preventDefault();
        const idOpen = changeOpen === id ? 0 : id;
        setChangeOpen(idOpen);
        setEntryEdit({
            id: 0,
            incoming: null,
            amount: null,
            category: "",
            description: "",
            type: "",
            categoryId: 0,
        })
        setRemoveEntry(false);
    }

    const handleChangeSelection = (e: any, entry: Entries) => {
        e.preventDefault();
        if (e.target.value === "edit") {
            setEditOpen(entry.id);
            setEntryEdit({
                ...entryEdit,
                id: entry.id,
                incoming: entry.incoming,
                amount: entry.amount,
                category: entry.category,
                description: entry.description,
                type: entry.type,
                categoryId: entry.categoryId,
            })
        } else {
            setEditOpen(0);
            setEntryEdit({
                ...entryEdit,
                incoming: null,
                amount: null,
                category: "",
                description: "",
                type: "",
                categoryId: 0,
            })
        }
        if (e.target.value === "delete") {
            setRemoveOpen(entry.id);
        } else {
            setRemoveOpen(0);
        }
    }

    const handleRemoveEntry = (e: any, id: number) => {
        e.preventDefault();
        if (removeEntry) {
            removeEntryMut(id)
        }
    }

    return (
        <div className="border-2 border-pink-500">
            <h2 className="text-2xl text-pink-300">Entries <span className="text-base">(earnings and spendings)</span></h2>
            <form>
                <h3 className="text-pink-400 text-xl">Add an entry</h3>
                <label>
                    <input type="radio" value="incoming" onChange={(e) => {
                    setEntries({
                        ...entries,
                        incoming: true
                    });
                }}/>
                    incoming
                </label>
                <label>
                    <input type="radio" value="outgoing" onChange={(e) => {
                    setEntries({
                        ...entries,
                        incoming: false
                    });
                }}/>
                    outgoing
                </label>
                <label>Amount</label>
                <input type="text"
                placeholder="fill in amount"
                onChange={(e) => {
                    setEntries({
                        ...entries,
                        amount: parseInt(e.target.value)
                    });
                }}
                />
                {entries.incoming === false && <>
                <label>Category</label>
                <select className="uppercase" onChange={(e) => {
                    setEntries({
                        ...entries,
                        category: JSON.parse(e.target.value).category,
                        type: JSON.parse(e.target.value).type,
                        categoryId: JSON.parse(e.target.value).id,
                    });
                }}>
                    <option value={JSON.stringify({category: "", type: ""})}>--choose--</option>
                    {catData && catData.getCategories.map((cat: Category) => {
                        return (
                            <option value={JSON.stringify({category: cat.name, type: "category", id: cat.id})}>{cat.name}</option>
                        )
                    })}
                    <option value={JSON.stringify({category: "bills", type: "bills"})}>bills</option>
                    <option value={JSON.stringify({category: "loans", type: "loans"})}>loans</option>
                    <option value={JSON.stringify({category: "savings", type: "savings"})}>savings</option>
                    <option value={JSON.stringify({category: "other", type: "other"})}>other</option>
                </select>
                </>}
                { entries.category &&
                <>
                <label>Description</label>
                <input type="text"
                placeholder="give a description"
                onChange={(e) => {
                    setEntries({
                        ...entries,
                        description: e.target.value
                    });
                }}
                />
                </>}
                <button className="border border-green-400" onClick={addNewEntry}>Save</button>
            </form>
            <ul>
                {queryData && queryData.getEntries.map((entry: Entries) => {
                    return (
                    <li className="border-2 border-pink-200" key={entry.id}>
                        <div>
                        {editOpen !== entry.id &&
                        <>
                            <p>incoming: {entry.incoming && (entry.incoming).toString()}</p>
                            <p>amount: {entry.amount}</p>
                            <p>category: {entry.category}</p>
                            <p>description: {entry.description}</p>
                        </> }
                        {
                        editOpen === entry.id &&
                        <>
                            <label>amount:</label>
                            <input type="text" placeholder={(entry.amount)?.toString()} onChange={(e) => {
                            setEntryEdit({
                                ...entryEdit,
                                amount: parseInt(e.target.value)
                                });
                            }}/>
                            {entryEdit.incoming === false && <>
                                <label>Category</label>
                                <select className="uppercase" onChange={(e) => {
                                    setEntryEdit({
                                        ...entryEdit,
                                        category: JSON.parse(e.target.value).category,
                                        type: JSON.parse(e.target.value).type,
                                        categoryId: JSON.parse(e.target.value).id,
                                    });
                                }}>
                                    <option value={JSON.stringify({category: "", type: ""})}>--choose--</option>
                                    {catData && catData.getCategories.map((cat: Category) => {
                                        return (
                                            <option value={JSON.stringify({category: cat.name, type: "category", id: cat.id})}>{cat.name}</option>
                                        )
                                    })}
                                    <option value={JSON.stringify({category: "bills", type: "bills"})}>bills</option>
                                    <option value={JSON.stringify({category: "loans", type: "loans"})}>loans</option>
                                    <option value={JSON.stringify({category: "savings", type: "savings"})}>savings</option>
                                    <option value={JSON.stringify({category: "other", type: "other"})}>other</option>
                                </select>
                                </>}
                            {entryEdit.category &&
                                <>
                                <label>description:</label>
                                <input type="text" placeholder={entry.description} onChange={(e) => {
                                setEntryEdit({
                                    ...entryEdit,
                                    description: e.target.value
                                    });
                                }}/>
                                </>}
                            <button onClick={editEntryMut}>SAVE</button>
                        </>
                        }
                        {removeOpen === entry.id && 
                        <>
                            <p>Are you sure you want to remove this entry?</p>
                            <input type="radio" onChange={() => setRemoveEntry(false)}/> no
                            <input type="radio" onChange={() => setRemoveEntry(true)}/> yes
                            <button onClick={(e) => handleRemoveEntry(e, entry.id)}>confirm</button>
                        </>
                        }
                        </div>
                        <div>
                            <button onClick={(e) => handleChangeOpen(e, entry.id)} className="border border-green-400">change</button>
                            {
                                changeOpen === entry.id && 
                                <select onChange={(e: any) => handleChangeSelection(e, entry)}>
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