var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("recorrido", {sesion: req.session} );
});
router.get('/redireccionar', function(req, res, next) {
  res.redirect("http://www.itparral.edu.mx/images/RecorridosVirtuales/Pano2VR/output/index.html");
});


module.exports = router;