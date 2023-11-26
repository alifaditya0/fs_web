import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const backgroundStyle = {
    backgroundImage: 'url("/bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formStyle = {
    color: 'red',
    backgroundColor: 'black',
    padding: '40px',
    borderRadius: '5px',
    width: '300px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    backgroundColor: '#E50914',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        navigate('/Dashboard');
        window.location.reload();
      } else {
        console.error('Login failed: Token not received');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Login failed: Incorrect password or username');
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={formStyle}>
        <h1 style={{ textAlign: 'center' }} className="mt-5">Login</h1>
        <div className="form-group">
          <label>Username:</label>
          <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button style={buttonStyle} onClick={handleLogin}>Login</button>
        <p style={{ marginTop: '10px' }}>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}



export default Login;
