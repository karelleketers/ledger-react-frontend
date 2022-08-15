import { NavLink, useNavigate } from 'react-router-dom';
import logo from './../../../assets/images/leder-grnwds.png';
import {ReactComponent as DashboardIcon} from './../../../assets/images/dashboard.svg';
import {ReactComponent as BillsIcon} from './../../../assets/images/bills.svg';
import {ReactComponent as TransactionsIcon} from './../../../assets/images/transactions.svg';
import {ReactComponent as LoansIcon} from './../../../assets/images/loans.svg';
import {ReactComponent as SavingsIcon} from './../../../assets/images/savings.svg';
import {ReactComponent as SettingsIcon} from './../../../assets/images/settings.svg';
import {ReactComponent as LogoutIcon} from './../../../assets/images/logout.svg';
import { useApolloClient } from '@apollo/client';
import { useContext } from 'react';
import { Context } from '../../../App';

export const NavLoggedIn = () => {

    const navigate = useNavigate();
    const client = useApolloClient();
    const {setNavHovered} = useContext(Context);
    const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        localStorage.clear();
        client.clearStore();
        navigate('/login')
      };
    return (
        <nav onMouseEnter={() => {setNavHovered(true)}} onMouseLeave={() => {setNavHovered(false)}} className='py-6 fixed bottom-0 z-300 bg-light xl:bg-dkgreen xl:p-0 w-full xl:w-nav-compact-xl xl:rounded-tr-3xl group xl:hover:w-nav-extended-xl ease-in-out duration-300'>
            <div className='xl:bg-dkgreen max-w-md m-auto px-6 xl:px-0 xl:max-w-none xl:overflow-hidden flex flex-wrap xl:fixed xl:top-0 xl:left-0 xl:w-nav-compact-xl xl:group-hover:w-nav-extended-xl xl:h-screen xl:grid xl:grid-cols-1 xl:grid-rows-8 ease-in-out duration-300'>
                <div className='hidden xl:block xl:row-span-1 xl:w-2/5 m-auto xl:py-6'>
                    <img src={logo} alt="logo" className='w-full'/>
                </div>
                <ul className="flex-1 xl:flex-none items-center justify-around xl:justify-start flex flex-wrap font-nunitoblack xl:text-lg xl:row-span-6 xl:flex xl:flex-col xl:h-4/6 xl:max-h-32r xl:w-nav-options-compact-xl xl:group-hover:w-nav-options-extended-xl xl:m-auto xl:ml-9 ease-in-out duration-300">
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/account" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <DashboardIcon className="fill-dkgreen xl:fill-ltgreen hover-none min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>DASHBOARD</p>
                            </div>
                        </NavLink >
                    </li>
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/entries" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <TransactionsIcon className="fill-dkgreen xl:fill-ltgreen min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>TRANSACTIONS</p>
                            </div>
                        </NavLink >
                    </li>
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/bills" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <BillsIcon className="fill-dkgreen xl:fill-ltgreen min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>BILLS</p>
                            </div>
                        </NavLink >
                    </li>
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/loans" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <LoansIcon className="fill-dkgreen xl:fill-ltgreen min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>LOANS</p>
                            </div>
                        </NavLink >
                    </li>
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/savings" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <SavingsIcon className="fill-dkgreen xl:fill-ltgreen min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>SAVINGS</p>
                            </div>
                        </NavLink >
                    </li>
                    <li className="xl:h-1/6 xl:w-full">
                        <NavLink to="/profile" className="relative navin xl:flex xl:flew-wrap xl:h-full w-full">
                            <SettingsIcon className="fill-dkgreen xl:fill-ltgreen min-w-[2rem] xl:w-8 xl:mx-2 xl:h-8 xl:my-auto z-20"/>
                            <div className='hidden xl:block opacity-0 invisible xl:flex-1 xl:my-auto xl:ml-2 z-20 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100'>
                                <p className=''>SETTINGS</p>
                            </div>
                        </NavLink >
                    </li>
                </ul>
                <button onClick={handleLogout} className='opacity-40 hover:opacity-100 w-1/7 xl:flex xl:flew-wrap xl:row-span-1 xl:w-nav-options-compact-xl xl:group-hover:w-nav-options-extended-xl xl:m-auto xl:ml-9 ease-in-out duration-300'>
                    <LogoutIcon className="m-auto fill-dark xl:fill-mdgreen min-w-[1.5rem] xl:w-6 xl:ml-2 xl:mr-4 xl:h-6 xl:my-auto"/>
                    <div className="hidden xl:block font-nunitoblack text-sm text-left invisible opacity-0 transition-opacity ease-in delay-300 duration-200 xl:group-hover:visible xl:group-hover:opacity-100">
                        <p className="">LOG OUT</p>
                    </div>
                </button>
            </div>
        </nav>
    )
}
