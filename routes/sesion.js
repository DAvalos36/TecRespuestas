var express = require('express');
const Joi = require("joi");
const validator = require('express-joi-validation').createValidator({});
let pool  =  require('../db/config.js');
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
router.post('/iniciar', validator.body(esquemaLogin),function(req, res, next) {
  console.log(req.body);
  pool.getConnection().then(conn => {
    conn.query('SELECT * FROM usuarios WHERE correo = ?',[req.body.correo]).then(r => {
      // console.log(r);
      if(r.length === 1){
        console.log('SI HAY');
        bcrypt.compare(req.body.pass, r[0].contrasena).then(resultado => {
          if(resultado){
            req.session.usid = r[0].id;
            req.session.rango = r[0].rango;
            res.end();
          }
          else{
            res.status(400).json({msj: "NO!!"});
          }
        }).catch(err => {
          res.status(400).json(err);
        })
        
      }
      else {
        console.log('NO | HAY')
        res.status(400).json({msj: "NO!!"});
      }
    });
    conn.end();
  }).catch(err => {
    console.log(err);
    res.status(500).json({msj: "Hubo un error con la base de datos!!"});
  })
  
});
router.post('/crear', validator.body(esquemaRegistro),(req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.pass,rounds).then(hash => {
      pool.getConnection().then(conn => {
        let fecha = Date.now();
        conn.query('INSERT INTO usuarios VALUES (?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(? / 1000))', [null,req.body.nombre, req.body.apellido, req.body.correo, hash, 1, 1, fecha.toString()]).then(r => {
          res.json({msj: "Todo bien"});
          console.log(r);
        }).catch(err => {
          console.log(err);
          if (err.code == 'ER_DUP_ENTRY'){
            res.status(409).json({tipo: "error", msj:"Este usuario ya existe!"});
          }
          else{
            res.status(400).json(err);
          }
        })
        conn.end();
      }).catch(err => {
        console.log(err);
        res.status(500).json({msj: "Hubo un error con la base de datos!!", error: err});
      })
    });
});

router.get("/cerrar", (req, res) => {
  req.session.destroy();
  res.redirect("/sesiones");
});

module.exports = router;
