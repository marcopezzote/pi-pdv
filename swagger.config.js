const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFile = ['./src/routes/router.js'];

swaggerAutogen(outputFile, endpointsFile);