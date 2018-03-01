const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/readalin', {useMongoClient: true});
const Book = require('../models/book');

const books = [
  {
    title: 'The hedonistic imperative',
    author: 'David Pierce'
  },
  {
    title: 'The evolution of human feelings',
    author: 'Jonathan Mills'
  },
  {
    title: 'All you need to know about numbers',
    author: 'Francis Bacon'
  },
  {
    title: 'Javascript for dummies',
    author: 'Andre Torval'
  },
  {
    title: 'The bilble',
    author: 'God'
  },
  {
    title: 'The origin of species',
    author: 'Charles Darwin'
  }
]




Book.remove()
  .then(() => Book.create(books))
  .then(() => {
    console.log('books seed ok');
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));