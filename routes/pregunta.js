var express = require('express');
const Joi = require('joi');
var router = express.Router();
const validator = require('express-joi-validation').createValidator({});


const esquemaId = Joi.object({
    id: Joi.number().min(1).required()
})

/* GET users listing. */
router.get('/',function(req, res, next) {
    res.redirect("/");
});
router.get('/:id', validator.params(esquemaId),function(req, res, next) {
    res.render('preguntaEspecifica', {id: req.params.id, sesion: req.session});
});


module.exports = router;
