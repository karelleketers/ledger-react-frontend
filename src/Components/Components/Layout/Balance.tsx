import { useState, useEffect } from 'react';
import { LOAD_DASHBOARD } from '../../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
  
export const Balance = () => {

const {data, loading} = useQuery(LOAD_DASHBOARD); 

const [currentBalance, setCurrentBalance] = useState("");

useEffect(() => {
    data && setCurrentBalance((data.getOwnProfile.balance.current/100).toString().replace('.', ','));
}, [data]);

return (
    <>
        {loading && <p>...Loading</p>}
        <p className='text-dark my-1 mx-2 text-xl font-leaguespartan tracking-wider'>€ {currentBalance}</p>
    </>
    
)
}