const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {config} = require("dotenv");
const pkg = require('./package.json');
config();
var bodyParser = require('body-parser')
//Routes

const { logErrors, boomErrorHandler, errorHandler } = require('./middlewares/error.handler');
// const authRoutes = require('./routes/auth.routes')

const app = express();
//Settings
app.set("port", process.env.PORT || 3000);

//middlewares

const corsOptions = {};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev')); //Mostrar las peticiones que van llegando por consola

//routes
app.get("/", (req, res) => {
    res.json({
        name: pkg.name,
        author: pkg.author,
        description: pkg.description,
        version: pkg.version
    }); 
});

//Error middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;