// main startin point of the application
const express =require('express');
const http =require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose =require('mongoose');

//db setup
mongoose.connect('mongodb://flobady:flobadypassword@ds239097.mlab.com:39097/authentification_dev');

// app setup
app.use(morgan('combined'));                  // framework pour les logs des requêtes
app.use(bodyParser.json({ type: '*/*' }));    //toutes les requetes sont parsées en json
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app)
server.listen(port);
console.log('Server listening on: ', port);
