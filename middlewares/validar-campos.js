const { validationResult } = require('express-validator');

// El "next" es lo que tengo que llamar si este middleware pasa
const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // Si llega a este punto lo que quiere decir es que siga con el siguiente middleware
    // y si ya no hay otro middleware entonces sería el controlador
    next();
    
}

module.exports = {
    validarCampos
}