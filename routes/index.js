var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.usid);
  res.render('index');
});

module.exports = router;
