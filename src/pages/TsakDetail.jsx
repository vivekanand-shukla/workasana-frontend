import React, { useState, useEffect } from 'react'
import useCRUD from '../customHooks/useCrud'
import { Url } from "../customHooks/useMainUrl"
import Sidebar from '../components/Sidebar'

const TsakDetail = () => {
  const { url } = Url()
  const { CRUD, loading, error } = useCRUD();
  const [task, setTask] = useState(null);

  useEffect(() => {
    // Fetch task details - replace with actual task ID from route params
    CRUD("get", `${url}/tasks`).then((res) => {
      // Get first task as example
      if (res?.tasks && res.tasks.length > 0) {
        setTask(res.tasks[0]);
      }
    });
  }, [url]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const avatarColors = ['#FFB347', '#4EC9B0', '#FF6B9D', '#9B59B6', '#3498DB'];

  const getStatusStyle = (status) => {
    if (status === 'Completed') return { backgroundColor: '#E6F7ED', color: '#0D7A3D' };
    if (status === 'In Progress') return { backgroundColor: '#FFF9E6', color: '#CC9900' };
    if (status === 'To Do') return { backgroundColor: '#E6F3FF', color: '#0066CC' };
    return { backgroundColor: '#F5F5F5', color: '#666' };
  };

  if (!task) {
    return (
      <div className='d-inline-flex'>
        <Sidebar />
        <div style={{ padding: '40px', width: '100%' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className='d-inline-flex'>
      <Sidebar />

      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', padding: '30px 40px' }}>
        {/* Back Button */}
        <button style={{
          padding: '8px 16px',
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          borderRadius: '6px',
          fontSize: '13px',
          cursor: 'pointer',
          color: '#666',
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ← Back to Project
        </button>

        {/* Task Header */}
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#000', marginBottom: '10px' }}>
            {task.name}
          </h1>
        </div>

        {/* Task Details Card */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '800px'
        }}>
          {/* Project */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              PROJECT
            </label>
            <div style={{ fontSize: '15px', color: '#000', fontWeight: '500' }}>
              {task.project?.name || 'No Project'}
            </div>
          </div>

          {/* Team */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              TEAM
            </label>
            <div style={{ fontSize: '15px', color: '#000', fontWeight: '500' }}>
              {task.team?.name || 'No Team'}
            </div>
          </div>

          {/* Owners */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              OWNERS
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {task.owners?.map((owner, i) => (
                <div key={owner._id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: avatarColors[i % avatarColors.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getInitials(owner.name)}
                  </div>
                  <span style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                    {owner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              TAGS
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {task.tags?.map((tag, i) => (
                <span key={i} style={{
                  padding: '6px 14px',
                  backgroundColor: '#F0F0F0',
                  color: '#666',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              DUE DATE
            </label>
            <div style={{ fontSize: '15px', color: '#000', fontWeight: '500' }}>
              {new Date(task.createdAt).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              STATUS
            </label>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              ...getStatusStyle(task.status),
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {task.status}
            </span>
          </div>

          {/* Time Remaining */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              TIME REMAINING
            </label>
            <div style={{ fontSize: '15px', color: '#000', fontWeight: '500' }}>
              {task.timeToComplete} days
            </div>
          </div>

          {/* Mark as Complete Button */}
          <button style={{
            padding: '12px 24px',
            backgroundColor: task.status === 'Completed' ? '#E6F7ED' : '#4169E1',
            color: task.status === 'Completed' ? '#0D7A3D' : 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '250px'
          }}>
            {task.status === 'Completed' ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TsakDetail