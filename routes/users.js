var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/home', function(req, res, next) {
  res.send('HOME PAGE ON LOGIN');
});

module.exports = router;
