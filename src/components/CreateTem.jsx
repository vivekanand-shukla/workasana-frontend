import React, { useState, useEffect } from 'react';
import useCRUD from "../customHooks/useCrud";
import { Url } from '../customHooks/useMainUrl';
import { useUserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
const CreateTeam = ({ setTeams }) => {
  const { url } = Url();
  const { CRUD } = useCRUD();
  const { showTeamModal, setShowTeamModal } = useUserContext();

  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    members: []
  });

  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await CRUD("get", `${url}/auth/alluser`);
        if (res?.users) setAllUsers(res.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [url]);

  const createTeam = async (e) => {
    e.preventDefault();

    if (!newTeam.name) {
       toast.warning("Team name is required");
      return;
    }

    if (newTeam.members.length === 0) {
       toast.warning("Select at least one member");
      return;
    }

    try {
      const payload = {
        name: newTeam.name,
        description: newTeam.description,
        members: newTeam.members
      };

      const res = await CRUD("post", `${url}/teams`, payload);
      if (res?.team) {
        setTeams(prev => [...prev, res.team]);
        setShowTeamModal(false);
        setNewTeam({ name: "", description: "", members: [] });
        toast.success("Team created successfully");
      } else {
       toast.error("Error creating team");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while creating team");
    }
  };

  if (!showTeamModal) return null;

  return (
    <form onSubmit={createTeam} style={{
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
            Create New Team
          </h5>
          <button
            type='button'
            onClick={() => setShowTeamModal(false)}
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
          {/* Team Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Team Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter Team Name"
              className="form-control"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Team Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              placeholder="Enter Team Description"
              className="form-control"
              rows="3"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Team Members Checkboxes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Add Members
            </label>
            <div style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              height: '120px',
              overflowY: 'auto'
            }}>
              {allUsers.map(user => (
                <div key={user._id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>

                  <input
                    type="checkbox"
                    value={user._id}
                    checked={newTeam.members.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                       setNewTeam(prev => ({
                          ...prev,
                          members: [...prev.members, user._id]
                        }));
                      } else {
                        setNewTeam(prev => ({
                          ...prev,
                          members: [...prev.members, user._id]
                        }));

                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <label>
                    <span>{user.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type='button'
              className="btn"
              onClick={() => setShowTeamModal(false)}
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

export default CreateTeam;