import React, { useState, useEffect } from 'react';
import useCRUD from "../customHooks/useCrud";
import { Url } from '../customHooks/useMainUrl';
import { useUserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
const AddNewTask = ({setTasks}) => {
  const { url } = Url();
  const { CRUD } = useCRUD();
  const { showTaskModal, setShowTaskModal } = useUserContext();
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [allUser, setAllUser] = useState([]);

 

  const [taskName, setTaskName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectForShow, setSelectedProjectForShow] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [tags, setTags] = useState("");
  const [createdAt, setCreatedAt] = useState();
  const [status, setStatus] = useState("");
  const [owners, setOwners] = useState([]);
  const [priority, setPriority] = useState("");

  const avatarColors = ['#FFB347', '#4EC9B0', '#FF6B9D', '#9B59B6', '#3498DB'];

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleOwnerChange = (userId) => {
    setOwners(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    CRUD("get", `${url}/projects`).then(res => setProjects(res?.projects || []));
    CRUD("get", `${url}/teams`).then(res => setTeam(res?.teams || []));
    CRUD("get", `${url}/auth/alluser`).then(res => setAllUser(res?.users || []));
  }, [url]);

  const createTask = async (e) => {
    e.preventDefault();
    const splitedTags = tags ? tags.split(',').map(t => t.trim()) : [];

    const taskPayload = {
      name: taskName,
      project: selectedProject,
      team: selectedTeam,
      owners: owners,
      timeToComplete: Number(estimatedTime),
      status: status,
      tags: splitedTags,
      priority: priority,
      createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString()
    };

    const res = await CRUD("post", `${url}/tasks`, taskPayload);

    if (res?.savedTask) {
      toast.success("success");
       setTasks(prev => [...prev, res.savedTask]);
      setShowTaskModal(false);
    } else {
      toast.success("error");
    }
  };

  if (!showTaskModal) return null;

  return (
    <div style={{ position: "absolute", top: '0px', left: "0px" }}>
      <form onSubmit={createTask} style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: '#fff',
          width: '500px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #e8e8e8'
          }}>
            <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#000' }}>
              Create New Task | {selectedProjectForShow}
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Select Project
              </label>
              <select required value={selectedProject} onChange={(e) => {
                const projectId = e.target.value;
                setSelectedProject(projectId);
                const projectObj = projects.find(p => p._id === projectId);
                setSelectedProjectForShow(projectObj?.name || "");
              }}
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
                }}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            {/* Task Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Task Name</label>
              <input required type="text" placeholder="Enter Task Name" className="form-control"
                style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Tags</label>
              <input required type="text" placeholder="Enter Tags comma saparated" className="form-control"
                style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            {/* Team */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Select Team</label>
              <select required value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}
                className="form-control"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', color: '#666', backgroundColor: '#fff', cursor: 'pointer' }}>
                <option value="">Select Team</option>
                {team.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            {/* Owners */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Select Owner</label>
              <div className='d-flex gap-2'>
                {allUser.map(p => (
                  <div className='d-flex gap-2 align-items-center justify-content-center' key={p._id}>
                    <input type="checkbox" name='user' onChange={() => handleOwnerChange(p._id)} value={p._id} />
                    <p style={{ position: "relative", top: "7px" }}>{p.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Select Status</label>
              <select required value={status} onChange={(e) => setStatus(e.target.value)}
                className="form-control"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', color: '#666', backgroundColor: '#fff', cursor: 'pointer' }}>
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Select priority</label>
              <select required value={priority} onChange={(e) => setPriority(e.target.value)}
                className="form-control"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', color: '#666', backgroundColor: '#fff', cursor: 'pointer' }}>
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date & Estimated Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Select Due date</label>
                <input required type="date" onChange={(e) => setCreatedAt(e.target.value)} className="form-control"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', color: '#666' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Estimated Time</label>
                <input required type="number" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Enter Time in Days" className="form-control"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn" type="button" onClick={() => setShowTaskModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #e0e0e0', backgroundColor: '#6c757d', borderRadius: '6px', fontSize: '14px', fontWeight: '500', color: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              <button className="btn" type='submit'
                style={{ padding: '10px 24px', border: 'none', backgroundColor: '#4169E1', borderRadius: '6px', fontSize: '14px', fontWeight: '500', color: 'white', cursor: 'pointer' }}>
                Create
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewTask;
