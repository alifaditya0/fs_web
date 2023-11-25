// film.js (backend/routes)
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

// Route for retrieving all films
router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM film');
    return res.status(200).json({
      status: true,
      message: 'All film data',
      data: results,
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for retrieving film by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = await query('SELECT * FROM film WHERE id_film = ?', id);

    if (results.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data film',
      data: results[0],
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for adding new film
router.post('/add', [
  body('judul').notEmpty(),
  body('genre').notEmpty(),
  body('durasi').notEmpty(),
  body('tanggal_rilis').notEmpty(),
  body('harga_tiket').notEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const data = req.body;

  try {
    const results = await query('INSERT INTO film SET ?', data);
    return res.status(201).json({
      status: true,
      message: 'Film added successfully',
      data: results[0],
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for updating film by ID
router.patch('/update/:id', [
  body('judul').notEmpty(),
  body('genre').notEmpty(),
  body('durasi').notEmpty(),
  body('tanggal_rilis').notEmpty(),
  body('harga_tiket').notEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const id = req.params.id;
  const data = req.body;

  try {
    await query('UPDATE film SET ? WHERE id_film = ?', [data, id]);
    return res.status(200).json({
      status: true,
      message: 'Film updated successfully',
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route for deleting film by ID
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM film WHERE id_film = ?', id);
    return res.status(200).json({
      status: true,
      message: 'Film deleted successfully',
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = router;
