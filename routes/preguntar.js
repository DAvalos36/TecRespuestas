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
            conn.query('INSERT INTO publicaciones VALUES (?, ?, ?, ?, ?)', [null,req.body.titulo, req.body.contenido, null, req.session.usid]).then(r => {
              res.json({msj: "Todo bien"});
            });
            conn.end();
          }).catch(err => {
              res.status(400).json({msj: "Algo salio mal!"})
          })
    }
    else {
        
    }

})
router.delete('/', (req, res) => {
    if (req.session.usid !== undefined) {

    }
    else {

    }
})

module.exports = router;
