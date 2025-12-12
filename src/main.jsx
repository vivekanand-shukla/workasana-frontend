import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import ProjectManage from './pages/ProjectManage.jsx'
import { createBrowserRouter , RouterProvider   } from "react-router-dom"
import TsakDetail from './pages/TsakDetail.jsx'
import Report from './pages/Report.jsx'
import TeamManage from './pages/TeamManage.jsx'
import Team from './pages/Team.jsx'
import Signup from './pages/Signup.jsx'
const routes = createBrowserRouter([
  {path:"/login", element:<Login/>},
  {path:"/signup", element:<Signup/>},
  {path:"/", element:<App/>},
  {path:"/projectmanage/:id", element:<ProjectManage/>},
  {path:"/TsakDetail", element:<TsakDetail/>},
  {path:"/report", element:<Report/>},
  {path:"/report", element:<Report/>},
  {path:"/teammanagement", element:<TeamManage/>},
  {path:"/teammanagement", element:<TeamManage/>},
  {path:"/team", element:<Team/>},
  
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={routes}/>
  </StrictMode>,
)
