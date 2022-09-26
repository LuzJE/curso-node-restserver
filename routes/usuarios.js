const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
        validarCampos, 
        validarJWT, 
        esAdminRole, 
        tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router =  Router();

router.get('/', usuariosGet);

// Si solo ponemos dos argumento entonces el segundo argumento es el controlador
// Si ponemos tres argumentos y el ultimo es el controlador, entonces el de enmedio es el middleware, si queremos
// mandar más de un middleware entonces se envían en forma de arreglo
router.post('/', [
        // check es un middleware
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Para decir que no tiene que ser vacío
        check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }), 
        //check('correo', 'El correo no es válido').isEmail(),   // el check es un middleware en el cual le puedo especificar que campo del body necesito revisar, en este caso el "correo", si el correo no es valido se manda un mensaje de error
        check('correo').custom(emailExiste),   
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
        check('rol').custom(esRoleValido), // tambien se puede escribir así (rol) => esRoleValido(rol)
        validarCampos // se coloca después de todas las validaciones del check, porque cuando tenga todas las validaciones del check quiero ejecutar la que va a revisar los errores de cada uno de los checks, si para este middleware entonces se ejecuta el controlador usuariosPost
], usuariosPost)

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(), // check también puede tomar encuenta los parámetros o segmentos
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos
], usuariosPut)

router.delete('/:id', [
        validarJWT, // Si da error ya no ejecuta nada más porque la ejecución es secuencial
        esAdminRole, // Este middleware fuerza a que el usuario sea administrador
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'), // Este middleware indica que el registro puede tener cualquiera de estos roles
        check('id', 'No es un ID válido').isMongoId(), // check también puede tomar encuenta los parámetros o segmentos
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)


module.exports = router;