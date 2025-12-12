import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Sidebar from './components/Sidebar';
import { Url } from './customHooks/useMainUrl'
import useCRUD from "./customHooks/useCrud"
import { IoMdSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
function App() {
  const { url } = Url()
  const { CRUD, loading, error } = useCRUD();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskFilter, setTaskFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');




    if(tasks.length > 0){

        console.log(tasks)
      }
  useEffect(() => {
    CRUD("get", `${url}/tasks`).then((res) => {
      setTasks(res?.tasks || []);
         
    
    });
  }, [url]);

  useEffect(() => {
    CRUD("get", `${url}/projects`).then((res) => {
      setProjects(res?.projects || []);
    });
  }, [url]);

  const getStatusStyle = (status) => {
    if (status === 'In Progress') return { backgroundColor: '#FFF9E6', color: '#CC9900' };
    if (status === 'Completed') return { backgroundColor: '#E6F7ED', color: '#0D7A3D' };
    if (status === 'To Do') return { backgroundColor: '#E6F3FF', color: '#0066CC' };
    return { backgroundColor: '#F0F0F0', color: '#666' };
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarColors = ['#FFB347', '#4EC9B0', '#FF6B9D', '#9B59B6', '#3498DB'];

  const filteredTasks = taskFilter === 'All' ? tasks : tasks.filter(t => t.status === taskFilter);
  const filteredProjects = projectFilter === 'All' ? projects : projects.filter(p => p.status === projectFilter);

  return (
    <>
      <div style={{ display: 'flex' }}>
        
        <Sidebar />

        {/* MAIN CONTENT */}
        <div style={{ width: "100%" }}>
          <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '25px 35px', width: "100%" }}>

            {/* SEARCH BAR */}
            <div style={{ width: '100%', marginBottom: '35px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: '100%',
                  padding: '10px 45px 10px 15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <IoMdSearch size={25} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            </div>

            {/* PROJECT SECTION */}
            <div style={{ marginBottom: '50px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#000' }}>Projects</h2>

                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    style={{
                      padding: '5px 12px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fff',
                      borderRadius: '5px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    <option value="All">Filter</option>
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <button style={{
                  padding: '8px 18px',
                  backgroundColor: '#4169E1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  + New Project
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredProjects.map((project) => (
                   <>
                  <Link to={`/projectmanage/${project._id}`} key={project._id} style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '18px',
                    textDecoration:"none",
                    color:"inherit;"
                  }}>
                    <span style={{
                      padding: '3px 10px',
                      ...getStatusStyle(project.status || "Completed"),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {project.status || "Completed"}
                    </span>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '10px', color:"black" }}>{project.name}</h3>
                    <p style={{ fontSize: '13px', color: '#666' }}>{project.description}</p>
                  </Link>
                  </>
                ))}
              </div>
            </div>

            {/* TASK SECTION */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>My Tasks</h2>

                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    style={{
                      padding: '5px 12px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fff',
                      borderRadius: '5px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    <option value="All">Filter</option>
                    <option value="All">All</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <button style={{
                  padding: '8px 18px',
                  backgroundColor: '#4169E1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  + New Task
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredTasks.map((task) => (
                  <div key={task._id} style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '18px'
                  }}>
                    <span style={{
                      padding: '3px 10px',
                      ...getStatusStyle(task.status),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {task.status}
                    </span>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '10px' }}>{task.name}</h3>

                    <p style={{ color: '#999', fontSize: '13px' }}>
                      Due in {task.timeToComplete} days · {new Date(task.createdAt).toLocaleDateString()}
                    </p>

                    <div style={{ display: 'flex', marginTop: '10px' }}>
                      {task.owners?.slice(0, 3).map((owner, index) => (
                        <div key={owner._id} style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: avatarColors[index % avatarColors.length],
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '11px',
                          border: '2px solid #fff',
                          marginLeft: index > 0 ? "-12px" : 0
                        }}>
                           {getInitials(owner.name)} 
                           
                           
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default App;
