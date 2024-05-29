import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';

import ErrorPage from './pages/ErrorPage';
import Loading from './pages/Loading';
import Home from './pages/Home';

import Alumni from './pages/Alumni/Alumni';
import AddAlumni from './pages/Alumni/AddAlumni';
import ShowAlumni from './pages/Alumni/ShowAlumni';
import EditAlumni from './pages/Alumni/EditAlumni';

import Articles from './pages/Article/Articles';
import Article from './pages/Article/Article';
import AddArticle from './pages/Article/AddArticle';
import EditArticle from './pages/Article/EditArticle';

import Surveys from './pages/Survey/Surveys';
import AddSurvey from './pages/Survey/AddSurvey';
import Survey from './pages/Survey/Survey';
import FillSurvey from './pages/Survey/FillSurvey';
import SurveyResult from './pages/Survey/SurveyResult';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {index: true, element: <Home />},
          {path: "/alumni", element: <Alumni />},
          {path: "/alumni/create", element: <AddAlumni />},
          {path: "/alumni/:id", element: <ShowAlumni />},
          {path: "/alumni/:id/edit", element: <EditAlumni />},
          {path: "/articles", element: <Articles />},
          {path: "/articles/:id", element: <Article />},
          {path: "/articles/create", element: <AddArticle />},
          {path: "/articles/:id/edit", element: <EditArticle />},
          {path: "/surveys", element: <Surveys />},
          {path: "/surveys/:id", element: <Survey />},
          {path: "/surveys/create", element: <AddSurvey />},
          {path: "/surveys/:id/fill", element: <FillSurvey />},
          {path: "/surveys/:id/result", element: <SurveyResult />},
        ]
      },
      {
        path: "/login",
        element: <Login />,
      },
      {path: "/loading", element: <Loading />},
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
