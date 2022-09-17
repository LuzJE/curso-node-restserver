const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
       throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

// Verificar si el correo existe 
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo}); // es correo:correo pero por ES6 solo ponemos correo
    if (existeEmail) {
        //return res.status(400).json({
        //    msg: 'Ese correo ya está registrado'
        //});
        throw new Error(`El correo: ${ correo } ya está registrado en la BD`);
    } 
}

const existeUsuarioPorId = async (id) => {

    const existeUsuario = await Usuario.findById(id); // es correo:correo pero por ES6 solo ponemos correo
    if (!existeUsuario) {
        throw new Error(`El id no existe ${ id }`);
    } 

}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}