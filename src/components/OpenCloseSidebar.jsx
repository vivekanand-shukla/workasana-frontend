import './Sidebar.css'
import React  from 'react';
import { MdClose, MdMenu} from 'react-icons/md';



import { useUserContext } from "../Context/UserContext";

const OpenCloseSidebar = () => {

  const { open, setOpen } = useUserContext();
  return (
    <div  
className='openClose'>
       { open ? <p onClick={() => setOpen(false)}>  <MdClose size={25} /></p> :  <p onClick={() => setOpen(true)}>  <MdMenu size={25} /></p>  }


    </div>
  )
}

export default OpenCloseSidebar