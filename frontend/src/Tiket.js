// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import './TiketFilm.css';

// const url = "http://localhost:3000/static/";

// const TiketFilm = () => {
//   const [pesan, setPesan] = useState([]);

//   const { id } = useParams();

//   const fetchData = async () => {
//     try {
//       const response1 = await axios.get(`http://localhost:3000/api/pesan/${id}`);
//       const data1 = response1.data.data || [];
  
//       console.log("Data from API:", data1);
  
//       if (Array.isArray(data1)) {
//         setPesan(data1);
//       } else if (typeof data1 === 'object') {
//         // If it's an object, convert it to an array
//         setPesan([data1]);
//       } else {
//         console.error("Data is not an array or object:", data1);
//       }
//     } catch (error) {
//       console.error("Error fetching pesan data:", error);
//     }
//   };
  

//   useEffect(() => {
//     fetchData();
//   }, []); // Empty dependency array to run once on mount

//   console.log("State pesan:", pesan);

//   const tiketStyle = {
//     backgroundColor: "black",
//     width: "60%",
//     height: "300px",
//     border: "2px solid #E50914",
//     borderRadius: "10px",
//     padding: "20px",
//     margin: "50px auto",
//     display: "flex",
//     flexDirection: "row",
//   };

//   const imageStyle = {
//     width: "40%",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//   const contentStyle = {
//     color: "white",
//     width: "60%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//   };

//   const buttonStyle = {
//     backgroundColor: "#E50914",
//     color: "white",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "20px",
//   };
//   function formatAngka(angka) {
//     const parsedNumber = parseFloat(angka);
//     if (isNaN(parsedNumber)) {
//       return "Harga tidak tersedia";
//     }
//     return parsedNumber.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }
//   return (
//     <div>
//       {pesan.map((psn, index) => (
//         <div key={index} style={tiketStyle}>
//           <div style={{...imageStyle, width:"40%"}}>
//             <img
//               src={url + psn.gambar}
//               alt="film poster"
//               style={{ width: "100%", maxWidth: "200px", height: "auto" }}
//             />
//           </div>
//           <div style={contentStyle}>
//             <h2 style={{ color: "white", margin: "10px 0" }}>
//               {psn.judul}
//             </h2>
//             <hr style={{ margin: "10px 0", borderColor: "#E50914" }} />
//             <p style={{ margin: "10px 0" }}>
//               Genre : {psn.genre}
//             </p>
//             <p style={{ margin: "10px 0" }}>
//               Nomor Kursi : {psn.nomor_kursi}
//             </p>
//             <p style={{ margin: "10px 0" }}>
//               Tanggal Pemesanan : {psn.tanggal_pemesanan}
//             </p>
//             <p style={{ margin: "10px 0" }}>
//   Total Harga Tiket : {psn && psn.total_harga ? formatAngka(psn.total_harga) + " IDR" : "Harga tidak tersedia"}
// </p>
    
//             <hr style={{ margin: "20px 0", borderColor: "#E50914" }} />
//           </div>
//         </div>
//       ))}
//       <div style={{ display: "flex", justifyContent: "center" }}>
//         <Link to="/dashboard">
//           <button style={buttonStyle}>Back</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default TiketFilm;
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./TiketFilm.css";
import QRCode from "qrcode.react";


const url = "http://localhost:3000/static/";

const TiketFilm = () => {
  const [pesan, setPesan] = useState([]);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response1 = await axios.get(`http://localhost:3000/api/pesan/${id}`);
      const data1 = response1.data.data || [];

      console.log("Data from API:", data1);

      if (Array.isArray(data1)) {
        setPesan(data1);
      } else if (typeof data1 === 'object') {
        // If it's an object, convert it to an array
        setPesan([data1]);
      } else {
        console.error("Data is not an array or object:", data1);
      }
    } catch (error) {
      console.error("Error fetching pesan data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run once on mount

  console.log("State pesan:", pesan);


  //function for qr code
// Fungsi untuk menghasilkan string QR code secara acak
function generateRandomQRCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

  return (
    <div>
      {pesan.map((psn, index) => (
        <div key={index} className="ticket-container" style={{marginTop:"20rem",marginRight:"20rem",marginLeft:"20rem"}}>
          <div className="left">
            <div >
              <p className="admit-one">
                <span>{psn.judul}</span>
                <span>{psn.judul}</span>
                <span>{psn.judul}</span>
              </p>
              <div className="image" >
               <img 
                  src={url+psn.gambar} alt="film poster" 
                  style={{width:"120%", maxWidth:"200px", height:"265px"}}
               />
              </div>
            </div>
            <div className="ticket-info">
              <p className="date">
                <span>{psn.date}</span>
                <span className="june-29">Nonton Kuy</span>
                <span>{psn.year}</span>
              </p>
              <div className="show-name">
                <h1>{psn.judul}</h1>
                <h2>{psn.genre}</h2>
              </div>
              <div className="time">
                <p>{psn.tanggal_pemesanan}</p>
              </div>
              <p className="location">
                <span>{psn.location}</span>
                <span className="separator">
                  <i className="far fa-smile"></i>
                </span>
                <span>{psn.city}</span>
              </p>
            </div>
          </div>
          <div className="right">
            <p className="admit-one">
               <span>{psn.judul}</span>
                <span>{psn.judul}</span>
                <span>{psn.judul}</span>
            </p>
            <div className="right-info-container">
              <div className="show-name">
                <h1>{psn.show_name}</h1>
              </div>
              <div className="time">
                <p>Time : {psn.tanggal_pemesanan}</p>
                <p>Nomer Kursi : <span>Seat</span> {psn.nomor_kursi}</p>
              </div>
              <div className="barcode" style={{marginBottom:"50px"}}>
                <QRCode value={generateRandomQRCode()} />
              </div>
              <p className="ticket-number">{psn.ticket_number}</p>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/dashboard">
          <button className="buttonStyle">Back</button>
        </Link>
      </div>
    </div>
  );
};



export default TiketFilm;
