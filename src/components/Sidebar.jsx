import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdFolder, MdPeople, MdBarChart, MdSettings } from 'react-icons/md';

const Sidebar = () => {
  return (
    <div style={{ width: '220px', height: '100vh', backgroundColor: '#f5f5ff', padding: '24px 16px'  , display:"inline-block"}}  >
      
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ color: '#6366f1', fontSize: '18px', margin: 0 }}>workasana</h4>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <NavLink to="/" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#6366f1' : '#6b7280',
            fontSize: '14px'
          })}>
            <MdDashboard size={18} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#6366f1' : '#6b7280',
            fontSize: '14px'
          })}>
            <MdFolder size={18} />
            Project
          </NavLink>
        </li>
        <li>
          <NavLink to="/team" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#6366f1' : '#6b7280',
            fontSize: '14px'
          })}>
            <MdPeople size={18} />
            Team
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#6366f1' : '#6b7280',
            fontSize: '14px'
          })}>
            <MdBarChart size={18} />
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/setting" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#6366f1' : '#6b7280',
            fontSize: '14px'
          })}>
            <MdSettings size={18} />
            Setting
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;