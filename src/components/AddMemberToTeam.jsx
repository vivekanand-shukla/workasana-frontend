import React, { useState, useEffect } from 'react';
import useCRUD from "../customHooks/useCrud";
import { Url } from '../customHooks/useMainUrl';
import { useUserContext } from "../Context/UserContext";
const AddMember = ({ teamId, setTeam }) => {
  const { url } = Url();
  const { CRUD } = useCRUD();
 const {showMemberModal, setShowMemberModal} = useUserContext();
  const [selectedMember, setSelectedMember] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await CRUD("get", `${url}/auth/alluser`);
        if (res?.users) {
          console.log("hi", res?.users)
          setAllUsers(res.users);}

      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [url]);




  const addMember = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      alert("Please select a member");
      return;
    }
    try {
      // First, get the current team data
      const teamRes = await CRUD("get", `${url}/teams/${teamId}`);
      
      if (teamRes?.team) {
        const currentMembers = teamRes.team.members.map(m => m._id || m);
        
        // Check if member already exists
        if (currentMembers.includes(selectedMember)) {
          alert("Member already exists in the team");
          return;
        }

        // Add new member to the array
        const updatedMembers = [...currentMembers, selectedMember];

        const payload = {
          members: updatedMembers
        };

        const res = await CRUD("put", `${url}/teams/${teamId}`, payload);
        
        if (res?.team) {
          setTeam(res.team);
          setShowMemberModal(false);
          setSelectedMember("");
          alert("Member added successfully");
        } else {
          alert("Error adding member");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Server error while adding member");
    }
  };

  if (!showMemberModal) return null;

  return (
    <div onClick={() => setShowModal(false)} style={{
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
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: '#fff',
        width: '400px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e8e8e8'
        }}>
          <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#000' }}>
            Add New Member
          </h5>
          <button
            type='button'
            onClick={() => setShowMemberModal(false)}
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
        <div style={{ padding: '20px' }}>
          {/* Member Name Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
              Members Name
            </label>
            <select
              required
              className="form-control"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="">Member Name</option>
              {allUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type='button'
              onClick={() => setShowMemberModal(false)}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: '#6c757d',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={addMember}
              style={{
                padding: '8px 20px',
                border: 'none',
                backgroundColor: '#4169E1',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;