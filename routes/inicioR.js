const Joi = require("joi");
var express = require('express');
var router = express.Router();
const validator = require('express-joi-validation').createValidator({});


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.usid);
  res.render('inicio', { title: 'Express' , sesion: req.session});
});

module.exports = router;