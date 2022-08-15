import { useState, useEffect } from 'react';
import moment from 'moment';

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState<Date>()

    useEffect(() => {
        const d = new Date()
        setCurrentDate(d)
    }, []);
    
    /* useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(getCurrentDate);
        }, 360000)
        return () => clearInterval(interval)    
    }, []); */

    return (
        <div className='mt-10'>
            <h4 className='text-sm'>{moment(currentDate).format("MMMM")}</h4>
            <ul className='flex flex-wrap w-full my-6 justify-between'>
            { [...Array(7)].map((d, i) => {
                    const day = moment(currentDate).startOf('isoWeek').add(i, 'd');
                    return (<li key={`day-${i}`} className={`flex flex-col justify-evenly items-center h-18 w-11 ${moment(currentDate).isSame(day, 'day') && "bg-dkgreen rounded-full text-light"}`}>
                        <p className={`text-xs opacity-30`}>{day.format("dd")}</p>
                        <p className={`text-xs`}>{day.format("DD")}</p>
                    </li>)
                })
            }
            </ul>
        </div>
    )
}
