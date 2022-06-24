var express = require('express');
const sequelize = require('sequelize');
var router = express.Router();
const Publicaciones = require("../models/publicaciones.js");
const Usuarios = require("../models/usuarios.js");
const PublicacionesAprobadas = require('../models/publicaciones_aprobadas.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.rango == 2){
    Publicaciones.findAll({include: [{model: PublicacionesAprobadas, required: false },
      {model: Usuarios, attributes: {exclude: ["contrasena"]} } ],
      where: sequelize.where(sequelize.col("publicaciones_aprobada.id"), "Is", null
    ) }).then(Publicaciones => {
        res.render("administrador", {publicaciones: Publicaciones, sesion: req.session});
        // CONTRUIR PAGINA PARA ESTO
    }).catch(err => {
      res.status(500).json({msj: "Error al conectar con la base de datos", error: err});
    });
  }
  else{
    res.redirect("/sesiones");
  }
});

router.post("/", (req, res) => {
  if (req.session.rango == 2){
    console.log(req.body);
    const { idPublicacion } = req.body;
    PublicacionesAprobadas.create({id_publicacion: idPublicacion, id_administrador: req.session.usid}).then(r => {
      res.end();
    }).catch(err => {
      res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});
router.put("/", (req, res) => {
  console.log(req.body);
  const { idPublicacion, idUsuario } = req.body;
  if (req.session.rango == 2){
    Usuarios.update({rango: false}, {where: {id: idUsuario}}) .then(n => {
      Publicaciones.destroy({where: {id: idPublicacion}}).then(r => {
        res.end();
      }).catch(err => {
        res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
      });
    }).catch(err => {
      res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});
router.delete("/", (req, res) => {
  if (req.session.rango == 2){
    console.log(req.body);
    const { idPublicacion } = req.body;
    Publicaciones.destroy({where: { id: idPublicacion}}).then(c => {
      res.end();
    }).catch(err => {
      res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});

module.exports = router;