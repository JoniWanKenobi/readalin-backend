const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFJS = require('pdfjs-dist');
const Book = require('../models/book');


// Route to upload from project base path
const upload = multer({ dest: './public/uploads/' });

PDFJS.disableWorker = true;

router.post('/', upload.single('uploadedFile'), function(req, res){

  const newBook = new Book({
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });

  function gettext(pdfUrl){
    var pdf = PDFJS.getDocument(pdfUrl);
    return pdf.then(function(pdf) { // get all pages text
         var maxPages = pdf.pdfInfo.numPages;
         var countPromises = []; // collecting all page promises
         for (var j = 1; j <= maxPages; j++) {
            var page = pdf.getPage(j);
    
            var txt = "";
            countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text){ // return content promise
                    return text.items.map(function (s) { return s.str; }).join(''); // value page text 
    
                });
            }));
         }
         // Wait for all pages and join text
         return Promise.all(countPromises).then(function (texts) {
           
           return texts.join('');
         });
    });
    }

  newBook.save()
    .then((book) => {
      console.log('book added okuuy');
      return gettext('./public'+book.path);
    })
    .then((doc) => { 
      console.log('pdf loaded');
      console.log('DOC', doc);
    })
    .catch(err => console.log(err));





});




router.get('/', (req, res, next) => {
  Book.find()
    .then((books) => res.json(books))
    .catch(next);
});


module.exports = router;
