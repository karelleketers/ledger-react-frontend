import React, {useEffect, useState} from 'react';
import { useQuery } from "@apollo/client";
import { LOAD_DASHBOARD } from '../../../GraphQL/Queries';
import { EntriesPage } from './EntriesPage';
import { LoansPage } from './LoansPage';
import { BillsPage } from './BillsPage';
import { CategoriesPage } from './CategoriesPage';

interface Dashboard {
    id: null | number,
    firstName: string,
    reminder: boolean
    balance: {
        current: number | null
    }
}

interface DashboardProps {
    children: React.ReactNode
}

export const DashboardPage = ({children}: DashboardProps) => {
    const {data} = useQuery(LOAD_DASHBOARD);
    const [dashboard, setDashboard] = useState<Dashboard>({
        id: null,
        firstName: "",
        reminder: false,
        balance: {
            current: null
        },
    });
    useEffect(() => {
        if (data) {
            setDashboard(data.getOwnProfile);
        }
    // eslint-disable-next-line
    }, [data]);

    return (
        <>
        <div>
            <h1 className="text-7xl text-gray-500">Hello {dashboard.firstName}!</h1>
            <h2 className="text-4xl text-gray-600">You have {dashboard.balance.current} money in your account</h2>
        </div>
        <EntriesPage />
        <LoansPage />
        <BillsPage profileReminder={dashboard.reminder}/>
        <CategoriesPage />
        {children}
        </>
        
    )
}
