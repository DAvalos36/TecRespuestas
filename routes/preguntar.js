var express = require('express');
const Joi = require("joi");
var router = express.Router();
let pool  =  require('../db/config.js');
const validator = require('express-joi-validation').createValidator({});

const esquemaPregunta = Joi.object({
    titulo: Joi.string().min(1).max(80).required(),
    contenido: Joi.string().min(1).max(65000).required(),
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.session.usid !== undefined){
        res.render('nuevapreg');
    }
    else {
        res.redirect("/sesiones");
    }
});
router.post('/', validator.body(esquemaPregunta),(req,res) => {
    console.log(req.body);
    if (req.session.usid !== undefined){
        pool.getConnection().then(conn => {
            let fecha = Date.now();
            conn.query('INSERT INTO publicaciones VALUES (?, ?, ?, FROM_UNIXTIME(? /1000), ?)', [null,req.body.titulo, req.body.contenido, fecha, req.session.usid]).then(r => {
              res.json({msj: "Todo bien"});
            }).catch(err => {
                res.json({msj: "Ocurrio un error!"});
            })
            conn.end();
          }).catch(err => {
              res.status(500).json({msj: "Base de datos no conectada...", error: err})
          })
    }
    else {
        
    }

})
router.get('/borrar/:id', (req, res) => {
    if (req.session.usid !== undefined) {
        pool.getConnection().then(conn => {
            let id = parseInt(req.params.id);
            conn.query("borrar_pregunta(?,?)", [id, req.session.usid]).then(r=>{
                res.json({msj: "TODO SALIO BIEN UWU", r});
            }).catch(err =>{
                res.json({msj: "ERROR UNU", error: err});
            });
        }).catch(err => {
            res.status(500).json({msj: "Problema con la base de datos", error: err})
        })
    }
    else {

    }
})

module.exports = router;
