const { response, request} = require('express');

const usuariosGet = (req = request, res = response) => {

    // son parámetros que se obtienen directamente de la url
    //http://localhost:8080/api/usuarios?q=hola&nombre=luz&apikey=1234567890
    const { q, nombre = "No name", apikey } = req.query; 

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    })
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - usuariosPost',
        nombre,
        edad
    })
}

const usuariosPut = (req, res = response) => {
    
    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    })
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - usuariosPatch'
    })
}

const usuariosDelete = (req, res = response) => {

    res.json({
        msg: 'delete API - usuariosDelete'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}