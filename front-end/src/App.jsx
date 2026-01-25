import { useState } from 'react'
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import './App.css'
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage, {loader as articleLoader} from './pages/ArticlePage';
import Layout from './Layout';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import Header from './Header'
import ProfilePage from './pages/ProfilePage';

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage/>,
  
  children:[{
    path: '/',
    element: <HomePage />
  },{
    path: '/header',
    element: <Header />
  },{
    path: '/about',
    element: <AboutPage />
  }, {
    path: '/articles',
    element: <ArticlesListPage />
  },{
    path: '/articles/:name',
    element: <ArticlePage />,
    loader: articleLoader,
  },{
    path: '/login',
    element: <LoginPage />
  }, {
    path: '/create-account',
    element: <CreateAccountPage />
  }, {
    path: '/profile/:id',
    element: <ProfilePage />
  }]
}]

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
    <div className="main_body">
      <RouterProvider router={router} />

    </div>
      
    </>
  );
}

export default App
