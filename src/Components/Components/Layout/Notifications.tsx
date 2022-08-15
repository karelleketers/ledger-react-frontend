import Select, { components } from 'react-select'
import {useState} from 'react';
import { Calendar } from './Calendar';
import {ReactComponent as BillsIcon} from './../../../assets/images/bills.svg';
import {ReactComponent as LoansIcon} from './../../../assets/images/loans.svg';
import {ReactComponent as ChevronIcon} from './../../../assets/images/chevron.svg';
import {ReactComponent as NewNotificationIcon} from './../../../assets/images/notification-new.svg';
import {ReactComponent as CloseIcon} from './../../../assets/images/close.svg';
import chart from './../../../assets/images/doughnutchart.png';
import { useWindowDimensions } from './../../Hooks';

const options = [
    { value: 'day', label: 'day' },
    { value: 'week', label: 'week' },
    { value: 'month', label: 'month' },
    { value: 'year', label: 'year' },
    { value: 'all-time', label: 'all-time' },
]

export interface NotificationsProps {
    notifOpen : boolean
    setNotifOpen: (notifOpen: boolean) => void
}

export interface StyleProps {
    contWidth: string
    changeDur: string
    curve?: string
    rotate?: string
}

export const Notifications = ({notifOpen, setNotifOpen}: NotificationsProps) => {
    const [styleProps, setStyleProps] = useState<StyleProps>({contWidth: "w-0", changeDur: "", curve: "-left-10 rounded-l-full bg-light after:shadow-curve-top-light before:shadow-curve-bottom-light after:right-0 before:right-0 after:bg-dkgreen xl:after:bg-mdgreen before:bg-dkgreen xl:before:bg-mdgreen after:rounded-br-half before:rounded-tr-half", rotate: "rotate-180"});
    const { width } = useWindowDimensions();

    const handleClick = () => {
       const styleChange = styleProps.contWidth === "w-side-notifs" ? {contWidth: "w-0", changeDur: "", curve: "-left-10 rounded-l-full bg-light after:shadow-curve-top-light before:shadow-curve-bottom-light after:right-0 before:right-0 after:bg-dkgreen xl:after:bg-mdgreen before:bg-dkgreen xl:before:bg-mdgreen after:rounded-br-half before:rounded-tr-half", rotate: "rotate-180"} : {contWidth: "w-side-notifs", changeDur: "ease-in-out duration-300", curve: "left-0 bg-dkgreen xl:bg-mdgreen rounded-r-full after:shadow-curve-tablet-top xl:after:shadow-curve-top before:shadow-curve-tablet-bottom xl:before:shadow-curve-bottom after:left-0 before:left-0 after:bg-light before:bg-light after:rounded-bl-half before:rounded-tl-half", rotate: "rotate-0"};
       setStyleProps(styleChange);
       setNotifOpen(!notifOpen);
    }

    const handleMobileClick = () => {
        const styleChange = styleProps.contWidth === "w-0" ? {contWidth: "w-full", changeDur: "ease-in-out duration-300"}  :  {contWidth: "w-0", changeDur: ""};
        setStyleProps(styleChange);
        setNotifOpen(!notifOpen);
     }

    const Input = (props:any) => <components.Input {...props} inputClassName="text-light" />

  return (
    <div className={`h-screen ${notifOpen ? 'fixed' : 'absolute'} z-20 top-0 right-0 flex flex-wrap ${styleProps.contWidth} ${styleProps.changeDur}`}>
        <div className={`relative ${styleProps.contWidth} h-full flex items-center`}>
            {width >= 547 && <div className={`w-10 h-10 absolute ${styleProps.curve} after:absolute before:absolute after:w-curve-width before:w-curve-width after:h-curve before:h-curve after:z-0 before:z-0 after:top-curve-neg before:bottom-curve-neg`}>
                <button className='flex w-full h-full relative z-20' onClick={handleClick}>
                    <ChevronIcon className={`m-auto ${styleProps.rotate}`}/>
                </button>
            </div>}
            {width < 547 && 
                <div className="absolute top-4 right-4">
                    {!notifOpen && <button className="" onClick={handleMobileClick}>
                        <NewNotificationIcon className='fill-light my-auto'/>
                    </button>}
                    {notifOpen && <button className="" onClick={handleMobileClick}>
                        <CloseIcon className='fill-dark opacity-60 hover:opacity-40 w-1/8 h-1/8 transition duration-300'/>
                    </button>}
                </div>
            }
            <div className={`h-full bg-light w-full xl:rounded-tl-3xl overflow-y-scroll`}>
                {notifOpen && 
                <div className='w-full'>
                    <div className='text-dark font-leaguespartan my-8 mx-6'>
                        <h3 className='my-2 text-2xl'>Notifications</h3>
                        <Calendar />
                        <div className='flex flex-wrap justify-end'>
                            <div className='flex flex-wrap h-28 w-22 my-4 bg-dkgreen items-center rounded-full shadow-md shadow-dark'>
                                <BillsIcon className='fill-ltgreen h-8 mx-4'/>
                                <div className='flex-1 text-lg'>
                                    <h5 className='font-nunitoblack text-light'>Bills</h5>
                                    <div className='font-nunitobold text-ltgreen'>You have <span className='text-xl text-light'>{"14"}</span> unpaid bills</div>
                                </div>
                                <button className='bg-light h-full w-12 rounded-r-full'>
                                    <ChevronIcon className="fill-dkgreen m-auto"/>
                                </button>
                            </div>
                            <div className='flex flex-wrap h-28 w-22 bg-softgreen items-center rounded-full shadow-md shadow-dark'>
                                <LoansIcon className='fill-mdgreen h-8 mx-4'/>
                                <div className='flex-1 text-lg'>
                                    <h5 className='font-nunitoblack text-dkgreen'>Loans</h5>
                                    <div className='font-nunitobold text-mdgreen'>Victor H. owes you <span className="text-dkgreen">€ <span className='text-xl'>{"43,00"}</span></span></div>
                                </div>
                                <button className='bg-ltgreen h-full w-12 rounded-r-full'>
                                    <ChevronIcon className="fill-light m-auto"/>
                                </button>
                            </div>
                        </div>
                    </div>          
                    <div className='text-dark my-8 mx-6'>
                        <div className='flex flex-wrap justify-between'>
                            <h3 className='my-2 text-2xl font-leaguespartan'>Reports</h3>
                            <div>
                                <Select components={{ Input }} options={options} defaultValue={options[2]}/>
                            </div>
                        </div>
                        <div className='relative w-64 h-64 mx-auto my-8'>
                            <img src={chart} alt="donut chart" className='w-full h-full'/>
                            <ul className='py-4'>
                                <li className='flex flex-wrap items-center my-4'>
                                    <div className='w-4 h-4 bg-gradient-1 rounded-full shadow-sm shadow-dark'></div>
                                    <p className='text-sm font-leaguespartan mx-4'>food</p>
                                </li>
                                <li className='flex flex-wrap items-center my-4'>
                                    <div className='w-4 h-4 bg-gradient-2 rounded-full shadow-sm shadow-dark'></div>
                                    <p className='text-sm font-leaguespartan mx-4'>clothes</p>
                                </li>
                                <li className='flex flex-wrap items-center my-4'>
                                    <div className='w-4 h-4 bg-gradient-3 rounded-full shadow-sm shadow-dark'></div>
                                    <p className='text-sm font-leaguespartan mx-4'>rent</p>
                                </li>
                                <li className='flex flex-wrap items-center my-4'>
                                    <div className='w-4 h-4 bg-gradient-4 rounded-full shadow-sm shadow-dark'></div>
                                    <p className='text-sm font-leaguespartan mx-4'>drinks</p>
                                </li>
                                <li className='flex flex-wrap items-center mt-4 mb-24'>
                                    <div className='w-4 h-4 bg-dkgreen rounded-full shadow-sm shadow-dark'></div>
                                    <p className='text-sm font-leaguespartan mx-4'>pets</p>
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>}
            </div>
        </div>
    </div>
  )
}
