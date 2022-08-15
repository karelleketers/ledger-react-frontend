import { useQuery } from "@apollo/client";
import { LOAD_DASHBOARD_ENTRIES } from '../../../../GraphQL/Queries';
import {ReactComponent as EntryIcon} from './../../../../assets/images/food.svg';
import moment from 'moment';

interface Entries {
    id: number
    incoming: boolean | null
    amount: number
    category: string
    description: string
    type: string
    updatedAt: Date
}

export const EntriesSection = () => {
    const {loading, data: queryData} = useQuery(LOAD_DASHBOARD_ENTRIES);
    return (
        <ul className='grid grid-rows-3 h-full max-w-md xl:max-w-none'>
            {loading && <div>...Loading</div>}
            {queryData && queryData.getDashboardEntries.map((entry: Entries, i: number) => {
                return (
                <li className="h-20 xl:h-auto row-span-1 my-4 w-full flex flex-wrap text-dark rounded-full bg-light items-center justify-between" key={entry.id}>
                    <div className='flex flex-wrap items-center'>
                        <EntryIcon className="w-4 h-4 mx-4 fill-dkgreen"/>
                        <div className='flex-1'>
                            <p className='font-leaguespartan text-xl first-letter:capitalize'>{entry.incoming ? "money added": entry.category}</p>
                            <p className='font-leaguespartan opacity-50 text-micro'>{moment(entry.updatedAt).fromNow()}</p>
                        </div>
                    </div>
                    <p className={`${entry.incoming ? "text-mdgreen" : "text-transaction-red"} font-nunitobold text-lg mx-6`}>{entry.incoming ? "+" : "-"} {(entry.amount/100).toFixed(2).replace('.', ',')}</p>
                </li>)
                })}
        </ul>
    )
}