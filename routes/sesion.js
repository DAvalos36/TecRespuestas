var express = require('express');
const Joi = require("joi");
const validator = require('express-joi-validation').createValidator({});
// let pool = require('../db/config.js');
const Usuarios = require('../models/usuarios.js');
const bcrypt = require('bcrypt');
const { date } = require('joi');
var router = express.Router();

const rounds = 10;

const esquemaRegistro = Joi.object({
  correo: Joi.string().email().regex(/^[\w-\.]+@(itparral.edu.mx|parral.tecnm.mx)$/).required(),
  nombre: Joi.string().min(3).required(),
  apellido: Joi.string().min(4).required(),
  pass: Joi.string().min(6).required()
});



const esquemaLogin = Joi.object({
  correo: Joi.string().email().regex(/^[\w-\.]+@(itparral.edu.mx|parral.tecnm.mx)$/).required(),
  pass: Joi.string().min(6).required()
});

/* GET users listing. */
router.get('/', (req, res) => {
  res.render("sesiones");
})
router.post('/iniciar', validator.body(esquemaLogin), function (req, res, next) {
  console.log(req.body);
  const { correo, pass } = req.body;
  Usuarios.findOne({where: {correo}}).then(usuario => {
    if (usuario !== null) {
      console.log('SI HAY');
      if(usuario.acceso){
        bcrypt.compare(pass, usuario.contrasena).then(resultado => {
          if (resultado) {
            req.session.usid = usuario.id;
            req.session.rango = usuario.id_rango;
            res.end();
          }
          else {
            res.status(400).json({ msj: "NO!!" });
          }
        }).catch(err => {
          res.status(400).json(err);
        })
      }
      else{
        res.status(401).json({ msj: "No tienes acceso!" });
      }
    }
    else {
      // Correo no encontrado
      console.log('NO | HAY')
      res.status(400).json({ msj: "NO!!" });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ msj: "Hubo un error con la base de datos!!" });
  });
});

router.post('/crear', validator.body(esquemaRegistro), (req, res) => {
  console.log(req.body);
  const { correo, nombre, apellido, pass } = req.body;
  bcrypt.hash(pass, rounds).then(hash => {
    return Usuarios.create({ nombre, apellido, correo, contrasena: hash, rango: 1, acceso: true });
  }).then(r => {
    res.json({ msj: "Todo bien" });
    console.log(r);
  }).catch(err => {
    console.log(err);
    if (err.errors[0].type === "unique violation") {
      res.status(409).json({ tipo: "error", msj: "Este usuario ya existe!" });
    }
    else {
      res.status(400).json(err);
    }
  })
});

router.get("/cerrar", (req, res) => {
  req.session.destroy();
  res.redirect("/sesiones");
});

module.exports = router;
