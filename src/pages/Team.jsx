import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import useCRUD from '../customHooks/useCrud';
import { Url } from '../customHooks/useMainUrl';
import CreateTeam from '../components/CreateTem';
import { useUserContext } from "../Context/UserContext";
import { Link } from 'react-router-dom';
import OpenCloseSidebar from '../components/OpenCloseSidebar';
const avatarColors = ['#FFB347', '#4EC9B0', '#FF6B9D', '#9B59B6', '#3498DB'];
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "A";
  return name
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .join("")
    .toUpperCase();
};

const TeamPage = () => {
  const { url } = Url();
  const { CRUD, loading, error } = useCRUD();
  const [teams, setTeams] = useState([]);
  if (teams.length > 0) {
    console.log(teams)
  }
  console.log(teams)
  useEffect(() => {
    CRUD('get', `${url}/teams`).then((res) => {
      if (res?.teams) {
        setTeams(res.teams);
      }
    });
  }, [url]);

  if (loading) {
    return (
      <div className="d-inline-flex">
        <Sidebar />
        <div style={{ padding: '40px', width: '100%' }}>Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-inline-flex">
        <Sidebar />
        <div style={{ padding: '40px', width: '100%', color: 'red' }}>{error}</div>
      </div>
    );
  }

  const { showTeamModal, setShowTeamModal } = useUserContext();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      {/* MAIN CONTENT */}
      <div style={{ width: '100%' }}>
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '25px 35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  flexWrap: 'wrap',  }}>
            <h2>Teams</h2>
            <div className=' '>
              <OpenCloseSidebar />

              <button onClick={() => setShowTeamModal(true)}
         
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4169E1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + New Team
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}
          >
            {teams.length === 0 && <div>No teams found</div>}
            {teams.map((team) => (
              <Link to={`/team/${team._id}`}
                key={team._id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  , textDecoration: 'none', color: 'inherit'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{team.name}</h3>

                {/* Users assigned to this team */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {team.members?.map((user, i) => (
                    <div
                      key={user._id}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: avatarColors[i % avatarColors.length],
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '11px',
                        border: '2px solid #fff',
                        marginLeft: i > 0 ? "-12px" : 0
                      }}
                      title={user.name}
                    >
                      {getInitials(user.name)}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          {showTeamModal && <CreateTeam setTeams={setTeams} />}
        </div>
      </div>
   


    </div>
  );
};

export default TeamPage;
