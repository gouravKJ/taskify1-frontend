import React, { useEffect, useState } from 'react';
import socket from '../socket';
import './dashboard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneduser: ''
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [darkmode, setdarkmode] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkmode);
    localStorage.setItem('darkmode', darkmode);
  }, [darkmode]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (err) {
      console.warn("❌ Task Fetch Error:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/tasks/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (err) {
      console.warn("❌ Log Fetch Error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchLogs();

    socket.on('taskadded', (task) => {
      setTasks(prev => [...prev, task]);
      fetchLogs();
    });

    socket.on('taskupdated', (task) => {
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      fetchLogs();
    });

    socket.on('taskdeleted', (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      if (editTaskId === taskId) {
        setEditTaskId(null);
        resetForm();
      }
      fetchLogs();
    });

    return () => {
      socket.off('taskadded');
      socket.off('taskupdated');
      socket.off('taskdeleted');
    };
  }, [editTaskId]);

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'medium', assigneduser: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return alert("Title is required");

    const columnNames = ['Todo', 'In Progress', 'Done'];
    const titleExists = tasks.some(t => t.title.toLowerCase() === form.title.toLowerCase());

    if (columnNames.includes(form.title.trim()) || titleExists) {
      return alert("❌ Title must be unique and not match column names.");
    }

    if (editTaskId) {
      socket.emit('updatetask', { taskId: editTaskId, updates: form, userId });
      setEditTaskId(null);
    } else {
      socket.emit('addtask', form);
    }

    resetForm();
  };

  const handleSmartAssign = () => {
    if (!users.length) return alert("No users available");

    const workload = {};
    users.forEach(user => {
      workload[user._id] = tasks.filter(t => t.assigneduser?._id === user._id && t.status !== 'Done').length;
    });

    const leastLoaded = Object.entries(workload).sort((a, b) => a[1] - b[1])[0];
    if (leastLoaded) {
      setForm({ ...form, assigneduser: leastLoaded[0] });
    } else {
      alert("No users found");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      socket.emit('deletetask', { taskId: id, userId });
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assigneduser: task.assigneduser?._id || ''
    });
    setEditTaskId(task._id);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const newStatus = destination.droppableId;
    if (source.droppableId !== newStatus) {
      socket.emit('updatetask', {
        taskId: draggableId,
        updates: { status: newStatus },
        userId,
      });
    }
  };

  return (
    <div className={darkmode ? 'dark' : ''}>
      <div className="dashboard-container">
    
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button onClick={() => setdarkmode(!darkmode)}>
            {darkmode ? '🌞' : '🌙'}
          </button>
        </div>
        <h2>Welcome, {localStorage.getItem('username') || 'User'}!</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={form.assigneduser}
            onChange={(e) => setForm({ ...form, assigneduser: e.target.value })}
          >
            <option value="">Assign User</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
          <button type="submit">{editTaskId ? 'Update' : 'Add'} Task</button>
          <button type="button" onClick={handleSmartAssign}>Smart Assign</button>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board">
            {['Todo', 'In Progress', 'Done'].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3>{status}</h3>
                    {tasks
                      .filter(t => t.status === status)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h4>{task.title}</h4>
                              <p>{task.description}</p>
                              <small>👤 {task.assigneduser?.username || 'Unassigned'}</small>
                              <div>
                                <button onClick={() => handleEdit(task)}>✏️</button>
                                <button onClick={() => handleDelete(task._id)}>🗑️</button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <div className="log-panel">
          <h3>Activity Log</h3>
          <ul>
            {logs.map((log, i) => (
              <li key={i}>
                {log.user?.username || 'Unknown'} {log.action} <b>{log.task?.title || 'Unknown Task'}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
