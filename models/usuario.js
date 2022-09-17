const {Schema, model} = require('mongoose');

const UsuariosSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UsuariosSchema.methods.toJSON = function() { // tiene que ser una función normal
    const {__v, password, ...usuario} = this.toObject(); // saca los parámetros y valores de __v y password del arreglo que se regresa en la respesta
    return usuario;
}

module.exports = model('Usuario', UsuariosSchema);