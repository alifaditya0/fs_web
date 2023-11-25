const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/db');

const secretKey = 'kunciRahasiaYangSama';

// Example error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
};

// Get all customers
router.get('/', (req, res) => {
  pool.query('SELECT * FROM customer ORDER BY id_customer DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server failed',
        error: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data customer',
        data: rows,
      });
    }
  });
});

// Register a new customer
// router.post('/register', [
//   body('nama').notEmpty().withMessage('Isi nama'),
//   body('alamat').notEmpty().withMessage('Isi alamat'),
//   body('no_hp').notEmpty().withMessage('Isi no hp'),
//   body('email').notEmpty().withMessage('Isi email').isEmail(),
//   body('password').notEmpty().withMessage('Isi password').isLength({ min: 5 }),
// ], (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ error: errors.array() });
//   }

//   const { nama, no_hp, alamat, email, password } = req.body;
//   const checkUserQuery = 'SELECT * FROM customer WHERE email = ?';

//   pool.query(checkUserQuery, [email], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Server Error', msg: err });
//     }
//     if (result.length > 0) {
//       return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
//     }

//     // Kode tanpa penggunaan bcrypt untuk hash password (tidak aman)
//     const insertUserQuery = 'INSERT INTO customer (nama, alamat, email, no_hp, password) VALUES (?,?,?,?,?)';
//     pool.query(insertUserQuery, [nama, alamat, email, no_hp, password], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: 'Server Error', msg: err });
//       }

//       const payload = { userId: result.insertId, nama };
//       const token = jwt.sign(payload, secretKey);
//       const updateTokenQuery = 'UPDATE customer SET token = ? WHERE id_customer = ?';

//       pool.query(updateTokenQuery, [token, result.insertId], (err, updateResult) => {
//         if (err) {
//           return res.status(500).json({ error: 'Server Error' });
//         }
//         res.json({ token });
//       });
//     });
//   });
// });

// Get customer by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const results = await query(
      `SELECT pesan.*, film.judul AS judul_film, film.gambar AS gambar, 
      film.genre AS genre_film,
      film.harga_tiket AS harga_tiket_film
      FROM pesan 
      INNER JOIN film ON pesan.id_film = film.id_film 
      WHERE pesan.id_pesan = ?`,
      id
    );

    if (results.length <= 0) {
      return res.status(404).json({
        success: false,
        message: 'Not Found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data pesan',
      data: results[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error,
    });
  }
});

// Update customer by ID
router.patch('/update/:id', [
  body('nama').notEmpty(),
  body('alamat').notEmpty(),
  body('email').notEmpty(),
  body('no_hp').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }

  const id = req.params.id;
  const { nama, alamat, email, no_hp } = req.body;
  const data = { nama, alamat, email, no_hp };

  pool.query('UPDATE customer SET ? WHERE id_customer = ?', [data, id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data customer successfully updated',
      });
    }
  });
});

// Delete customer by ID
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM customer WHERE id_customer = ?', id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Data deleted',
      });
    }
  });
});

// Login route


// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   connection.query('SELECT * FROM customer WHERE email = ?', [email], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: 'Server Error' });
//     }
//     if (results.length === 0) {
//       return res.status(401).json({ error: 'Gagal masuk' });
//     }

//     const user = results[0];

//     // Compare passwords
//     if (user.password !== password) {
//       return res.status(401).json({ error: 'Kata sandi salah' });
//     }

//     if (user.token) {
//       const token = user.token;
//       res.json({ token });
//     } else {
//       const payload = { id_customer: user.id, email };
//       const token = jwt.sign(payload, secretKey);

//       // Update token in the database
//       const updateTokenQuery = 'UPDATE customer SET token = ? WHERE id = ?';
//       connection.query(updateTokenQuery, [token, user.id], (updateError, updateResult) => {
//         if (updateError) {
//           return res.status(500).json({ error: 'Server Error' });
//         }
//         res.json({ token });
//       });
//     }
//   });
// });

// Example: Add the error handling middleware to your router
router.use(errorHandler);

module.exports = router;
