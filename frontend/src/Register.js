import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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

  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [email, setEmail] = useState('');
  const [no_hp, setNoHp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleNamaChange = (e) => setNama(e.target.value);
  const handleAlamatChange = (e) => setAlamat(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNoHpChange = (e) => setNoHp(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/customer/register', {
        nama,
        alamat,
        email,
        no_hp,
        password,
      });
  
      console.log('Response data:', response.data);
  
        console.log('Pendaftaran berhasil:', response.data.message);
        navigate('/login');
 
    } catch (error) {
      console.error('Gagal mendaftar:', error);
      setError(error.message || 'Unknown error');
    }
  };
  return (
    <div style={backgroundStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <div>
          {/* Input fields */}
          <input
            style={inputStyle}
            type="text"
            name="nama"
            placeholder="Nama"
            value={nama}
            onChange={handleNamaChange}
          />
          <input
            style={inputStyle}
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={alamat}
            onChange={handleAlamatChange}
          />
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            style={inputStyle}
            type="text"
            name="no_hp"
            placeholder="No. HP"
            value={no_hp}
            onChange={handleNoHpChange}
          />
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {/* Error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* Submit button */}
          <button style={buttonStyle} onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
