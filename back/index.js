require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Catbox = require('@hapi/catbox');
const CatboxMemory = require('@hapi/catbox-memory');
const routes = require('./routes');
const Boom = require('boom');


const server = Hapi.server({
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',
  routes: { cors: true },
});


const validate = async function (decoded, request) {
  console.log('running validate...');

  console.log(decoded);
  console.log(request);

  return { isValid: true };
};


const startServer = async () => {
  try {
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
      key: process.env.SECRET_KEY,
      validate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    });

    routes.forEach((route) => {
      server.route(route);
    });

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);

  } catch (err) {
    console.log(err);
    Boom.badImplementation(err);
  }
};

startServer();

module.exports = server;