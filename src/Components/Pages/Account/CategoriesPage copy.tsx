import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { SET_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY } from "../../../GraphQL/Mutations";
import { LOAD_CATEGORIES, LOAD_CATEGORY_ICONS } from "../../../GraphQL/Queries";

interface Category {
    id: number,
    name: string,
    current: number, 
    total: number,
    hidden: boolean,
    categoryIconId?: null | number,
    iconName: string,
    categoryIcon?: { name: string },
}

interface CategoryEdit {
    id: number,
    name: string,
    current: number, 
    total: number,
    hidden: boolean,
    categoryIconId?: null | number,
    categoryIcon: { name: string },
}

interface CategoryIcon {
    id?: null | number,
    name: string,
}

export const CategoriesPage = () => {
    const {data: queryData} = useQuery(LOAD_CATEGORIES); //make more efficient
    const {data : iconData} = useQuery(LOAD_CATEGORY_ICONS);
    const [addCategory] = useMutation(SET_CATEGORY);
    const [categoryRemoveMut] = useMutation(DELETE_CATEGORY);
    const [editCategory] = useMutation(EDIT_CATEGORY);
    const [changeOpen, setChangeOpen] = useState(0);
    const [editOpen, setEditOpen] = useState(0);
    const [removeOpen, setRemoveOpen] = useState(0);
    const [removeCategory, setRemoveCategory] = useState(false)
    const [category, setCategory] = useState<Category>({
        id: 0,
        name: "",
        current: 0,
        total: 0,
        hidden: false,
        categoryIconId: null,
        iconName: "food"
    })
    const [iconsVisible, setIconsVisible] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState<CategoryEdit>({
        id: 0,
        name: "",
        current: 0,
        total: 0,
        hidden: false,
        categoryIconId: null,
        categoryIcon: {name: ""}
    });

    const addNewCategory = (e: any) => {
        addCategory({
            variables: {
                name: category.name,
                total: category.total * 100,
                current: category.total * 100,
                hidden: category.hidden,
                categoryIconId: category.categoryIconId
            }
        });
    }

    const editCategoryMut = (e: any) => {
        editCategory({
            variables: {
                id: categoryEdit.id,
                name: categoryEdit.name,
                total: categoryEdit.total * 100,
                current: categoryEdit.current * 100,
                hidden: categoryEdit.hidden,
                categoryIconId: categoryEdit.categoryIconId
            }
        });
    }

    const removeCategoryMut = (id: number) => {
        categoryRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    const handleChangeOpen = (e: any, catId: number) => {
        e.preventDefault();
        const id = changeOpen === catId ? 0 : catId;
        setChangeOpen(id);
        setCategoryEdit({
            id: id,
            name: "",
            current: 0,
            total: 0,
            hidden: false,
            categoryIconId: null,
            categoryIcon: {name: ""}
        })
        setRemoveCategory(false);
    }

    const handleChangeSelection = (e: any, category: CategoryEdit) => {
        e.preventDefault();
        if (e.target.value === "edit") {
            setEditOpen(category.id);
            setCategoryEdit({
                ...categoryEdit,
                id: category.id,
                name: category.name,
                current: (category.current/100),
                total: (category.total/100),
                hidden: category.hidden,
                categoryIconId: category.categoryIconId,
                categoryIcon: {name: category.categoryIcon.name},
            })
        } else {
            setEditOpen(0);
            setCategoryEdit({
                id: 0,
                name: "",
                current: 0,
                total: 0,
                hidden: false,
                categoryIconId: null,
                categoryIcon: {name: ""}
            })
        }
        if (e.target.value === "delete") {
            setRemoveOpen(category.id);
        } else {
            setRemoveOpen(0);
        }
    }

    const handleRemoveBill = (e: any, id: number) => {
        if (removeCategory) {
            removeCategoryMut(id)
        }
    }

    const handleIconPicked = (e: any, id: number, name: string) => {
        e.preventDefault();
        setCategory({
            ...category,
            categoryIconId: id,
            iconName: name,
        });
        setIconsVisible(false);
    }

    const handleIconEdited = (e: any, id: number, name: string) => {
        e.preventDefault();
        setCategoryEdit({
            ...categoryEdit,
            categoryIconId: id,
            categoryIcon: {name: name},
        });
        setIconsVisible(false);
    }

    return (
        <div className="border-2 border-indigo-600">
        <h2 className="text-green-400 text-2xl">Categories<span className="text-base">(adjusts when picked with entry)</span></h2>
            <ul>
                {queryData && queryData.getCategories.map((category: CategoryEdit) => {
                    return (
                    <li className="border border-green-800" key={category.id}>
                        <div>
                        {editOpen !== category.id && <>
                            <p>name: {category.name}</p>
                            <p>current: {(category.current/100).toFixed(2).replace('.', ',')}</p>
                            <p>total: {(category.total/100).toFixed(2).replace('.', ',')}</p>
                            <p>hidden: {(category.hidden).toString()}</p>
                            <div className="w-1/20 h-1/20 p-3 border-2 border-gray-600">
                                <img className="h-full w-auto" src={require(`./../../../assets/images/${category.categoryIcon && category.categoryIcon.name}.svg`).default} alt={category.categoryIcon && category.categoryIcon.name}/>
                            </div>
                        </>}
                        {editOpen === category.id && <form>
                            <label>name:</label>
                            <input type="text" placeholder={category.name} onChange={(e) => {
                            setCategoryEdit({
                                ...categoryEdit,
                                name: e.target.value
                            });
                            }}/>
                            <label>amount:</label>
                            <input type="text" placeholder={(category.total/100).toFixed(2).replace('.', ',')} onChange={(e) => {
                            setCategoryEdit({
                                ...categoryEdit,
                                total: parseFloat((e.target.value).replace(',', '.'))
                            });
                            }}/>
                            <label>current:</label>
                            <input type="text" placeholder={(category.current/100).toFixed(2).replace('.', ',')} onChange={(e) => {
                            setCategoryEdit({
                                ...categoryEdit,
                                current: parseFloat((e.target.value).replace(',', '.'))
                            });
                            }}/>
                            <label>hidden:</label>
                            <div>
                                <input type="radio" name="hidecat" value="true" onChange={(e) => {
                            setCategoryEdit({
                                ...categoryEdit,
                                hidden: true
                            });
                            }}/> yes
                                <input type="radio" name="hidecat" value="false" onChange={(e) => {
                            setCategoryEdit({
                                ...categoryEdit,
                                hidden: false
                            });
                            }}/> no
                            </div>
                            <div>
                                <button onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>Pick an icon</button>
                                {!iconsVisible && <button className="w-1/20 h-1/20 p-3 border-2 border-gray-600 block" onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}><img src={require(`./../../../assets/images/${categoryEdit.categoryIcon.name}.svg`).default} alt={categoryEdit.categoryIcon.name} /></button>}
                                {iconsVisible && <ul className="flex flex-wrap w-1/5 border-2 border-gray-600">
                                    {iconData && iconData.categoryIcons.map((icon: CategoryIcon) => {
                                        return (<li className="h-1/20 w-1/20 p-3 border border-gray-100" key={icon.id}><button className="h-full w-auto m-auto" onClick={(e) => {icon.id && handleIconEdited(e, icon.id, icon.name)}}><img className="h-full w-full" src={require(`./../../../assets/images/${icon.name}.svg`).default} alt={icon.name}/></button></li>)
                                    })}
                                </ul>}
                            </div>
                            <button onClick={editCategoryMut}>SAVE</button>     
                        </form>} {removeOpen === category.id && 
                            <form>
                                <p>Are you sure you want to remove this category?</p>
                                <input type="radio" onChange={() => setRemoveCategory(false)}/> no
                                <input type="radio" onChange={() => setRemoveCategory(true)}/> yes
                                <button onClick={(e) => handleRemoveBill(e, category.id)}>confirm</button>
                            </form>
                        }
                        </div>
                        <div>
                            <button onClick={(e) => handleChangeOpen(e, category.id)} className="border border-green-400">change</button>
                            {
                                changeOpen === category.id && 
                                <select onChange={(e: any) => handleChangeSelection(e, category)}>
                                    <option value="">--choose--</option>
                                    <option value="edit">EDIT</option>
                                    <option value="delete">DELETE</option>
                                </select>
                            }
                        </div> 
                    </li>)
                    })}
            </ul>
            <form className="border-2 border-green-600">
                <h3 className="text-green-400 text-xl">Add a new category</h3>
                <label>Name:</label>
                <input type="text"
                placeholder="name"
                onChange={(e) => {
                    setCategory({
                        ...category,
                        name: e.target.value
                    });
                }}
                />
                <label>Total</label>
                <input type="text"
                placeholder="total for category?"
                onChange={(e) => {
                    setCategory({
                        ...category,
                        total: parseFloat((e.target.value).replace(',', '.'))
                    });
                }}
                />
                <label>
                    <input type="radio" value="visible" onChange={(e) => {
                    setCategory({
                        ...category,
                        hidden: false
                    });
                }}/>
                    visible
                </label>
                <label>
                    <input type="radio" value="hidden" onChange={(e) => {
                    setCategory({
                        ...category,
                        hidden: true
                    });
                }}/>
                    hidden
                </label>
                <div>
                    <button onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>Pick an icon</button>
                    {!iconsVisible && <button className="w-1/20 h-1/20 p-3 border-2 border-gray-600 block" onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}><img src={require(`./../../../assets/images/${category.iconName}.svg`).default} alt={category.iconName} /></button>}
                    {iconsVisible && <ul className="flex flex-wrap w-1/5 border-2 border-gray-600">
                        {iconData && iconData.categoryIcons.map((icon: CategoryIcon) => {
                            return (<li className="h-1/20 w-1/20 p-3 border border-gray-100" key={icon.id}><button className="h-full w-auto m-auto" onClick={(e) => {icon.id && handleIconPicked(e, icon.id, icon.name)}}><img className="h-full w-full" src={require(`./../../../assets/images/${icon.name}.svg`).default} alt={icon.name}/></button></li>)
                        })}
                    </ul>}
                </div>
                <button className="border border-green-300" onClick={addNewCategory}>Save</button>
            </form>
        </div>
    )
}

