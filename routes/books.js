const express = require('express');
const router = express.Router();
const multer = require('multer');
const getText = require('../helpers/pdf-helpers');

const Book = require('../models/book');
const GoogleSentimentClient = require('../clients/google-sentiment');

const upload = multer({ dest: './public/uploads/' });

const sentimentClient = new GoogleSentimentClient();

router.post('/book/:id', upload.single('uploadedFile'), function (req, res) {
  const newBook = new Book({
    owner: req.params.id,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });

  newBook.save()
    .then((book) => {
      return getText('./public' + book.path)
        .then((doc) => {
          const cleanedDoc = doc.replace('"', "'");
          return sentimentClient.postAnnotate(cleanedDoc);
        })
        .then((sentimentData) => {
          console.log('SUCCESS', sentimentData);
          book.data = sentimentData;
          return book.save();
        });
    })
    .catch(err => console.log('ERROR', err.response.data));
});

router.get('/all/:id', (req, res, next) => {
  const userId = req.params.id;
  Book.find({owner: userId})
    .then((books) => res.json(books))
    .catch(next);
});

router.get('/book/:id', (req, res, next) => {
  const bookId = req.params.id;
  Book.findOne({'_id': bookId})
    .then((book) => {
      console.log('book name: ', book.originalName);
      res.json(book);
    })
    .catch(next);
});

module.exports = router;
