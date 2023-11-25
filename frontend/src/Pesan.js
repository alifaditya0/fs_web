import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Pesan = () => {
  const [film, setFilm] = useState(null);
  const [pesan, setPesan] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalHarga, setTotalHarga] = useState(0);
  const [hargaTiketAwal, setHargaTiketAwal] = useState(0);
  const { id } = useParams();
  const apiUrlFilm = `http://localhost:3000/api/film/${id}`;
  const apiUrlPesan = "http://localhost:3000/api/pesan";
  const apiUrlCheckout = "http://localhost:3000/api/pesan/checkout";
  const url = "http://localhost:3000/static/";
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataFilm();
  }, [id]);

  const fetchDataFilm = async () => {
    try {
      const response = await axios.get(apiUrlFilm);
      const filmData = response.data.data || null;

      if (filmData && filmData.harga_tiket === undefined) {
        filmData.harga_tiket = 100000;
      }

      setFilm(filmData);
      setHargaTiketAwal(filmData.harga_tiket);
    } catch (error) {
      console.error("Error fetching film data: ", error);
    }

    try {
      const response = await axios.get(apiUrlPesan);
      setPesan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pesan data: ", error);
    }
  };

  const handleSeatClick = (seatNumber) => {
    const isSeatBooked = pesan.some(
      (pesanItem) =>
        pesanItem.id_film?.toString() === id &&
        pesanItem.nomor_kursi
          .split(", ")
          .map((num) => num.trim()) // Trim spaces around seat numbers
          .includes(seatNumber.toString())
    );

    const isSelected = selectedSeats.includes(seatNumber);

    if (isSeatBooked) {
      // Seat is already booked, do nothing
      return;
    }

    if (isSelected) {
      // Seat is already selected, remove it from selectedSeats
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((seat) => seat !== seatNumber)
      );
    } else {
      // Seat is available, add it to selectedSeats
      // Check if the seat is already selected by another user
      const isSeatSelectedByAnotherUser = pesan.some(
        (pesanItem) =>
          pesanItem.id_film?.toString() !== id &&
          pesanItem.nomor_kursi
            .split(", ")
            .map((num) => num.trim()) // Trim spaces around seat numbers
            .includes(seatNumber.toString())
      );

      if (!isSeatSelectedByAnotherUser) {
        setSelectedSeats((prevSelectedSeats) => [
          ...prevSelectedSeats,
          seatNumber,
        ]);
      } else {
        console.error("Seat is already selected by another user");
      }
    }
  };

  useEffect(() => {
    if (film) {
      const total =
        selectedSeats.length > 0
          ? parseFloat(quantity) * parseFloat(hargaTiketAwal)
          : 0;
      setTotalHarga(total);
    }
  }, [film, hargaTiketAwal, quantity, selectedSeats]);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedSeats.length === 0) {
      console.error("Harap pilih kursi terlebih dahulu.");
      return;
    }
  
    const formData = {
      id_film: id,
      nomor_kursi: selectedSeats.join(", "),
      total_harga: totalHarga,
    };
  
    try {
      const response = await axios.post(apiUrlCheckout, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Submit Response:", response);
  
      if (response.status === 201) {
        console.log("Pemesanan berhasil!");
  
        // Fetch the latest pesan data to get the last id_pesan
        const latestPesanResponse = await axios.get(apiUrlPesan);
        const latestPesan = latestPesanResponse.data.data;
  
        console.log("Latest Pesan:", latestPesan);
  
        if (latestPesan.length > 0) {
          const lastIdPesan = latestPesan[latestPesan.length - 1].id_pesan;
          navigate(`/tiket/${lastIdPesan }`);
        } else {
          console.error("Tidak dapat menemukan id_pesan terakhir.");
        }
      } else {
        console.error(
          "Pemesanan gagal. Server merespons:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
  
      if (error.response && error.response.data) {
        console.log("Validation Errors:", error.response.data.errors);
      }
    }
  };
  
  
  const backgroundStyle = {
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  };

  const cardContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  };

  const cardStyle = {
    backgroundColor: "#E50914",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    textAlign: "center",
  };

  return (
    <div style={backgroundStyle}>
      {film && (
        <div>
          <div style={cardContainerStyle}>
            <div style={cardStyle}>
              <img
                src={url + film.gambar}
                alt="icon"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={cardStyle}>
              <h3>{film.judul}</h3>
              <p>{film.genre}</p>
              <p>Durasi: {film.durasi}</p>
              <p>Tanggal Rilis: {film.tanggal_rilis}</p>
              <p>
                Harga Tiket:{" "}
                {film.harga_tiket.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>
          </div>

          <div>
            {Array.isArray(pesan) && pesan.length > 0 ? (
              <div>
                {pesan
                  .filter(
                    (pesanItem) =>
                      pesanItem.film?.id?.toString() === id
                  )
                  .map((pesanItem, index) => (
                    <div key={index} style={cardStyle}>
                      <img
                        src={url + pesanItem.film.gambar}
                        alt="icon"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <p>
                        Tanggal Pemesanan:{" "}
                        {new Date(pesanItem.tanggal_pemesanan).toLocaleDateString()}
                      </p>
                      <p>
                        Total Harga:{" "}
                        {pesanItem.total_harga.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                      <p>
                        Nomor Kursi: {pesanItem.nomor_kursi.join(", ")}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p>Tidak ada pemesanan tersedia</p>
            )}

            <p style={{ color: "white" }}>Available Seats:</p>
            <div>
              <form onSubmit={handleSubmit}>
                {[...Array(10)].map((_, row) => (
                  <div key={row} style={{ display: "flex" }}>
                    {[...Array(10)].map((_, col) => {
                      const seatNumber = row * 10 + col + 1;
                      const isSeatBooked = pesan.some(
                        (pesanItem) =>
                          pesanItem.id_film?.toString() === id &&
                          pesanItem.nomor_kursi.includes(seatNumber.toString())
                      );
                      const isSelected = selectedSeats.includes(seatNumber);

                      return (
                        <div
                          key={col}
                          style={{
                            width: "20px",
                            height: "20px",
                            margin: "2px",
                            backgroundColor: isSeatBooked
                              ? "red"
                              : isSelected
                              ? "blue"
                              : "green",
                            cursor: isSeatBooked ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                          onClick={() => {
                            // Check if the seat is not booked before handling the click
                            if (!isSeatBooked) {
                              handleSeatClick(seatNumber);
                            }
                          }}
                        >
                          {isSeatBooked && "X"}
                          {!isSeatBooked && isSelected && "S"}
                          {!isSeatBooked && !isSelected && seatNumber}
                        </div>
                      );
                    })}
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn btn-danger btn-lg"
                  disabled={selectedSeats.length === 0}
                >
                  CHECKOUT
                </button>
              </form>
            </div>

            <p style={{ color: "white" }}>Total Tiket: {quantity}</p>

            <div style={{ display: "flex", alignItems: "center", color: "white" }}>
              <button onClick={decrementQuantity}>-</button>
              <p style={{ margin: "0 10px" }}>{quantity}</p>
              <button onClick={incrementQuantity}>+</button>
            </div>

            <p style={{ color: "white" }}>
  Total Harga: RP{" "}
  {totalHarga.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(".", ",")}
</p>


            <Link to="/dashboard" style={{ position: "fixed", bottom: "10px", right: "10px" }}>
              <button className="btn btn-primary" style={{ marginRight: "10px" }}>
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pesan;
