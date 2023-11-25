import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
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

  const inputStyle = {
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    boxSizing: 'border-box',
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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const clearFieldErrors = () => {
    setFieldErrors({ email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearFieldErrors();
  };

  const setFieldError = (fieldName, message) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFieldError('email', 'Please enter your email.');
      setFieldError('password', 'Please enter your password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/customer/login', formData);

      if (response.status === 200) {
        console.log('Login successful:', response.data.token);
        localStorage.setItem('token', response.data.token);
        // Handle login success, e.g., redirect or display success message
      } else {
        setError(response.data.error || 'Error logging in');
        console.error('Error logging in:', response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(`Error logging in: ${error.message}`);
        console.error('Error logging in', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {fieldErrors.email && <p style={{ color: 'red' }}>{fieldErrors.email}</p>}
        {fieldErrors.password && <p style={{ color: 'red' }}>{fieldErrors.password}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button style={buttonStyle} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
