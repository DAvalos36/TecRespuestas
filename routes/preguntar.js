var express = require('express');
const session = require('express-session');
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
router.delete('/', (req, res) => {
    if (req.session.usid !== undefined) {
        pool.getConnection().then(conn => {
            let id = parseInt(req.body.id);
            conn.query("SELECT publicaciones.id, publicaciones.id_propietario FROM publicaciones WHERE publicaciones.id = ?", [id]).then(r=>{
                if(r.length === 1){
                    let id_propietario = r[0].id_propietario;
                    if(req.session.usid == id_propietario || req.session.rango == 2){
                        conn.query("DELETE FROM publicaciones WHERE publicaciones.id = ?", [id]).then(fn => {
                            conn.query("DELETE FROM publicaciones_aprobadas WHERE publicaciones_aprobadas.id_publicacion = ?", [id]).then(fn2 => {
                            }).catch(err => {    
                            })
                            res.json({msj: "TODOD BIE"});
                        }).catch(err => {
                            res.json({error: err});
                        })
                    }
                    else{
                        res.status(400).json({msj: "No tienes permiso para hacer esto!"});
                    }
                }
                else {
                    res.json({msj: "La pregunta no existe"});
                }
            }).catch(err =>{
                res.json({msj: "ERROR UNU", error: err});
            });
            conn.end();
        }).catch(err => {
            res.status(500).json({msj: "Problema con la base de datos", error: err})
        })
    }
    else {
        res.redirect("/inicio");
    }
})

module.exports = router;
