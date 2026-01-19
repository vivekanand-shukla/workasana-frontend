import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Url } from '../customHooks/useMainUrl'
import useCRUD from '../customHooks/useCrud'
import OpenCloseSidebar from '../components/OpenCloseSidebar'
import { toast } from "react-toastify";
import { useNavigate  } from "react-router-dom"
const Settings = () => {
  const navigate = useNavigate();
  const { url } = Url()
  const { CRUD, loading, error } = useCRUD();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${url}/auth/me`, {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setLoginInfo(data.user);
        });
    }
  }, []);

  const [logInInfo, setLoginInfo] = useState()

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    CRUD("get", `${url}/tasks`).then((res) => setTasks(res?.tasks || []));
    CRUD("get", `${url}/projects`).then((res) => setProjects(res?.projects || []));
    CRUD("get", `${url}/teams`).then((res) => setTeams(res?.teams || []));
  }, [url]);

  const taskProjectIds = tasks
  ?.map(task => task?.project?._id)
  .filter(Boolean); 
  const taskTeamIds = tasks
  ?.map(task => task?.team?._id)
  .filter(Boolean); 



  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirmDelete) return;
    const isUserusedonTeam = teams?.filter(t=>  t?.members?.find(f=> f?._id?.toString() === logInInfo?._id?.toString() )).length
    const isUserusedontask = tasks?.filter(t=> t?.owners?.find(f=>  f?._id?.toString() === logInInfo?._id?.toString())).length
       if( isUserusedontask >0 || isUserusedonTeam >0){

        toast.warning("User is used somewhere else. Please delete it there first.");

            return
       }else if ( isUserusedontask ===0 && isUserusedonTeam ===0){

       
    const token = localStorage.getItem("token");
    await fetch(`${url}/auth/delete-account`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
    toast.success("your account has bened delated successfully!")
    localStorage.removeItem("token");
    navigate("/signup", { replace: true });
  
  }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('setProectLink');
    window.location.href = '/login';
     toast.success("Logout successfully")
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await CRUD("delete", `${url}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
       toast.success("deleted successfully")
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {

      if(taskProjectIds.includes(id)){
         toast.warning("project is used in task so not able to delete")
        return 
      }else{

        await CRUD("delete", `${url}/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
        toast.success("deleted successfully")
      }
    }
  };

  const handleDeleteTeam = async (id) => {
  if (window.confirm('Are you sure you want to delete this team?')) {
     if(taskTeamIds.includes(id)){
         toast.warning("team is used in task so not able to delete")
        return 
      }else{


           await CRUD("delete", `${url}/teams/${id}`);
    setTeams(teams.filter(t => t._id !== id));
       toast.success("deleted successfully")
      }

 
  }
};


  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '150vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '16px', maxWidth: '100%', overflow: 'hidden' }}>
        <div className='d-flex align-item-center justify-content-between' style={{ flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#1a1a1a' }}>
          Settings
        </h1>

         <OpenCloseSidebar/>
        </div>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', marginBottom: '32px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'profile' ? '3px solid #4169E1' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'profile' ? '#4169E1' : '#666',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'tasks' ? '3px solid #4169E1' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'tasks' ? '#4169E1' : '#666',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'projects' ? '3px solid #4169E1' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'projects' ? '#4169E1' : '#666',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'teams' ? '3px solid #4169E1' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'teams' ? '#4169E1' : '#666',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Teams
          </button>
        </div>

        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>
              Profile Information
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#4169E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0
              }}>
                {logInInfo && getInitials(logInInfo?.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1a1a1a', wordBreak: 'break-word' }}>
                  {logInInfo?.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0, wordBreak: 'break-all' }}>{logInInfo?.email}</p>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Full Name
              </label>
              <input
                type="text"
                value={logInInfo?.name}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Email Address
              </label>
              <input
                type="email"
                value={logInInfo?.email}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 24px',
                  border: '1px solid #4169E1',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4169E1',
                  cursor: 'pointer',
                  flex: '1 1 auto',
                  minWidth: '120px'
                }}
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{
                  padding: '10px 24px',
                  border: 'none',
                  backgroundColor: '#DC3545',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  flex: '1 1 auto',
                  minWidth: '120px'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {activeTab === 'tasks' && (
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>
              Manage Tasks
            </h2>
            <div className="list-group">
            <div className='row' style={{ margin: '0 -8px' }}>
              {tasks?.map((task, index) => (
                <div className='col-md-6 col-12' key={index} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div className="list-group-item" style={{ height: '100%' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>TASK NAME</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', wordBreak: 'break-word' }}>{task.name}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>PROJECT</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{task.project?.name}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>STATUS</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a' }}>{task.status}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>TEAM</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{task?.team?.name}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>OWNERS</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{task?.owners?.map(o => o?.name).join(" ")}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        padding: '6px 16px',
                        border: '1px solid #DC3545',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#DC3545',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>
              Manage Projects
            </h2>
            <div className="list-group">
                <div className='row' style={{ margin: '0 -8px' }}>
              {projects?.map((project, index) => (
                  <div className='col-md-6 col-12' key={index} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div className="list-group-item" style={{ height: '100%' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>PROJECT NAME</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', wordBreak: 'break-word' }}>{project.name}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>DESCRIPTION</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{project.description}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      style={{
                        padding: '6px 16px',
                        border: '1px solid #DC3545',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#DC3545',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Teams Section */}
        {activeTab === 'teams' && (
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>
              Manage Teams
            </h2>
            <div className="list-group">
                <div className='row' style={{ margin: '0 -8px' }}>
              {teams?.map((team, index) => (
                  <div className='col-md-6 col-12' key={index} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div className="list-group-item" style={{ height: '100%' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>TEAM NAME</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', wordBreak: 'break-word' }}>{team.name}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>DESCRIPTION</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{team.description}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>MEMBERS</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a' }}>{team.members?.length || 0} members</div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-word' }}>{team.members?.map(m => m?.name).join("   ") } </div>
                  </div>
                  <div>
                    <button
                    onClick={() => handleDeleteTeam(team._id)}
                      style={{
                        padding: '6px 16px',
                        border: '1px solid #DC3545',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#DC3545',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings