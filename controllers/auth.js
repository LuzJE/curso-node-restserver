const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('body-parser');
const { DefaultTransporter } = require('google-auth-library');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo en la base de datos
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async ( req, res = response ) => {
0 
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                //rol: DefaultTransporter, // le asigna un rol por default
                                           // rol: "ADMIN_ROLE", "USER_ROLE"
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
            
        } 

        // Si el usuario en DB
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        } 

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar' 
        });
    }


}

module.exports = {
    login,
    googleSignIn
}
