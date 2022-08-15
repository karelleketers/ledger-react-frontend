// @ts-nocheck
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { Routes, Route, Navigate} from "react-router-dom";
import { useLocation } from 'react-router';
import * as NavRoute from './routes';

import { onError } from '@apollo/client/link/error';
import { BatchHttpLink } from "@apollo/client/link/batch-http"
import { RegisterPage, LoginPage, DashboardPage, ProfilePage, AdminPage, LandingPage, PageNotFound, SavingsPage, OnBoarding, EntriesPage, BillsPage, LoansPage, CategoriesPage } from './Components/Pages'
import { RequireAuth, RequireAdmin, RequireOnboarding, RedirectAuth } from './Components/Auth';
import { useAuth } from './Components/Hooks'
import { NavLoggedIn, NavAdmin } from './Components/Components';
import React, { useState } from 'react';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

/* const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:3001/graphql" }),
]) */

const link = from([
  errorLink,
  new BatchHttpLink({
  uri: "http://localhost:3001/graphql",
  batchMax: 5,
  batchInterval: 20
})])

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  //merge fetchMore results (duplicate necessary no global state exists)
  cache: new InMemoryCache({
    typePolicies: {
      /* UnconventionalRootQuery: {
        queryType: true,
      }, */
      Query: {
        fields: {
          getEntries: {
            keyFields: false,
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              let mergedItems = [];
              const newItems = incoming[0].items;
              const oldItems = existing.length > 0 ? existing[0].items : [];
              const count = incoming[0].count;
              if (newItems !== oldItems) {mergedItems = [...oldItems, ...newItems]}
              return [{count: count, items: mergedItems}]
            }
          },
          getBills: {
            keyFields: false,
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              let mergedItems = [];
              const newItems = incoming[0].items;
              const oldItems = existing.length > 0 ? existing[0].items : [];
              const count = incoming[0].count;
              const unpaidCount = incoming[0].unpaidCount;
              if (newItems !== oldItems) {mergedItems = [...oldItems, ...newItems]}
              return [{count: count, unpaidCount: unpaidCount, items: mergedItems}]
            }
          },
          getLoans: {
            keyFields: false,
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              let mergedItems = [];
              const newItems = incoming[0].items;
              const oldItems = existing.length > 0 ? existing[0].items : [];
              const count = incoming[0].count;
              if (newItems !== oldItems) {mergedItems = [...oldItems, ...newItems]}
              return [{count: count, items: mergedItems}]
            }
          },
          getCategories: {
            keyFields: false,
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              let mergedItems = [];
              const newItems = incoming[0].items;
              const oldItems = existing.length > 0 ? existing[0].items : [];
              const count = incoming[0].count;
              if (newItems !== oldItems) {mergedItems = [...oldItems, ...newItems]}
              return [{count: count, items: mergedItems}]
            }
          },
          getAllSavings: {
            keyFields: false,
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              let mergedItems = [];
              const newItems = incoming[0].items;
              const oldItems = existing.length > 0 ? existing[0].items : [];
              const count = incoming[0].count;
              if (newItems !== oldItems) {mergedItems = [...oldItems, ...newItems]}
              return [{count: count, items: mergedItems}]
            }
          },
        }
      }
    },
  }),
  //server side rendering when hosting on Heroku?
  ssrMode: true,
  link: authLink.concat(link)
});

export const Context = React.createContext<any>({navHovered: false, setNavHovered: () => {}, fromDashboard: false, setFromDashboard: () => {}});
  

const App = () => {
  const auth = useAuth();
  const location = useLocation();
  const [navHovered, setNavHovered] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);
  return (
    <ApolloProvider client={client}>
      <Context.Provider value={{navHovered, setNavHovered, fromDashboard, setFromDashboard}}>
      <div className="bg-dkgreen xl:bg-mdgreen min-h-screen text-light flex flex-wrap relative">
      {auth.authorised ? auth.isAdmin ? <NavAdmin /> : (location.pathname === '/onboarding' || location.pathname === '/404') ? <></> : <NavLoggedIn/> : <></>}
        <Routes>
          <Route path="/" element={
            <RedirectAuth>
              <LandingPage />
            </RedirectAuth> 
          }></Route>
          <Route path={NavRoute.REGISTER} element={
            <RedirectAuth>
              <RegisterPage />
            </RedirectAuth>
          }></Route>
          <Route path={NavRoute.LOGIN} element={
            <RedirectAuth>
              <LoginPage />
            </RedirectAuth>
          }></Route>
          <Route path={NavRoute.ACCOUNT} element={
            <RequireAuth>
              <DashboardPage/>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.BILLS} element={
            <RequireAuth>
              <BillsPage></BillsPage>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.LOANS} element={
            <RequireAuth>
              <LoansPage></LoansPage>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.ENTRIES} element={
            <RequireAuth>
              <EntriesPage></EntriesPage>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.PROFILE} element={
            <RequireAuth>
              <ProfilePage/>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.SAVINGS} element={
            <RequireAuth>
              <SavingsPage/>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.CATEGORIES} element={
            <RequireAuth>
              <CategoriesPage/>
            </RequireAuth>
          }>
          </Route>
          <Route path={NavRoute.ADMIN} element={
            <RequireAdmin>
              <AdminPage/>
            </RequireAdmin>
          }>
          </Route>
          <Route path={NavRoute.ONBOARDING} element={
            <RequireOnboarding>
              <OnBoarding/>
            </RequireOnboarding>
          }>
          </Route>
          <Route path={NavRoute.FOUROHFOUR} element={<PageNotFound />}></Route>
          <Route path="*" element={<Navigate replace to={NavRoute.FOUROHFOUR} />}></Route>
        </Routes>
        </div>
        </Context.Provider>
    </ApolloProvider>
  );
}

export default App;