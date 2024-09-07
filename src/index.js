import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './style.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

import ErrorPage from './pages/ErrorPage';
import Loading from './pages/Loading';
import Home from './pages/Home';

import Alumni from './pages/Alumni/Alumni';
import AddAlumni from './pages/Alumni/AddAlumni';
import ImportAlumni from './pages/Alumni/ImportAlumni';
import ShowAlumni from './pages/Alumni/ShowAlumni';
import EditAlumni from './pages/Alumni/EditAlumni';

import Articles from './pages/Article/Articles';
import Article from './pages/Article/Article';
import AddArticle from './pages/Article/AddArticle';
import EditArticle from './pages/Article/EditArticle';

import Surveys from './pages/Survey/Surveys';
import AddSurvey from './pages/Survey/AddSurvey';
import FillSurvey from './pages/Survey/FillSurvey';
import SurveyResult from './pages/Survey/SurveyResult';
import Forums from './pages/Forum/Forums';
import Profile from './pages/Profile/Profile';
import ShowProfile from './pages/Profile/ShowProfile';
import SurveyQuestionResult from './pages/Survey/SurveyQuestionResult';
import SurveyLayout from './pages/Survey/SurveyLayout';
import Survey from './pages/Survey/Survey';
import SurveySetting from './pages/Survey/SurveySettting';
import Jobs from './pages/Job/Jobs';
import Job from './pages/Job/Job';


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
          {path: "/alumni/import", element: <ImportAlumni />},
          {path: "/alumni/:id", element: <ShowAlumni />},
          {path: "/alumni/:id/edit", element: <EditAlumni />},
          {path: "/articles", element: <Articles />},
          {path: "/articles/:slug", element: <Article />},
          {path: "/articles/create", element: <AddArticle />},
          {path: "/articles/:id/edit", element: <EditArticle />},
          {path: "/jobs", element: <Jobs />},
          {path: "/jobs/:id", element: <Job />},
          {
            path: "/surveys/:id", 
            element: <SurveyLayout />,
            errorElement: <ErrorPage />,
            children: [
              {index: true, element: <Survey />},
              {path: "/surveys/:id/result", element: <SurveyResult />},
              {path: "/surveys/:id/fill", element: <FillSurvey />},
              {path: "/surveys/:id/question/:qid/result", element: <SurveyQuestionResult />},
              {path: "/surveys/:id/setting", element: <SurveySetting />},
            ],
          },
          {path: "/surveys", element: <Surveys />},
          {path: "/surveys/create", element: <AddSurvey />},
          {path: "/forums", element: <Forums />},
          {path: "/profile", element: <Profile />},
          {path: "/profile/:username", element: <ShowProfile />},
        ]
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
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
