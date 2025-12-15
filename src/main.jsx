import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProjectManage from './pages/ProjectManage.jsx'
import TsakDetail from './pages/TsakDetail.jsx'
import Report from './pages/Report.jsx'
import TeamManage from './pages/TeamManage.jsx'
import Team from './pages/Team.jsx'

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"


const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    )
  },

  {
    path: "/projectmanage/:id",
    element: (
      <ProtectedRoute>
        <ProjectManage />
      </ProtectedRoute>
    )
  },

  {
    path: "/TsakDetail",
    element: (
      <ProtectedRoute>
        <TsakDetail />
      </ProtectedRoute>
    )
  },

  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    )
  },

  {
    path: "/teammanagement",
    element: (
      <ProtectedRoute>
        <TeamManage />
      </ProtectedRoute>
    )
  },

  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <Team />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
