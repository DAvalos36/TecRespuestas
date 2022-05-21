var express = require('express');
const Joi = require('joi');
const { query } = require('../db/config.js');
var router = express.Router();
const validator = require('express-joi-validation').createValidator({});
let pool  =  require('../db/config.js');


const esquemaId = Joi.object({
    id: Joi.number().min(1).required()
})

const esquemaComentario = Joi.object({
    comentario: Joi.string().min(1).required()
})

/* GET users listing. */
router.get('/',function(req, res, next) {
    res.redirect("/");
});
router.get('/:id', validator.params(esquemaId),function(req, res, next) {
    pool.getConnection().then(conn => {
        conn.query("SELECT publicaciones.id, publicaciones.titulo, publicaciones.contenido, publicaciones.fecha, CONCAT(usuarios.nombre, ' ', usuarios.apellido) AS nombre FROM publicaciones_aprobadas INNER JOIN publicaciones ON publicaciones.id = publicaciones_aprobadas.id_publicacion INNER JOIN usuarios ON usuarios.id = publicaciones.id_propietario WHERE publicaciones_aprobadas.id_publicacion = ?", [req.params.id]).then(r => {
            if(r.length === 1){
                conn.query("SELECT comentarios.id, comentarios.comentario, CONCAT(usuarios.nombre, ' ', usuarios.apellido) as nombre, comentarios.fecha_comentado, comentarios.id_propietario FROM comentarios INNER JOIN usuarios ON comentarios.id_propietario = usuarios.id WHERE comentarios.id_publi = ?", [req.params.id]).then(comentarios => {
                    res.render('preguntaEspecifica', {id: req.params.id, sesion: req.session, pregunta: r[0], comentarios});
                }).catch(err=>{
                    console.log("IDK");
                });
            }
            else{
                // CONSTRUIR PAGINA PARA ESTO
                res.send("<h1>Pregunta no encontrada...</h1>")
            }
        }).catch(err =>{
            res.status(400).json({msj: "Ocurrio un error al realizar la consulta.", error:err});
        });
        conn.end();
    }).catch(err => {
        res.status(500).json({msj: "Base de datos no conectada", error: err});
    });
});

router.post('/:id/responder', validator.params(esquemaId), validator.body(esquemaComentario), function(req, res, next) {
    if(req.session.usid !== null){
        let fecha = Date.now();
        pool.getConnection().then(conn => {
            conn.query("INSERT INTO comentarios(comentario, id_propietario, fecha_comentado, id_publi) VALUES (?,?,FROM_UNIXTIME(? /1000),?)", [req.body.comentario,req.session.usid,fecha,req.params.id]).then(r => {
                res.end();  
            }).catch(err =>{
                res.status(400).json({msj: "Ocurrio un error al realizar la consulta.", error:err});
            });
            conn.end();
        }).catch(err => {
            res.status(500).json({msj: "Base de datos no conectada", error: err});
        });  
    }
    else{
        res.status(401).json({msj:"No tienes permisos para hacer esto"});
    }
});

module.exports = router;
