const express = require('express');
const router = express.Router();
const {getLogin, getRegister,postLogin, postRegister} = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landingPage');
});

// GET login
router.get('/login', getLogin);

// POST login
router.post('/login', postLogin);

// GET register
router.get('/register', getRegister);

// POST regsiter
router.post('/register', postRegister);

// GET contact
router.get('/contact', (req, res, next) =>{
  res.send('contact page');
});
// GET about
router.get('/about', (req, res, next) =>{
  res.send('about us page');
});

module.exports = router;
