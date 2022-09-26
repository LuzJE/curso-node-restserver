const { response } = require('express');
const jwt =  require('jsonwebtoken');

const Usuario = require('../models/usuario');

// La función next se pone para indicarle a quién está ejecutando este middleware que pueda
// continuar con el siguiente middleware o con el controlador
const validarJWT = async ( req = request, res = response, next) => {

    // el nombre x-token nosotors lo especificamos aqui y es así como el frontend o quien sea
    // que consuma mi servicio lo tiene que enviar 
    // nosotros ponemos las reglas
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        // Sirve para verificar el jwt
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        // Verificar si el uid tiene estdo en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }


        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}