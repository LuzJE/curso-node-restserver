const { response, request} = require('express');
const bcryptjs = require('bcryptjs');

// Lo pongo con U mayúscula porque esto a a permitirme crear instancias de mi modelo, un estandar
const Usuario = require('../models/usuario');

// Get Usuario - Paginado
const usuariosGet = async (req = request, res = response) => {

    // son parámetros que se obtienen directamente de la url
    //http://localhost:8080/api/usuarios?q=hola&nombre=luz&apikey=1234567890
    //const { q, nombre = "No name", apikey } = req.query; 

    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde)) // le decimos desde que valor nos traiga los registros
        .limit(Number(limite)); // le indicamos cuantos registros queremos que devuelva

    
    const total = await Usuario.count(query); */
    

    // Promise.all([]) permite mandar un arreglo con todas las promesas que queremos que se ejecuten
    // resp es una colección de promesas
    // Promise.all ejecuta las promesas de manera simultánea y no va a continuar hasta que ambas funcionen y
    // si una da error entonces todas van a dar error
    const [ total, usuarios ] = await Promise.all([
        // Es para saber cuántos registros hay
        // Si da error podemos poner await Usuario.countDocuments();
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde)) // Si da error entonces lo casteamos así .skip(Number(limite)); // le decimos desde que valor nos traiga los registros
            .limit(Number(limite)) // Si da error entonces lo casteamos así .limit(Number(limite)); // le indicamos cuantos registros queremos que devuelva
    ]);

    res.json({
        total,
        usuarios
    })
}

// Crear Usuario
const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña 
    // El Salt se refiere al número de vueltas que queremos hacer más complicada la desencriptación 
    // o hacer más complicado el método de encriptación 
    // Al parecer el Salt por defecto es el número 10
    const salt = bcryptjs.genSaltSync();
    // este paso es para encriptar la contraseña
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    })
}

// Actualizar Usuario
const usuariosPut = async (req, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body; // desestructura los parámetros que vienen en el body    

    if (password) {
        // Encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto); // resto contiene a los elementos que se van actualizar

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - usuariosPatch'
    })
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    // En este caso no borramos al registro de la base de datos, solo le combiamos el estado a false
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}