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
    nama: '',
    alamat: '',
    email: '',
    no_hp: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({
    nama: '',
    alamat: '',
    email: '',
    no_hp: '',
    password: '',
  });

  const clearFieldErrors = () => {
    setFieldErrors({
      nama: '',
      alamat: '',
      email: '',
      no_hp: '',
      password: '',
    });
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

    if (!formData.nama || !formData.alamat || !formData.email || !formData.no_hp || !formData.password) {
      setFieldError('nama', 'Please enter your name.');
      setFieldError('alamat', 'Please enter your address.');
      setFieldError('email', 'Please enter your email.');
      setFieldError('no_hp', 'Please enter your phone number.');
      setFieldError('password', 'Please enter your password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/customer/store', formData);
      console.log(response.data);
      // Handle success, e.g., redirect or display success message
    } catch (error) {
      console.error('Error logging in', error);
      // Handle error, e.g., display error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {Object.keys(fieldErrors).map((key) => (
          fieldErrors[key] && <p key={key} style={{ color: 'red' }}>{fieldErrors[key]}</p>
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form>
          <input
            style={inputStyle}
            type="text"
            name="nama"
            placeholder="Nama"
            value={formData.nama}
            onChange={handleChange}
          />
          <input
            style={inputStyle}
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={handleChange}
          />
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
            type="text"
            name="no_hp"
            placeholder="Nomer Telepon"
            value={formData.no_hp}
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
