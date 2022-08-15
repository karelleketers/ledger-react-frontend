import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LOAD_DASHBOARD } from '../../../../GraphQL/Queries';
import { ReactComponent as AddIcon } from './../../../../assets/images/add.svg';
import { ReactComponent as MobileBG } from './../../../../assets/images/mobile-balance-bg.svg';
import logo from './../../../../assets/images/leder-grnwds.png';
import debitCard from './../../../../assets/images/debitcardgiant.png';
import { Header, Notifications } from './../../../Components';
import { CategoriesSection } from './CategoriesSection';
import { EntriesSection } from './EntriesSection';
import { useWindowDimensions } from './../../../Hooks';
import { Context } from "../../../../App";
//import {ReactComponent as NewNotificationIcon} from './../../../../assets/images/notification-new.svg';


interface Dashboard {
    id: null | number,
    firstName: string,
    reminder: boolean
    balance: {
        current: number
    }
}

export const DashboardPage = () => {
    const {data, loading} = useQuery(LOAD_DASHBOARD);
    const { width } = useWindowDimensions();
    const {navHovered, setFromDashboard} = useContext(Context);
    const [notifOpen, setNotifOpen] = useState(false);
    const [dashboard, setDashboard] = useState<Dashboard>({
        id: null,
        firstName: "",
        reminder: false,
        balance: {
            current: 0
        },
    });
    useEffect(() => {
        if (data) {
            setDashboard(data.getOwnProfile);
        }
    // eslint-disable-next-line
    }, [data]);

    return (
        <div className={`w-full xl:w-main xl:ml-main font-nunitomedium text-light relative xl:flex xl:flex-wrap pb-24 xl:mb-0 ${navHovered && "xl:opacity-20"} ease-in-out duration-300`}>
            {loading && <div>...Loading</div>}
            <div className={`w-full xl:px-8 xl:my-4 ease-in-out duration-200 ${notifOpen  && "opacity-20"}`}>
                {width >= 1098 && <Header /> 
                }
                <main className='xl:py-4'>
                    <div className='xl:hidden max-w-48 w-2/5 m-auto my-8'>
                        <img src={logo} alt="logo" className='w-full'/>
                    </div>
                    <section className='my-24 xl:my-0'>
                        <h1 className="mx-8 xl:mx-0 text-4xl xl:text-3xl">Welcome back, <span className='text-5xl text-ltgreen xl:text-dkgreen xl:text-4xl'>{dashboard.firstName}</span></h1>
                        {width >= 1098 && <div className='hidden my-8 w-95 xl:flex xl:flex-wrap justify-between'>
                            <div className='flex flex-wrap items-center w-full my-4'>
                                <h4 className='font-leaguespartan text-lg text-dark'>Transactions</h4>
                                <Link to="/entries" onClick={()=> {setFromDashboard(true)}} className='cursor-pointer'>
                                    <AddIcon className='mx-1 fill-ltgreen hover:fill-dark w-3 h-3 duration-200'/>
                                </Link>
                            </div>
                            <div className='w-2/5'>
                                <EntriesSection />
                            </div>
                            <div className='relative w-2/5'>
                                <img src={debitCard} alt="creditcard" className="w-full drop-shadow-xl"/>
                                <p className={`top-31p left-9p absolute font-nunitobold xl:text-balance tracking-wide`}>€ {(dashboard.balance.current/100).toFixed(2).replace('.', ',')}</p>
                                <p className={`top-63p left-52p absolute font-nunitobold xl:text-cc opacity-60`}>1234</p>
                                <p className={`top-86p left-9p absolute font-nunitobold xl:text-cc opacity-60 text-ltgreen`}>02/30</p>
                            </div>
                        </div>}
                        {width < 1098 && <div className="relative w-full xl:hidden my-12 md:my-16 flex flex-wrap justify-center items-center">
                            <MobileBG  className="w-70vw max-w-xl opacity-60 fill-ltgreen top-0 left-0" />
                            <div className="m-auto top-1/3 absolute w-full pt--8">
                                <p className="text-center text-mobile-text md:text-4xl font-nunitolt">Available balance</p>
                                <p className={`w-full text-center absolute font-nunitoblack md:pt-4 md:text-9xl text-mobile-balance `}>€ {(dashboard.balance.current/100).toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>}
                    </section>
                    <section className={`mx-8 xl:mx-0 my-20 duration-300 ease-in-out`}>
                        <div className='flex flex-wrap items-center w-full my-4'>
                            <h4 className='font-leaguespartan text-2xl xl:text-lg text-light xl:text-dark'>Categories</h4>
                            <Link to="/categories" onClick={()=> {setFromDashboard(true)}}  className='cursor-pointer'>
                                <AddIcon className='mx-2 xl:mx-1 w-6 h-6 fill-ltgreen hover:fill-dark xl:w-3 xl:h-3 duration-200'/>
                            </Link>
                         </div>
                         <CategoriesSection/>
                    </section>
                    {width < 1098 && <section className='xl:hidden mx-8 xl:mx-0 mt-20 mb-6'>
                        <div className='flex flex-wrap items-center w-full my-4'>
                            <h4 className='font-leaguespartan text-2xl xl:text-lg text-light xl:text-dark'>Transactions</h4>
                            <Link to="/entries" onClick={()=> {setFromDashboard(true)}}  className='cursor-pointer'>
                                <AddIcon className='mx-2 xl:mx-1 w-6 h-6 fill-ltgreen hover:fill-dark xl:w-3 xl:h-3 duration-200'/>
                            </Link>
                         </div>
                         <EntriesSection />
                    </section>}
                </main>
            </div>
            <Notifications notifOpen={notifOpen} setNotifOpen={setNotifOpen}/>
        </div>
        
    )
}
