// @ts-nocheck
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { Routes, Route, useNavigate, Navigate} from "react-router-dom";
import { useLocation } from 'react-router'

import { onError } from '@apollo/client/link/error';
import { RegisterPage, Login, DashboardPage, ProfilePage, AdminPage, LandingPage, PageNotFound, SavingsPage, OnBoarding } from './Components/Pages'
import { RequireAuth, RequireAdmin, RequireOnboarding } from './Components/Auth';
import { useAuth } from './Components/Hooks'
import { NavLoggedIn, NavLoggedOut, NavAdmin } from './Components/Components';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:3001/graphql" }),
])

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
  cache: new InMemoryCache(),
  link: authLink.concat(link)
});

const App = () => {
  const navigate = useNavigate();
  const handleLogout = (e : any) => {
    e.preventDefault();
    localStorage.clear();
    client.clearStore();
    navigate('/login')
  };

  const auth = useAuth();
  const location = useLocation();
  return (
    <ApolloProvider client={client}>
      {auth.authorised ? auth.isAdmin ? <NavAdmin /> : location.pathname === '/onboarding' ? <></> : <NavLoggedIn/> : <NavLoggedOut />}
        <Routes>
          <Route exact path="/" element={<LandingPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/account" element={
            <RequireAuth>
              <DashboardPage><button onClick={handleLogout}>Log out</button></DashboardPage>
            </RequireAuth>
          }>
          </Route>
          <Route path="/profile" element={
            <RequireAuth>
              <ProfilePage/>
            </RequireAuth>
          }>
          </Route>
          <Route path="/savings" element={
            <RequireAuth>
              <SavingsPage/>
            </RequireAuth>
          }>
          </Route>
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminPage/>
            </RequireAdmin>
          }>
          </Route>
          <Route path="/onboarding" element={
            <RequireOnboarding>
              <OnBoarding/>
            </RequireOnboarding>
          }>
          </Route>
          <Route path="/404" element={<PageNotFound />}></Route>
          <Route path="/*" element={<Navigate replace to="/404" />}></Route>
        </Routes>
    </ApolloProvider>
  );
}

export default App;