const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Conectar a base de datos
        this.conectarDB();

        //  Middlewares son funciones que le van a agregar otra funcionalidad a mi web server, en
        // otras palabras es una función que siempre va a ejecutarse cuando levantemos nuestro servidor
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // "use" es la palabra clave para expresar que esto es un middleware
        
        // CORS 
        this.app.use(cors());

        // Lectura y parseo del body 
        this.app.use(express.json());
        
        // Directorio Público
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor en puerto', this.port);
        });
    }

}

module.exports = Server;