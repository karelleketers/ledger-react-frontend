//import {ReactComponent as NotificationIcon} from './../../../assets/images/notification.svg';
import {ReactComponent as NewNotificationIcon} from './../../../assets/images/notification-new.svg';
import { Balance } from './Balance';
import { Clock } from './Clock';
import { useLocation } from 'react-router-dom';
  
export const Header = () => {

const { pathname } = useLocation();

return (
    <div className='xl:h-8 my-4 md:mx-2 flex flex-wrap justify-between md:justify-end'>
        <div className='flex flex-wrap bg-light p-2 rounded-full order-2 md:order-1'>
            { pathname === "/account" ? <Clock/> : <Balance/>           
            }
        </div>
        <NewNotificationIcon className='fill-light md:mx-4 my-auto md:order-2'/>
    </div>
)
}