import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useCRUD from "../customHooks/useCrud";
import { Url } from "../customHooks/useMainUrl";
import AddMemberToTeam from "../components/AddMemberToTeam"
const avatarColors = ["#FFB347", "#4EC9B0", "#FF6B9D", "#9B59B6", "#3498DB"];
import { useUserContext } from "../Context/UserContext";
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const SingleTeam = () => {

     const {showMemberModal, setShowMemberModal} = useUserContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { url } = Url();
  const { CRUD } = useCRUD();

  const [team, setTeam] = useState(null);

  useEffect(() => {
    CRUD("get", `${url}/teams/${id}`).then((res) => {
      if (res?.team) setTeam(res.team);
    });
  }, [id, url]);

  if (!team) return null;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ width: "100%", padding: "30px 40px" }}>
        {/* Back */}
        <div
          onClick={() => navigate("/team")}
          style={{
            color: "#4169E1",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          ← Back to Teams
        </div>

        {/* Team Name */}
        <h2 style={{ marginBottom: "20px" }}>{team.name}</h2>

        {/* Members */}
        <div style={{ marginBottom: "10px", color: "#888", fontSize: "13px" }}>
          MEMBERS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {team.members.map((user, i) => (
            <div
              key={user._id}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor:
                    avatarColors[i % avatarColors.length],
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {getInitials(user.name)}
              </div>

              <span>{user.name}</span>
            </div>
          ))}
        </div>

        {/* Add Member Button */}
        <button onClick={()=>{
         setShowMemberModal(true)
        }}
          style={{
            marginTop: "20px",
            padding: "6px 12px",
            backgroundColor: "#4169E1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          + Member
        </button>
      { showMemberModal && <AddMemberToTeam/>}
      </div>
    </div>
  );
};

export default SingleTeam;
