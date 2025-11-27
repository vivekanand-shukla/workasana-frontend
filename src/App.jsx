import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Sidebar from './components/Sidebar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>

        <Sidebar/>
        <span>ssss</span>
      </div>
    </>
  )
}

export default App
