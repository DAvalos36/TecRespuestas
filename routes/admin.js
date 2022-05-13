var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.rango == 2){
    res.render("administrador");
  }
  else{
    res.redirect("/sesiones");
  }
});

module.exports = router;