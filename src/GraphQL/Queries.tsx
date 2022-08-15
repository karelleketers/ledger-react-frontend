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

export const GET_USER = gql`
    query getUser($email: String!) {
        getUser(email: $email) {
            id,
            email,
            profile {
                id,
                firstName,
                lastName,
                bank
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
    query getEntries ($limit: Int!, $offset: Int!){
        getEntries (results: {limit: $limit, offset: $offset}) {
            count,
            items {
                id,
                incoming,
                amount,
                category,
                description,
                type,
                updatedAt
            }
        }
    }
`


export const LOAD_DASHBOARD_ENTRIES = gql`
    query {
        getDashboardEntries {
            id,
            incoming,
            amount,
            category,
            description,
            type,
            updatedAt,
        }
    }
`

export const LOAD_LOANS= gql`
    query getLoans ($limit: Int!, $offset: Int!) {
        getLoans (results: {limit: $limit, offset: $offset}){
            count,
            items {
                id,
                owed
                inviteName,
                inviteEmail,
                loan {
                    id,
                    amount,
                    paid,
                    reason
            }}
        }
    }
`

export const LOAD_BILLS = gql`
    query getBills($limit: Int!, $offset: Int!){
        getBills (results: {limit: $limit, offset: $offset}) {
            count,
            unpaidCount,
            items {
            id,
            name,
            amount,
            paid,
            reminder,
            updatedAt
            }
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
    query getAllSavings($limit: Int!, $offset: Int!){
        getAllSavings(results: {limit: $limit, offset: $offset}) {
            count, 
            items {
                id,
                name,
                saved,
                goal,
                goal_date,
                amount,
                type
            }
        }
    }
`

export const LOAD_CATEGORIES_SECTION = gql`
    query {
        getCategoriesList {
            id,
            name,
            current,
            total,
            hidden,
            updatedAt,
            categoryIconId,
            categoryIcon {
                name
            }
        }
    }
`

export const LOAD_CATEGORIES = gql`
    query getCategories($limit: Int!, $offset: Int!){
        getCategories(results: {limit: $limit, offset: $offset}) {
            count, 
            items {
            id,
            name,
            current,
            total,
            hidden,
            updatedAt,
            categoryIconId,
            categoryIcon {
                name
            }
        }}
    }
`

export const LOAD_CATEGORIES_LIST = gql`
    query {
        getCategoriesList {
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