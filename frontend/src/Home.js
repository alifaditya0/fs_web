import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const BackgroundStyle = {
    backgroundImage: 'url("/bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  };

  const buttonStyle = {
    fontFamily: 'Teko, sans-serif',
    backgroundColor: '#E50914',
    color: 'white',
    padding: '15px 30px',
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
    margin: '0 10px', // Tambahkan margin antara tombol Login dan Register
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff5252', // Ganti warna sesuai keinginan saat tombol dihover
  };

  const titleStyle = {
    fontFamily: 'Teko, sans-serif',
    fontWeight: 1000,
    fontSize: '5rem',
    color: '#E50914',
    textAlign: 'center',
  };

  return (
    <div style={BackgroundStyle}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand" href="#home" style={{ color: '#E50914' }}>
            Nonton Kuy
          </a>
        </div>
      </nav>

      <div className="d-flex flex-column align-items-center" style={{ height: '80vh', justifyContent: 'center' }}>
        <h2 style={titleStyle}>SELAMAT DATANG DI NONTON KUY</h2>
        <div className="mt-4">
          <Link to="/login">
            <button
              type="button"
              className="btn btn-danger btn-lg"
              style={{ ...buttonStyle }}
              onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...buttonHoverStyle })}
              onMouseLeave={(e) => (e.target.style = { ...buttonStyle })}
            >
              LOGIN
            </button>
          </Link>
          <Link to="/register">
            <button
              type="button"
              className="btn btn-danger btn-lg"
              style={{ ...buttonStyle }}
              onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...buttonHoverStyle })}
              onMouseLeave={(e) => (e.target.style = { ...buttonStyle })}
            >
              REGISTER
            </button>
          </Link>
        </div>
      </div>

      {/* ... konten film terbaru dan footer ... */}
    </div>
  );
};

export default Home;
