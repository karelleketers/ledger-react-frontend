import {gql} from '@apollo/client';

export const LOAD_DASHBOARD = gql`
    query {
        getOwnProfile {
            id,
            firstName,
            reminder,
            balance {
                current
            }
        }
    }
`

export const LOAD_PROFILE = gql`
    query {
        getOwnProfile {
            id,
            firstName,
            lastName,
            bank,
            reminder,
        }
    }
`


export const LOAD_ENTRIES = gql`
    query {
        getEntries {
            id,
            incoming,
            amount,
            category,
            description,
            type,
        }
    }
`


export const LOAD_LOANS= gql`
    query {
        getLoans {
            id,
            owed
            inviteName,
            inviteEmail,
            loan {
                id,
                amount,
                paid,
                reason
            }
        }
    }
`

export const LOAD_BILLS = gql`
    query {
        getBills {
            id,
            name,
            amount,
            paid,
            reminder,
        }
    }
`

export const LOAD_SAVINGSBALANCE = gql`
    query {
        getSavingsBalance {
            id,
            total,
            unassigned,
            monthly_savings
        }
    }
`

export const LOAD_SAVINGS = gql`
    query {
        getAllSavings {
            id,
            name,
            saved,
            goal,
            goal_date,
            amount,
            type
        }
    }
`

export const LOAD_CATEGORIES = gql`
    query {
        getCategories {
            id,
            name,
            current,
            total,
            hidden,
            categoryIconId
            categoryIcon {
                name
            }
        }
    }
`

export const LOAD_CATEGORIES_LIST = gql`
    query {
        getCategories {
            id,
            name,
        }
    }
`

export const LOAD_CATEGORY_ICONS = gql`
    query {
        categoryIcons {
            id,
            name,
        }
    }
`