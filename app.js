
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var logger = require('morgan');

var indexRouter = require('./routes/index');
var inicioRouter = require('./routes/inicioR');
var sesiones = require('./routes/sesion');
var noEncontrada = require('./routes/404');
var nuevapreg = require('./routes/preguntar');
var preguntaEspecifica = require('./routes/pregunta');
var recorrido = require('./routes/recorrido');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "CONTRA PERRONA 123", resave: true,
saveUninitialized: true, cookie: {maxAge: 1000 * 60 * 60 * 24}}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sesiones', sesiones);


app.use('/', indexRouter);
app.use('/inicio', inicioRouter);
app.use('/preguntar', nuevapreg);
app.use('/pregunta', preguntaEspecifica);
app.use('/recorrido', recorrido);
app.use('/sesiones', sesiones );
app.use('/administrar', admin );


app.use('/*', noEncontrada );
// app.use('*', noEncontrada);

// catch 404 and forward to error handler

// error handler

module.exports = app;
