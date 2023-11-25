const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

// Handle database query using async/await
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Middleware for handling errors
const handleErrors = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({
    status: false,
    message: 'Server error',
    error: error.message,
  });
};

// Function to check if a seat is booked
const isSeatBooked = async (filmId, seatNumber) => {
  try {
    const results = await query(
      'SELECT id FROM booked_seats WHERE id_film = ? AND seat_number = ?',
      [filmId, seatNumber]
    );
    return results.length > 0;
  } catch (error) {
    throw error;
  }
};

// Route for adding new pesan with selected seats
router.post('/checkout', [
  body('id_film').notEmpty().withMessage('Film ID is required'),
  body('nomor_kursi').notEmpty().withMessage('Seat number is required'),
  body('total_harga').notEmpty().withMessage('Total price is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map(error => error.msg),
    });
  }

  const { id_film, nomor_kursi, total_harga } = req.body;

  try {
    const seatTaken = await query('SELECT * FROM pesan WHERE nomor_kursi = ?', nomor_kursi);

    if (seatTaken.length > 0) {
      return res.status(422).json({
        success: false,
        errors: ['Seat number is already taken'],
      });
    }
  } catch (error) {
    return handleErrors(res, error);
  }

  const data = {
    tanggal_pemesanan: new Date().toISOString().slice(0, 19).replace("T", " "),
    total_harga,
    id_film,
    nomor_kursi,
  };

  try {
    const results = await query('INSERT INTO pesan SET ?', data);
    return res.status(201).json({
      success: true,
      message: 'Success',
      data: results[0],
    });
  } catch (error) {
    return handleErrors(res, error);
  }
});

// Route for retrieving pesan by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = await query(
      `SELECT pesan.*, film.judul, film.gambar, 
      film.genre,
      film.harga_tiket
      FROM pesan 
      INNER JOIN film ON pesan.id_film = film.id_film 
      WHERE pesan.id_pesan = ?`,
      id
    );

    if (results.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data pesan',
      data: results[0],
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for retrieving all pesan
router.get('/', async (req, res) => {
  try {
    const results = await query(
      `SELECT pesan.*, film.judul AS judul_film, film.gambar AS gambar, 
      film.genre AS genre_film,
      film.harga_tiket AS harga_tiket_film
      FROM pesan 
      INNER JOIN film ON pesan.id_film = film.id_film`
    );

    return res.status(200).json({
      success: true,
      message: 'Data pesan',
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Route for updating pesan by ID
router.patch('/update/:id', [
  body('tanggal_pemesanan').notEmpty(),
  body('total_harga').notEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const id = req.params.id;
  const { tanggal_pemesanan, total_harga } = req.body;
  const data = {
    tanggal_pemesanan,
    total_harga,
  };

  try {
    await query('UPDATE pesan SET ? WHERE id_pesan = ?', [data, id]);
    return res.status(200).json({
      status: true,
      message: 'Update successful',
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for deleting pesan by ID
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM pesan WHERE id_pesan = ?', id);
    return res.status(200).json({
      status: true,
      message: 'Data deleted',
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = router;
