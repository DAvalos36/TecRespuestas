var express = require('express');
const session = require('express-session');
const Joi = require("joi");
var router = express.Router();
let pool  =  require('../db/config.js');
const Publicaciones = require('../models/publicaciones.js');
const validator = require('express-joi-validation').createValidator({});

const esquemaPregunta = Joi.object({
    titulo: Joi.string().min(1).max(80).required(),
    contenido: Joi.string().min(1).max(65000).required(),
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.session.usid !== undefined){
        res.render('nuevapreg', {sesion: req.session});
    }
    else {
        res.redirect("/sesiones");
    }
});
router.post('/', validator.body(esquemaPregunta), (req,res) => {
    console.log(req.body);
    const { titulo, contenido } = req.body;
    if (req.session.usid !== undefined){
        Publicaciones.create({titulo, contenido, id_propietario: req.session.usid}).then(() => {
            res.json({msj: "Todo bien"});
        }).catch(err => {
            res.json({msj: "Ocurrio un error!"});
        });
    }
    else {
        res.status(401).json({msj: "No estas logueado!"});
    }

});
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
                                res.end();
                            }).catch(err => {
                                res.status(400);
                            })
                            res.json({msj: "TODOD BIE"});
                        }).catch(err => {
                            res.status(400).json({msj: "Ha ocurrido un error", error: err});
                        })
                    }
                    else{
                        res.status(401).json({msj: "No tienes permiso para hacer esto!"});
                    }
                }
                else {
                    res.json({msj: "La pregunta no existe"});
                }
            }).catch(err =>{
                res.json({msj: "Error de consulta", error: err});
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
