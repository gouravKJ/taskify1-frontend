import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Register() {
const[username,setusername]=useState('');
const[email,setemail]=useState('');
const[password,setpassword]=useState('');
const navigate=useNavigate();

const handlesubmit=async(e)=>{
    e.preventDefault();
    const res=await fetch(`${process.env.REACT_APP_API}/api/register`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({username,email,password})
    });

    const data=await res.json();
    if(res.ok) {
        alert('registerd');
        navigate('/login');

    } else{
        alert(data.message || 'Registration failed');
    }
}
    return(
        <div className='register-container'>
            <h2>Register</h2>
         <form onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
        </div>
    )

}

export default Register;