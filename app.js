'use strict';
const defaultRoutingPath = '/studentdetails/api';
const defaultPort = 10019;

var swaggerTools = require('swagger-tools');

var express = require('express');
var subpath = express();
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');


module.exports = app; 
var routingPath = process.env.ROUTING_PATH || defaultRoutingPath;

var config = {
  appRoot: __dirname 
};

// Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/studentdetails');
mongoose.set('debug', true);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

// swaggerRouter configuration
var options = {
  controllers: './api/controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false 
};


app.use(function (req, res, next) {
 
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.setHeader('Access-Control-Allow-Methods', '*');
  
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();
});

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDocument, function (middleware) {
  app.use(routingPath, subpath);
  app.get('/', (req, res) => {
    res.redirect(path.join(routingPath, 'docs'));
  })
  app.use(cors());
  
  app.use(middleware.swaggerMetadata());
  
  app.use(middleware.swaggerValidator());

  app.use(middleware.swaggerRouter(options));

  subpath.use(middleware.swaggerUi());
  var port = process.env.PORT || defaultPort;
    app.listen(port, () => { console.info(`Student Details APIs running on ${port}`) });
});