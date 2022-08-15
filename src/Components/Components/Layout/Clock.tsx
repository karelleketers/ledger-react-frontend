import {ReactComponent as ClockIcon} from './../../../assets/images/clock.svg';
import { useState, useEffect } from 'react';
import moment from 'moment';

export const Clock = () => {

const [currentDate, setCurrentDate] = useState<Date>();

useEffect(() => {
    const d = new Date()
    setCurrentDate(d)  
}, []);


/* useEffect(() => {
    const interval = setInterval(() => {
        setCurrentDate(getCurrentDate);
    }, 10000)
    return () => clearInterval(interval)    
}, []); */

return (
        <>
        <ClockIcon className='fill-dkgreen ml-2 mr-1 m-auto'/>
        <p className='text-dark my-auto mx-2 font-leaguespartan'>{moment(currentDate).format("HH : mm")}</p>
        <p className='text-dark my-auto mx-2 font-leaguespartan'>{moment(currentDate).format("ddd DD MMM")}</p>
        </>
)
}