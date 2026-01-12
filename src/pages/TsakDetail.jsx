import React, { useState, useEffect } from 'react'
import useCRUD from '../customHooks/useCrud'
import { Url } from "../customHooks/useMainUrl"
import Sidebar from '../components/Sidebar'
import { useParams , useNavigate  } from 'react-router-dom'
const TsakDetail = () => {
  const { url } = Url()
  const { CRUD, loading, error } = useCRUD();
  const [task, setTask] = useState(null);
  const{ id }= useParams()
const navigate = useNavigate();

  useEffect(() => {
    // Fetch task details - replace with actual task ID from route params
    CRUD("get", `${url}/tasks/${id}`).then((res) => {
      // Get first task as example
      if (res?.task ) {
        setTask(res.task);
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


  const Label = ({ text }) => (
  <label
    style={{
      fontSize: '13px',
      color: '#666',
      fontWeight: '600',
      marginBottom: '8px',
      display: 'block'
    }}
  >
    {text.toUpperCase()}
  </label>
);

const Detail = ({ label, value }) => (
  <div style={{ marginBottom: '25px' }}>
    <Label text={label} />
    <div style={{ fontSize: '15px', fontWeight: '500' }}>
      {value || '—'}
    </div>
  </div>
);


console.log(task._id)
const markAsComplete = async () => {
  if (task.status === 'Completed') return;
  const res = await CRUD(
    "post",
    `${url}/tasks/${task._id}`,
    { status: "Completed" , timeToComplete:0 }
  );

  if (res?.task) {
    setTask(res.task); 
  }
};



  return (
  <div style={{ display: 'flex' }}>
    <Sidebar />

    {/* MAIN CONTENT */}
    <div style={{ width: '100%' }}>
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '25px 35px' }}>

        {/* BACK */}
        
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '6px 14px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            borderRadius: '5px',
            fontSize: '13px',
            cursor: 'pointer',
            color: '#666',
            marginBottom: '25px'
          }}
        >
          ← Back to previous page
        </button>
          <h2 className='py-3'>Task Details </h2>
        {/* HEADER */}
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
            {task.name}
          </h1>

          <span
            style={{
              padding: '4px 12px',
              ...getStatusStyle(task.status),
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {task.status}
          </span>
        </div>

        {/* DETAILS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            maxWidth: '1100px'
          }}
        >
          {/* LEFT */}
          <div>
            <Detail label="Project" value={task.project?.name} />
            <Detail label="Team" value={task.team?.name} />

            <div style={{ marginBottom: '25px' }}>
              <Label text="Owners" />
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {task.owners?.map((owner, i) => (
                  <div key={owner._id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
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
                      }}
                    >
                      {getInitials(owner.name)}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {owner.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <Label text="Tags" />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {task.tags?.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#F0F0F0',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: '#666'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <Detail
              label="Due Date"
              value={new Date(task.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            />

            <Detail
              label="Time Remaining"
              value={`${task.timeToComplete} days`}
            />

            <button
  onClick={markAsComplete}
  disabled={task.status === 'Completed'}
  style={{
    marginTop: '30px',
    padding: '12px 24px',
    backgroundColor: task.status === 'Completed' ? '#E6F7ED' : '#4169E1',
    color: task.status === 'Completed' ? '#0D7A3D' : '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: task.status === 'Completed' ? 'default' : 'pointer',
    opacity: task.status === 'Completed' ? 0.8 : 1
  }}
>
  {task.status === 'Completed' ? '✓ Completed' : 'Mark as Complete'}
</button>

          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default TsakDetail