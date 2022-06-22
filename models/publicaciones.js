const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/config.js");
const PublicacionesAprobadas = require("./publicaciones_aprobadas.js");
const Comentarios = require("./comentarios.js");

const Publicaciones = sequelize.define("publicaciones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contenido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_propietario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
Publicaciones.hasOne(PublicacionesAprobadas, { foreignKey: "id_publicacion", sourceKey: "id" });
PublicacionesAprobadas.belongsTo(Publicaciones, { foreignKey: "id_publicacion", targetKey: "id" });
Publicaciones.hasMany(Comentarios, { foreignKey: "id_publicacion", sourceKey: "id" });
Comentarios.belongsTo(Publicaciones, { foreignKey: "id_publicacion", targetKey: "id" });

module.exports = Publicaciones;