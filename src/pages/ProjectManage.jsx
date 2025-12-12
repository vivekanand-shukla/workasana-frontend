import React, { useState, useEffect } from 'react'
import useCRUD from '../customHooks/useCrud'
import { Url } from "../customHooks/useMainUrl"
import Sidebar from '../components/Sidebar'
import { useParams } from 'react-router-dom'
const ProjectManage = () => {
  const id =    useParams()
  const { url } = Url()
  const { CRUD, loading, error } = useCRUD();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [projectsFilter ,setProjectFilter] = useState({})
  const [filterTasks , setFilterTasks ] = useState([])

   
  if (tasks.length > 0) {
    console.log(tasks)
  }
  if (projectsFilter) {
    console.log(projectsFilter)
  }
    if (filterTasks.length >1 ) {
    console.log( "hi vivek ",filterTasks)
  }
useEffect(() => {
  if (projects.length > 0) {
    const selected = projects.find(p => p._id === id.id);
    setProjectFilter(selected || {});
  }
}, [projects, id]);
useEffect(() => {
  if (tasks.length > 0) {
    const selected = tasks.filter(t => t.project._id === id.id);
    setFilterTasks(selected || []);
  }
}, [tasks, id]);

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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const avatarColors = ['#FFB347', '#4EC9B0', '#FF6B9D', '#9B59B6', '#3498DB'];

  const getPriorityStyle = (priority) => {
    if (priority === 'High') return { backgroundColor: '#FFE5E5', color: '#D32F2F' };
    if (priority === 'Low') return { backgroundColor: '#E3F2FD', color: '#1976D2' };
    if (priority === 'Medium') return { backgroundColor: '#F3E5F5', color: '#7B1FA2' };
    return { backgroundColor: '#F5F5F5', color: '#666' };
  };

  const getStatusStyle = (status) => {
    if (status === 'Completed') return { backgroundColor: '#E6F7ED', color: '#0D7A3D' };
    if (status === 'In Progress') return { backgroundColor: '#FFF9E6', color: '#CC9900' };
    return { backgroundColor: '#F5F5F5', color: '#666' };
  };

  const filteredTasks = filterStatus === 'All' ? filterTasks : filterTasks.filter(t => t.status === filterStatus);

  return (
    <div className='d-inline-flex'>
      <Sidebar />

      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', padding: '30px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>
            {projectsFilter.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
            {projectsFilter.description}
          </p>
        </div>

        {/* Sort and Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Sort by:</span>
            <button style={{
              padding: '6px 14px',
              border: '1px solid #e0e0e0',
              backgroundColor: sortBy === 'Priority Low-High' ? '#F0F0F0' : '#fff',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666'
            }}
              onClick={() => setSortBy('Priority Low-High')}
            >
              Priority Low-High
            </button>
            <button style={{
              padding: '6px 14px',
              border: '1px solid #e0e0e0',
              backgroundColor: sortBy === 'Priority High-Low' ? '#F0F0F0' : '#fff',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666'
            }}
              onClick={() => setSortBy('Priority High-Low')}
            >
              Priority High-Low
            </button>
            <button style={{
              padding: '6px 14px',
              border: '1px solid #e0e0e0',
              backgroundColor: sortBy === 'Newest First' ? '#F0F0F0' : '#fff',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666'
            }}
              onClick={() => setSortBy('Newest First')}
            >
              Newest First
            </button>
            <button style={{
              padding: '6px 14px',
              border: '1px solid #e0e0e0',
              backgroundColor: sortBy === 'Oldest First' ? '#F0F0F0' : '#fff',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666'
            }}
              onClick={() => setSortBy('Oldest First')}
            >
              Oldest First
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '6px 12px',
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
              + New Task
            </button>
          </div>
        </div>

        {/* Tasks Table */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.3fr',
            padding: '15px 20px',
            backgroundColor: '#FAFAFA',
            borderBottom: '1px solid #e8e8e8',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase'
          }}>
            <div>TASKS</div>
            <div>OWNER</div>
            <div>PRIORITY</div>
            <div>DUE ON</div>
            <div>STATUS</div>
            <div></div>
          </div>

          {/* Table Rows */}
          {filteredTasks?.map((task, index) => (
            <div
              key={task._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.3fr',
                padding: '18px 20px',
                borderBottom: index !== filteredTasks.length - 1 ? '1px solid #f0f0f0' : 'none',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {/* Task Name */}
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                {task.name}
              </div>

              {/* Owner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {task.owners?.slice(0, 3).map((owner, i) => (
                  <div
                    key={owner._id}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: avatarColors[i % avatarColors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '600',
                      border: '2px solid #fff',
                      marginLeft: i > 0 ? '-10px' : '0'
                    }}
                  >
                    {getInitials(owner.name)}
                  </div>
                ))}
                {task.owners?.length === 1 && (
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    {task.owners[0].name}
                  </span>
                )}
              </div>

              {/* Priority */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  ...getPriorityStyle(task.priority || 'Medium'),
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {task.priority || 'Medium'}
                </span>
              </div>

              {/* Due Date */}
              <div style={{ fontSize: '13px', color: '#666' }}>
                {new Date(task.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>

              {/* Status */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  ...getStatusStyle(task.status),
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {task.status}
                </span>
              </div>

              {/* More Options */}
              <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', cursor: 'pointer' }}>
                +
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectManage