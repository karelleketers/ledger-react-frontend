import { Formik, Form, Field } from 'formik';
import { TextFieldError, Button, Header, SideBar } from './../../Components';
import * as yup from 'yup';

import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { SET_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY } from "../../../GraphQL/Mutations";
import { LOAD_CATEGORIES, LOAD_CATEGORY_ICONS } from "../../../GraphQL/Queries";
import {ReactComponent as AddIcon} from './../../../assets/images/add.svg';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import logo from './../../../assets/images/leder-grnwds.png';
import { Context } from '../../../App';

interface Category {
    count: number, 
    items: {
    id: number,
    name: string,
    current: number, 
    total: number,
    hidden: boolean | string,
    categoryIconId?: null | number,
    iconName?: string,
    categoryIcon: { name: string },
    updatedAt: Date
}}

interface CategoryEdit {
    id?: number,
    name: string,
    current: number, 
    total: number,
    hidden: boolean | string,
    categoryIconId?: null | number,
    categoryIcon: { name: string },
}

interface CategoryNew {
    name: string,
    total: number,
    hidden: boolean | string,
}

interface CategoryIcon {
    id?: null | number,
    name: string,
}


const validationAdd = yup.object({
    name: yup.string().max(32).required('Input is required'),
    total: yup.number().max(100000000).required('Input is required'),
    hidden: yup.string().required('Input is required'),
});

const validationAdjust = yup.object({
    name: yup.string().max(32).required('Input is required'),
    current: yup.number().max(100000000).required('Input is required'),
    total: yup.number().max(100000000).required('Input is required'),
    hidden: yup.string().required('Input is required'),
})


