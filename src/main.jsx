import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'

import { createBrowserRouter , RouterProvider   } from "react-router-dom"



const routes = createBrowserRouter([
  {path:"/login", element:<Login/>},
  {path:"/", element:<App/>},
  
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={routes}/>
  </StrictMode>,
)
