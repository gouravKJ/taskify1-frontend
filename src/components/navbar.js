import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userid');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="logo">TaskIfy</h1>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {!token ? (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to='/' onClick={()=>setMenuOpen(false)}>Home</Link>
          </>
        ) : (
          <>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button>
          </>
        )}
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;