export const CategoriesPage = () => {
    const client = useApolloClient();
    const {navHovered, fromDashboard, setFromDashboard} = useContext(Context)
    
    //query for fetching categories data
    const {loading, data: queryData, fetchMore} = useQuery(LOAD_CATEGORIES, {
        variables: {
            offset: 0,
            limit: 10,
        }
    });
    const {data : iconData} = useQuery(LOAD_CATEGORY_ICONS);

    //mutations for adding new category, removing an existing category and editing an existing category, respectively 
    const [addCategory] = useMutation(SET_CATEGORY, {
        update(cache, {data: {addCategory} }) {
            cache.modify({
                fields: {
                    createCategory(existingCategories = []) {
                        const addCatRef = cache.writeFragment({
                            data: addCategory,
                            fragment: gql`
                                fragment createdCategory on Category {
                                    id,
                                    name,
                                    total,
                                    current,
                                    hidden,
                                    categoryIconId,
                                    categoryIcon {
                                        name
                                    }
                                }
                            `
                        });
                        return [...existingCategories, addCatRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [categoryRemoveMut] = useMutation(DELETE_CATEGORY, {
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });
    const [editCategory] = useMutation(EDIT_CATEGORY, {
        update(cache, {data: {adjustCategory} }) {
            cache.modify({
                fields: {
                    updateCategory(existingCategories = []) {
                        const adjustCatRef = cache.writeFragment({
                            data: adjustCategory,
                            fragment: gql`
                                fragment adjustedCategory on Category {
                                    id,
                                    name,
                                    total,
                                    hidden,
                                    categoryIconId,
                                    categoryIcon {
                                        name
                                    }
                                    current
                                }
                            `
                        });
                        return [...existingCategories, adjustCatRef];
                    }
                }
            });
        },
        onCompleted: async () => {
            await client.refetchQueries({include: "all"})
        }
    });

    //state for opening select form to edit/remove for category of specific id and state for editing/removing category of specific id
    const [changeOpen, setChangeOpen] = useState(0);
    const [selectedOpen, setSelectedOpen] = useState({selected: "", id: -1});
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [count, setCount] = useState(0);

    //icons 
    const [iconsVisible, setIconsVisible] = useState(false);
    const [iconPicked, setIconPicked] = useState({categoryIconId: 5, iconName: "barber"});
    const [iconEdited, setIconEdited] = useState({categoryIconId: -1, iconName: ""});

    //Get total count of bills and count of fetched bills to compare and disable load more button when needed
    useEffect(() => {
        queryData && setTotalCount(queryData.getCategories[0].count)
        queryData && setCount(queryData.getCategories[0].items.length);
    }, [queryData]);


    //mutation for new category being added
    const addNewCategory = (values: CategoryNew) => {
        addCategory({
            variables: {
                name: values.name,
                total: Math.round(values.total * 100),
                current: Math.round(values.total * 100),
                hidden: values.hidden === "true",
                categoryIconId: iconPicked.categoryIconId,
            }
        });
        setIconPicked({categoryIconId: 5, iconName: "barber"})
    }

    //mutation for category edit
    const editCategoryMut = (values: CategoryEdit) => {
        editCategory({
            variables: {
                id: values.id,
                name: values.name,
                total: Math.round(values.total * 100),
                current: Math.round(values.current * 100),
                hidden: values.hidden === "true",
                categoryIconId: iconEdited.categoryIconId,
                categoryIcon: { name: iconEdited.iconName }
            }
        });
        setIconEdited({categoryIconId: -1, iconName: ""})
    }

    //mutation for category removal
    const removeCategoryMut = (id: number) => {
        categoryRemoveMut({
            variables: {
                id: id,
            }
        });
    }

    //click once and you can select to edit/remove category based on id number, click again and the selection options disappear
    const handleChangeOpen = (catId: number) => {
        const id = changeOpen === catId ? 0 : catId;
        setChangeOpen(id);
        setIconEdited({categoryIconId: -1, iconName: ""});
        setSideBarOpen(false);
    };

    //Toggle sidebar open/close depending on action (edit, remove, add)
    const handleSideBarOpen = (action: string, id: number) => {
        setChangeOpen(0);
        setSideBarOpen(!sideBarOpen);
        action === "edit"? setSelectedOpen({selected: "edit", id: id}) : action === "remove" ? setSelectedOpen({selected: "remove", id: id}) : setSelectedOpen({selected: "add", id: id})
    }

    const handleIconPicked = (e: React.MouseEvent<HTMLElement>, id: number, name: string) => {
        e.preventDefault();
        setIconPicked({
            categoryIconId: id,
            iconName: name,
        });
        setIconsVisible(false);
    }

    const handleIconEdited = (e: React.MouseEvent<HTMLElement>, id: number, name: string) => {
        e.preventDefault();
        setIconEdited({
            categoryIconId: id,
            iconName: name,
        });
        setIconsVisible(false);
    }

    return (
        <div className={`w-full xl:w-main xl:ml-main-ext relative mx-4 md:mx-8 pb-24 xl:pb-0 ${navHovered && "xl:opacity-20"} ease-in-out duration-300`}>
            <Header />
            <div className='xl:hidden max-w-48 w-2/5 m-auto mt-8 mb-16'>
                <img src={logo} alt="logo" className='w-full'/>
            </div>
            <main className="py-4">
                <div className='flex flex-wrap items-center w-full my-4'>
                    <h4 className='font-leaguespartan text-xl xs:text-2xl xl:text-3xl xl:text-dark'>Categories</h4>
                    <button className="" onClick={() => handleSideBarOpen("add", -1)}>
                        <AddIcon className='mx-3 fill-ltgreen hover:fill-dark w-1/8 h-1/8 transition duration-200'/>
                    </button>
                </div>

                {/* Opens side bar when new bill is added */}
                {(selectedOpen.selected === "add" || fromDashboard ) &&
                <SideBar sideBarOpen={sideBarOpen} fromLocation={fromDashboard}>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        name: "",
                        total: 0,
                        hidden: false,
                    }}
                    validationSchema={validationAdd}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        addNewCategory(values);
                        resetForm({})
                        setSubmitting(false);
                        setSideBarOpen(false);
                    }}
                    >
                    {({ values, isSubmitting }) => (
                        <Form> 
                            <div className={`my-24 mx-4 text-dkgreen font-nunitobold ${iconsVisible ? "h-120" : "h-100"} flex flex-col justify-between items-start`}>
                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Add A New Category <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>Fill in details below</span></h3>
                                <Field name="name" type="text" label="Name " placeholder="name of category" as={TextFieldError}/>
                                <Field name="total" type="text" label="Total " placeholder="total amount of category" as={TextFieldError}/> 
                                <div id="hide-group">Would you like to hide this category?</div>
                                <div role="group" aria-labelledby='hide-group'>
                                    <label className='mx-2'>
                                        <Field name="hidden" type="radio" value="false"/>
                                        <span className='mx-2'>Yes</span>
                                    </label>
                                    <label className='mx-2'>
                                        <Field name="hidden" type="radio" value="true"/>
                                        <span className='mx-2'>No</span>
                                    </label>
                                </div>
                                <div>
                                    <button onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>Pick an icon</button>
                                    {!iconsVisible && <button className="w-18 h-18 p-3 border-2 border-gray-600 block" onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>
                                        <SVG className="w-full h-full relative" src={`../icons/${iconPicked.iconName}.svg`} />
                                    </button>}
                                    {iconsVisible && <ul className="box-content flex flex-wrap w-72 border-2 border-gray-600">
                                        {iconData && iconData.categoryIcons.map((icon: CategoryIcon) => {
                                            return (<li className="box-border h-18 w-18 p-3 border border-gray-100" key={icon.id}>
                                                        <button className="h-full w-full m-auto" onClick={(e) => {icon.id && handleIconPicked(e, icon.id, icon.name)}}>
                                                            <SVG className="w-full h-full relative" src={`../icons/${icon.name}.svg`} />
                                                        </button>
                                                    </li>)
                                        })}
                                    </ul>}
                                </div>
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

                {/* Shows list of bills history */}

                <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    {loading && <div>...Loading</div>}
                    {queryData && queryData.getCategories[0].items.map((category: Category["items"]) => {
                    return (
                    <li className='mx-auto md:mx-0 my-12 flex flex-wrap w-4/5' key={category.id}>
                         <div className='group w-3/5 flex flex-wrap'>
                            <div className={`${category.current === 0 && "opacity-40"} w-full p-6 rounded-l-2xl flex flex-wrap bg-mdgreen xl:bg-dkgreen hover:bg-ltgreen xl:hover:bg-dark hover:bg-opacity-80 duration-300`}>
                                <h4 className='first-letter:uppercase font-nunitobold text-2xl group-hover:text-light duration-300 mb-8 w-full'>{category.name}</h4>
                                <div className='w-full self-end'>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Remaining:</p>
                                        <p>{(category.current/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-gray-700 xl:text-gray-400 opacity-70'>Total:</p>
                                        <p>{(category.total/100).toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-between font-nunitoreg text-sm my-2'>
                                        <p className='text-xs text-gray-700 xl:text-gray-400 opacity-70'>Last Updated:</p>
                                        <p className='text-xs'>{moment(category.updatedAt).format("DD MMM YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                            
                            

                        {/* Opens side bar when existing bill is adjusted */}

                        {selectedOpen.selected === "edit" && selectedOpen.id === category.id &&
                            <SideBar sideBarOpen={sideBarOpen}>
                                <Formik
                                enableReinitialize
                                initialValues={{
                                    id: category.id,
                                    name: category.name,
                                    total: parseFloat((category.total/100).toFixed(2)),
                                    hidden: category.hidden,
                                    current: parseFloat((category.current/100).toFixed(2)),
                                    categoryIcon: { name: category.categoryIcon.name }
                                }}
                                validationSchema={validationAdjust}
                                onSubmit={(values, {setSubmitting, resetForm}) => {
                                    setSubmitting(true);
                                    editCategoryMut(values);
                                    setSelectedOpen({selected: "", id: -1})
                                    setChangeOpen(0)
                                    resetForm({})
                                    setSubmitting(false);
                                    setSideBarOpen(false);
                                }}
                                >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className={`my-24 mx-4 text-dkgreen font-nunitobold ${iconsVisible ? "h-120" : "h-100"} flex flex-col justify-between items-start`}>
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Adjust Bill</h3>
                                            <Field name="name" type="text" label="Name " placeholder="name of category" as={TextFieldError}/>
                                            <Field name="total" type="text" label="Total " placeholder="total amount of category" as={TextFieldError}/>
                                            <Field name="current" type="text" label="Remaining " placeholder="remaining amount of category" as={TextFieldError}/>
                                            <div id="hide-group">Would you like to hide this category?</div>
                                            <div role="group" aria-labelledby='hide-group'>
                                                <label className='mx-2'>
                                                    <Field name="hidden" type="radio" value="false"/>
                                                    <span className='mx-2'>Yes</span>
                                                </label>
                                                <label className='mx-2'>
                                                    <Field name="hidden" type="radio" value="true"/>
                                                    <span className='mx-2'>No</span>
                                                </label>
                                            </div>
                                            <button onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>Pick an icon</button>
                                            {!iconsVisible && <button className="w-18 h-18 p-3 border-2 border-gray-600 block" onClick={(e) => {e.preventDefault(); setIconsVisible(!iconsVisible)}}>
                                                <SVG className="w-full h-full relative" src={`../icons/${iconEdited.iconName || category.categoryIcon.name}.svg`} />
                                            </button>}
                                            {iconsVisible && <ul className="box-content flex flex-wrap w-72 border-2 border-gray-600">
                                                {iconData && iconData.categoryIcons.map((icon: CategoryIcon) => {
                                                    return (<li className="box-border h-18 w-18 p-3 border border-gray-100" key={icon.id}>
                                                                <button className="h-full w-full m-auto" onClick={(e) => {icon.id && handleIconEdited(e, icon.id, icon.name)}}>
                                                                    <SVG className="w-full h-full relative" src={`../icons/${icon.name}.svg`} />
                                                                </button>
                                                            </li>)
                                                })}
                                            </ul>}
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

                        {selectedOpen.selected === "remove" && selectedOpen.id === category.id && 
                        <SideBar sideBarOpen={sideBarOpen}>
                            <Formik
                            enableReinitialize
                            initialValues={{
                                id: category.id,
                                name: category.name,
                                removeCategory: ""
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                setSubmitting(true);
                                if (values.removeCategory === "true") {removeCategoryMut(values.id)}
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
                                            <h3 className="text-dark text-xl my-6 font-leaguespartan">Remove Category</h3>
                                            <p>Name of Bill <span className='capitalize text-mdgreen mx-4 font-nunitoblack'>{category.name}</span></p>
                                            <div id="remove-group" className=''>Would you like to remove this category from your account? <span className='font-nunitoreg text-sm text-dark opacity-40 italic'>This action is permanent</span></div>
                                            <div role="group" aria-labelledby='remove-group'>
                                                <label className='mx-2'>
                                                    <Field name="removeCategory" type="radio" value="false"/>
                                                    <span className='mx-2'>No</span>
                                                </label>
                                                <label className='mx-2 px-2'>
                                                    <Field name="removeCategory" type="radio" value="true"/>
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
                        <div className={`${category.current === 0 && "opacity-40"} py-3 bg-light bg-opacity-80 flex flex-1 flex-wrap justify-end rounded-r-2xl`}>
                            { changeOpen !== category.id &&
                            <button onClick={() => handleChangeOpen(category.id)} className="group px-2 h-10 w-8 justify-evenly items-center flex flex-col duration-300">
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                                <div className='w-2 h-2 bg-dark rounded-full group-hover:bg-dkgreen duration-300'></div>
                            </button>}
                            {   
                                changeOpen === category.id &&
                                <div className='flex flex-col items-end'>
                                    <button onClick={() => handleChangeOpen(category.id)}>
                                        <CloseIcon className='m-1 fill-dkgreen opacity-40 hover:opacity-70 w-1/8 h-1/8 transition duration-300'/>
                                    </button>
                                    <button className='px-3 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("edit", category.id)}>Edit</button>
                                    <button className='px-2 h-8 rounded-full opacity-60 bg-dkgreen m-1 duration-300 hover:opacity-90' onClick={() => handleSideBarOpen("remove", category.id)}>Delete</button>
                                </div>
                            }
                            <div className="my-4 w-full">
                                <SVG src={`../icons/${category.categoryIcon.name}.svg`} className="mx-auto w-14 h-14 fill-dark relative"/>
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

