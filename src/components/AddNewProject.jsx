import React, { useState } from 'react';
import useCRUD from "../customHooks/useCrud";
import { Url } from '../customHooks/useMainUrl';
import { useUserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
const AddNewProject = ({  setProjects }) => {
  const { url } = Url();
  const { CRUD } = useCRUD();

    const {showProjectModal, setShowProjectModal } = useUserContext();
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "To Do"
  });

  const createProject = async (e) => {
    e.preventDefault();

    const projectPayload = {
      name: newProject.name,
      description: newProject.description,
      status: newProject.status
    };

    try {
      const res = await CRUD("post", `${url}/projects`, projectPayload);
      if (res?.project) {
        setProjects(prev => [...prev, res.project]);
        setShowProjectModal(false); 
        setNewProject({ name: "", description: "", status: "To Do" }); 
        toast.success("Project created successfully");
      } else {
        toast.error("Error creating project");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while creating project");
    }
  };

  if (!showProjectModal) return null;

  return (
    <form onSubmit={createProject} style={{
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
          <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#000' }}>
            Create New Project
          </h5>
          <button
            type='button'
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
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Project Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter Project Name"
              className="form-control"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Project Description
            </label>
            <textarea
              placeholder="Enter Project Description"
              className="form-control"
              rows="4"
              required
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Project Status
            </label>
            <select
              required
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
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
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type='button'
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
              type='submit'
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
    </form>
  );
};

export default AddNewProject;
