import { useState } from 'react'
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import './App.css'
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage from './pages/ArticlePage';
import Layout from './Layout';
import NotFoundPage from './pages/NotFoundPage';
import axios from 'axios';
 

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage/>,
  
  children:[{
    path: '/',
    element: <HomePage />
  },{
    path: '/about',
    element: <AboutPage />
  }, {
    path: '/articles',
    element: <ArticlesListPage />
  },{
    path: '/articles/:name',
    element: <ArticlePage />,
    loader: async function({params}){
      const response = await axios.get('/api/articles/' + params.name);
      const {upvotes, comments } = response.data;
      return {upvotes, comments };
    } // Load data this component needs from the server
  }]
}]

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    
    </>
  );
}

export default App
