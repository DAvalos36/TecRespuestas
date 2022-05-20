var express = require('express');
var router = express.Router();
let pool  =  require('../db/config.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.rango == 2){
    pool.getConnection().then(conn => {
      conn.query("SELECT A.id, A.titulo, A.contenido, CONCAT(U.nombre, ' ', U.apellido) as nombre , A.id_propietario FROM publicaciones A LEFT JOIN publicaciones_aprobadas B ON A.id = B.id_publicacion INNER JOIN usuarios U ON U.id = A.id_propietario WHERE B.id IS NULL").then(r => {
        res.render("administrador", {publicaciones: r});
      }).catch(err => {
        // CONTRUIR PAGINA PARA ESTO
        console.log(err);
        res.send("<h1> HUBO UN ERROR AL BUSCAR ESTO </h1>")
      });
      conn.end();
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
    let fecha = Date.now();
    pool.getConnection().then(conn => {
      conn.query("INSERT INTO publicaciones_aprobadas (id_publicacion, id_administrador, fecha_hora) VALUES ( ? , ? ,FROM_UNIXTIME( ?  /1000) )", [req.body.idPublicacion, req.session.usid, fecha]).then(r => {
        res.end();
      }).catch(err => {
        res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
      });
      conn.end();
    }).catch(err => {
      res.status(500).json({msj: "Error con la base de datos", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});
router.put("/", (req, res) => {
  console.log(req.body);
  if (req.session.rango == 2){
    pool.getConnection().then(conn => {
      conn.query("UPDATE usuarios SET usuarios.acceso = '0' WHERE usuarios.id = ?", [req.body.idUsuario]).then(r => {
        conn.query("DELETE FROM publicaciones WHERE publicaciones.id = ?", [req.body.idPublicacion]).then(r2 => {
          res.end();
        }).catch(err => {
          res.status(400).json({msj: "Las consultas no ocurrieron como debian", error: err});
        });
      }).catch(err => {
        res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
      });
      conn.end();
    }).catch(err => {
      res.status(500).json({msj: "Error con la base de datos", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});
router.delete("/", (req, res) => {
  if (req.session.rango == 2){
    console.log(req.body);
    pool.getConnection().then(conn => {
      conn.query("DELETE FROM publicaciones WHERE publicaciones.id = ?", [req.body.idPublicacion]).then(r => {
        res.end();
      }).catch(err => {
        res.status(400).json({msj: "Ocurrio un error inesperado, intentelo mas tarde", error: err});
      });
      conn.end();
    }).catch(err => {
      res.status(500).json({msj: "Error con la base de datos", error: err});
    });
  }
  else {
    res.status(401).json({msj: "No no cuenta con los permisos para acceder aqui..."});
  }
});

module.exports = router;