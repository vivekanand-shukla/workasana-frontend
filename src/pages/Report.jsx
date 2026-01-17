import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Sidebar from "../components/Sidebar";
import { Url } from "../customHooks/useMainUrl";
import useCRUD from "../customHooks/useCrud";
import { useNavigate } from "react-router-dom";
import OpenCloseSidebar from "../components/OpenCloseSidebar";

const cardStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

export default function Reports() {

  const [weeklyChart, setWeeklyChart] = useState({
  labels: [],
  values: []
});

  const { url } = Url();
  const { CRUD } = useCRUD();
  const navigate = useNavigate();

  const [lastWeek, setLastWeek] = useState(0);
  const [pendingDays, setPendingDays] = useState(0);
  const [byTeam, setByTeam] = useState({});
  const [byOwner, setByOwner] = useState({});

  useEffect(() => {
    fetchReports();
  }, [url]);

  const fetchReports = async () => {
    const lw = await CRUD("get", `${url}/report/last-week`);
    const pd = await CRUD("get", `${url}/report/pending`);
    const ct = await CRUD("get", `${url}/report/closed-tasks`);

    setLastWeek(lw?.count || 0);
    setPendingDays(pd?.totalDays || 0);
    setByTeam(ct?.byTeam || {});
    setByOwner(ct?.byOwner || {});


const days = [];
const counts = [];

for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);

  const label = d.toLocaleDateString("en-US", { weekday: "short" });
  days.push(label);

  const count = lw.tasks.filter(task => {
    const taskDate = new Date(task.updatedAt);
    return taskDate.toDateString() === d.toDateString();
  }).length;

  counts.push(count);
}

setWeeklyChart({
  labels: days,
  values: counts
});


  };





  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ width: "100%", padding: "30px 40px", background: "#f9fafb" }}>
        <div className="d-flex justify-content-between align-items-center"> 

        {/* Header */}
        <div
          style={{ color: "#4169E1", cursor: "pointer", marginBottom: "10px" }}
          onClick={() => navigate("/")}
          >
          ← Back to Dashboard
        </div>
        <OpenCloseSidebar/>
          </div>
        <h2 style={{ marginBottom: "20px" }}>Reports Overview</h2>

        {/* Last Week */}
        <div className="report-grid">
       <div className="report-card" style={cardStyle}>
  <h4>Completed Tasks (Last 7 Days) </h4>
  <div className="report-chart">
    <Bar
      data={{
        labels: weeklyChart.labels,
        datasets: [
          {
            label: "Completed Tasks",
            data: weeklyChart.values,
            backgroundColor: "#10b981"
          }
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
         plugins: {
          title: {
            display: true,
            text: `Total: ${lastWeek} tasks`,
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }}
    />
  </div>
</div>


        {/* Pending Work */}
        <div className="report-card" style={cardStyle}>
          <h4>Total Days of Work Pending</h4>
           <div className="report-chart" >

          <Pie
            data={{
              labels: ["Pending Days"],
              datasets: [
                {
                  data: [pendingDays],
                  backgroundColor: ["#f59e0b"]
                }
              ]
            }}
            />
            </div>
        </div>

        {/* Closed by Team */}
        <div className="report-card"  style={cardStyle}>
          <h4>Tasks Closed by Team</h4>
          <div className="report-chart" >

          <Bar
            data={{
              labels: Object.keys(byTeam),
              datasets: [
                {
                  label: "Closed Tasks",
                  data: Object.values(byTeam),
                  backgroundColor: "#3b82f6"
                }
              ]
            }}
            />
            </div>
        </div>

        {/* Closed by Owner */}
        <div  className="report-card" style={cardStyle}>
          <h4>Tasks Closed by Owner</h4>
           <div className="report-chart" >

          <Bar
            data={{
              labels: Object.keys(byOwner),
              datasets: [
                {
                  label: "Closed Tasks",
                  data: Object.values(byOwner),
                  backgroundColor: "#8b5cf6"
                }
              ]
            }}
            />
            </div>
        </div>
        </div>
      </div>
      <style>
        {

          `.report-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.report-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.report-card h4 {
  font-size: 14px;
  margin-bottom: 8px;
}

.report-chart {
  height: 200px;
}

/* Mobile */
@media (max-width: 768px) {
  .report-grid {
    grid-template-columns: 1fr;
  }
}


/* Small Mobile - 400px and below */
@media (max-width: 800px) {
  .report-card {
    width: 90vw;
  }

  .report-card h4 {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .report-chart {
    height: 170px;
  }
}
@media (max-width: 400px) {
  .report-card {
    width: 70vw;
  }


}
          `
        }
      </style>
    </div>
  );
}
