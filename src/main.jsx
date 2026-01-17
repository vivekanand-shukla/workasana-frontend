import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from "react-toastify";
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProjectManage from './pages/ProjectManage.jsx'
import TsakDetail from './pages/TsakDetail.jsx'
import Report from './pages/Report.jsx'

import Team from './pages/Team.jsx'
import axios from "axios";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { UserContext } from './Context/UserContext.jsx';
import SingleTeam from './pages/SingleTeam.jsx'
import Settings from './pages/Settings.jsx'

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
   
    if (!token) {
      setChecking(false);
      setValid(false);
      return;
    }


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


  if (!valid) {
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
    path: "/TsakDetail/:id",
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
    path: "/team",
    element: (
      <ProtectedRoute>
        <Team />
      </ProtectedRoute>
    )
  },
  {
    path: "/team/:id",
    element: (
      <ProtectedRoute>
        < SingleTeam />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        < Settings />
      </ProtectedRoute>
    )
  },
]);


const ContextWrapper = ({ children }) => {
  const [open, setOpen] = useState(false); 
  const [proectLink, setProectLink] = useState("")
    const [showProjectModal, setShowProjectModal] = useState(false);
      const [showTaskModal, setShowTaskModal] = useState(false);
      const [showTeamModal, setShowTeamModal] = useState(false);
      const [showMemberModal, setShowMemberModal] = useState(false);
      const [LoginInfo, setLoginInfo] = useState({});

  return (
    <UserContext.Provider value={{ setLoginInfo , LoginInfo , showMemberModal, setShowMemberModal,  open, setOpen ,proectLink ,setProectLink  , showProjectModal, setShowProjectModal , showTaskModal, setShowTaskModal , showTeamModal , setShowTeamModal }}>
      {children}
    </UserContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextWrapper>
          <ToastContainer />
      <RouterProvider router={routes}  />
    </ContextWrapper>
  </StrictMode>
);
