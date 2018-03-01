const express = require('express');
const router = express.Router();
const multer = require('multer');

const Book = require('../models/book');


// Route to upload from project base path
const upload = multer({ dest: './public/uploads/' });

router.post('/', upload.single('uploadedFile'), function(req, res){
  console.log('req.body: ', req.body);

  const newBook = new Book({
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });
    newBook.save((err) => {
      console.log(err);
  });
});




router.get('/', (req, res, next) => {
  Book.find()
    .then((books) => res.json(books))
    .catch(next);
});


module.exports = router;
