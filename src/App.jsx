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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal ,setShowTaskModal] = useState(false);
  
  
  const [taskName, setTaskName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [team, setTeam] = useState([]);
  const [tags, setTags] = useState("");
  const [createdAt, setCreatedAt] = useState();
  const [status, setStatus] = useState();
  const [allUser, setAllUser] = useState([]);
  const [owner, setOwner] = useState("");




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
  useEffect(() => {
    CRUD("get", `${url}/teams`).then((res) => {
      console.log(res?.teams[0]) //it is printing
      setTeam(res?.teams || []);
    });
  }, [url]);



  useEffect(() => {
    CRUD("get", `${url}/auth/alluser`).then((res) => {
      // console.log("bla vla",res) //it is printing
      setAllUser(res?.users || []);
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



  const createTask = async (e) => {
   e.preventDefault()
   const splitedTags = tags
  ? tags.split(',').map(t => t.trim())
  : [] 
  const taskPayload = {
    name: taskName,
    project: selectedProject,     // Project _id
    team: selectedTeam,           // Team _id
    owners: [owner],     // must be ARRAY
    timeToComplete: Number(estimatedTime),
    status: status,
   tags:splitedTags  ,

   
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString()

  };

  const res = await CRUD("post", `${url}/tasks`, taskPayload);

  if (res?.savedTask) {
    setTasks(prev => [...prev, res.savedTask]);
    setShowTaskModal(false);
    alert("success")
  }else{
    alert("error")
  }
};


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
                }}
                 onClick={() => setShowProjectModal(true)}
                >
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
                }}
                onClick={() => setShowTaskModal(true)}
                >
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
           { showProjectModal  && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      width: '450px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <h5 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '600',
          color: '#000'
        }}>
          Create New Project
        </h5>
        <button 
          onClick={() => setShowProjectModal(false)}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '24px',
            color: '#999',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '24px' }}>
        {/* Project Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Project Name
          </label>
          <input
            type="text"
            placeholder="Enter Project Name"
            className="form-control"
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Project Description
          </label>
          <textarea
            placeholder="Enter Project Description"
            className="form-control"
            rows="4"
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px' 
        }}>
          <button
            className="btn"
            onClick={() => setShowProjectModal(false)}
            style={{
              padding: '10px 20px',
              border: '1px solid #e0e0e0',
              color: '#fff',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#666',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            className="btn"
            style={{
              padding: '10px 24px',
              border: 'none',
              backgroundColor: '#4169E1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showTaskModal && (
  <form   onSubmit={createTask}   style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      width: '500px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <h5 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '600',
          color: '#000'
        }}>
          Create New Task | Create Moodboard
        </h5>
        <button 
          onClick={() => setShowTaskModal(false)}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '24px',
            color: '#999',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '24px' }}>
        {/* Select Project */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Select Project
          </label>
          <select required
  value={selectedProject}
  onChange={(e) => setSelectedProject(e.target.value)}
            className="form-control"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
           <option value="">Select Project</option>
            {projects.map(p => (
    <option key={p._id} value={p._id}>{p.name}</option>
  ))}
          </select>
        </div>

        {/* Task Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Task Name
          </label>
          <input  required
            type="text"
            placeholder="Enter Task Name"
            className="form-control"
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
             value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
          Tags          </label>
          <input required
            type="text"
            placeholder="Enter Tags comma saparated "
            className="form-control"
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
             value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Select Team */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Select Team
          </label>
          <select required
            className="form-control"
              value={selectedTeam}
           onChange={(e) => setSelectedTeam(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
           <option value="">Select Team</option>
         {team.map(p => (
    <option key={p._id} value={p._id}>{p.name}</option>
  ))}
          </select>
        </div>
        {/* Select owner */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Select Owner
          </label>
          <select required
            className="form-control"
              value={owner}
           onChange={(e) => setOwner(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
           <option value="">Select Owner</option>
         {allUser.map(p => (
    <option key={p._id} value={p._id}>{p.name}</option>
  ))}
          </select>
        </div>
        {/* Select status */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Select Status
          </label>
          <select required
            className="form-control"
            value={status}
           onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
           <option value="">Select Status</option>
           <option value="To Do">To Do</option>
           <option value="In Progress">In Progress</option>
           <option value="Completed">Completed</option>
           <option value="Blocked">Blocked</option>
      
          </select>
        </div>

        {/* Select Due date and Estimated Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
          {/* Due Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Select Due date
            </label>
            <input required
             onChange={(e) => setCreatedAt(e.target.value)}
             
              type="date"
              placeholder="Select date"
              className="form-control"
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#666'
              }}
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Estimated Time
            </label>
            <input required
             type="number"

  value={estimatedTime}
  onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="Enter Time in Days"
              className="form-control"
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px' 
        }}>
          <button
            className="btn"
             type="button"
            onClick={() => setShowTaskModal(false)}
            style={{
              padding: '10px 20px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#6c757d',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            className="btn"
            type='submit'
          
 
            style={{
              padding: '10px 24px',
              border: 'none',
              backgroundColor: '#4169E1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </form>
)}

          </div>
        </div>
      </div>
    </>
  )
}

export default App;
