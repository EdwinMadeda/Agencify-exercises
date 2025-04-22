const express = require('express');
const router = express.Router();
const path = require('path');
const {
  getAllBooks,
  createNewBook,
  updateBook,
  deleteBook,
  getBook,
} = require('../../controller/bookController');

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);
router.route('/').get(getAllBooks).post(createNewBook);

module.exports = router;
