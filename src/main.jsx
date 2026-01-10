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
import axios from "axios";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { UserContext } from './Context/UserContext.jsx';



const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // No token at all → directly block
    if (!token) {
      setChecking(false);
      setValid(false);
      return;
    }

    // Verify token with backend
    axios.get("http://localhost:3000/ensureAuthenticated", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then(() => {
        setValid(true);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setValid(false);
        setChecking(false);
      });
  }, [token]);


  if (checking) return null; 

  // Token invalid or missing
  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  // Token valid → allow access
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


const ContextWrapper = ({ children }) => {
  const [open, setOpen] = useState(false); // sidebar open/close

  return (
    <UserContext.Provider value={{ open, setOpen }}>
      {children}
    </UserContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextWrapper>
      <RouterProvider router={routes}  />
    </ContextWrapper>
  </StrictMode>
);
