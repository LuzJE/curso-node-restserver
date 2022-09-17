const { Schema, model } = require('mongoose');

// Creamos nuestro esquema
const RoleSchema = Schema({
    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }
});

module.exports = model('Role', RoleSchema);