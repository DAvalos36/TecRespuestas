const Joi = require("joi");
var express = require('express');
var router = express.Router();
const validator = require('express-joi-validation').createValidator({});
let pool  =  require('../db/config.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.usid);
  pool.getConnection().then(conn =>{
    conn.query("SELECT publicaciones_aprobadas.id_publicacion, publicaciones.titulo, publicaciones.fecha, usuarios.nombre, (SELECT COUNT(*) FROM comentarios WHERE comentarios.id = publicaciones_aprobadas.id_publicacion) AS num_comentarios FROM `publicaciones_aprobadas` INNER JOIN publicaciones ON publicaciones_aprobadas.id_publicacion = publicaciones.id INNER JOIN usuarios ON usuarios.id = publicaciones.id_propietario ORDER BY publicaciones.fecha").then(r => {
      res.render('inicio', { title: 'Express' , sesion: req.session, r:r});
    }).catch(err => {
      res.send("ERROR CONSULTA");
    });
    conn.end();
  }).catch(err => {
    res.send("ERROR CONECTAR DB");
  })
});

module.exports = router;