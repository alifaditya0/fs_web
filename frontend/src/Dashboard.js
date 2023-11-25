import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [films, setFilms] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const url = "http://localhost:3000/static/";

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/film");
      const data = response.data.data;
      setFilms(data);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
        },
      });
      const userData = response.data.data;
      setUsername(userData.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    // Add logic to clear user session or perform logout action
    // For now, let's assume you're just redirecting to the login page
    navigate("/login");
  };

  const backgroundStyle = {
    backgroundImage: 'url("/bg2.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const welcomeSectionStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '20px',
    color: 'white',
  };

  const cardContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginTop: '20px',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '300px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
  };

  const cardImageStyle = {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageTitleStyle = {
    fontSize: '1.2rem',
    marginTop: '10px',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const genreStyle = {
    color: '#555',
  };

  const cardContentStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const handleCardHover = (index) => {
    // Add any hover effects here
  };

  return (
    <div style={backgroundStyle}>
      <div style={welcomeSectionStyle}>
        <h2 style={{ fontFamily: 'Teko, sans-serif', fontSize: '4rem' }}>
          Selamat Datang di Dashboard, {username}
        </h2>
        <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={cardContainerStyle}>
        {films.map((film, idx) => (
          <Link key={idx} to={`/pesan/${film.id_film}`} style={{ textDecoration: 'none' }}>
            <div
              style={cardStyle}
              onMouseEnter={() => handleCardHover(idx)}
              onMouseLeave={() => handleCardHover(null)}
            >
              <div style={cardImageStyle}>
                <img
                  src={url + film.gambar}
                  alt="icon"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <h3 style={{ ...imageTitleStyle, color: 'black' }}>{film.judul}</h3>
              </div>
              <div style={cardContentStyle}>
                <h3 style={titleStyle}>{film.judul}</h3>
                <p style={genreStyle}>{film.genre}</p>
                <p>Durasi: {film.durasi}</p>
                <p>Tanggal Rilis: {film.tanggal_rilis}</p>
                <p>Harga Tiket: {film.harga_tiket}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
