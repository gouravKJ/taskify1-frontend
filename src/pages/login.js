import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userid', data.userId); // ✅ Store userId
      navigate('/');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className='register-container'>
        <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <button onClick={handlesubmit}>Login</button>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
