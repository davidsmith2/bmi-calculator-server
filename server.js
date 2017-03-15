'use strict';

const Hapi = require('hapi');

const Calculator = require('./calculator');
const db = require('./db');
const io = require('./io');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000,
  routes: {
    cors: true
  }
});

server.register([io, db], (err) => {

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply.redirect('/api');
    }
  });

  server.route({
    method: 'GET',
    path: '/api',
    handler: function(request, reply) {
      reply('API');
    }
  });

  server.route({
    method: 'GET',
    path: '/api/bmi',
    handler: function(request, reply) {
      console.log('GET - /api/bmi');
      server.methods.db.findEntries((err, result) => {
        if (err) {
          return reply().code(500);
        }
        return reply(result);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/bmi',
    handler: function(request, reply) {
      console.log('POST - /api/bmi');
      const entry = Object.assign({}, request.payload, {
        date: new Date().getTime(),
        bmi: Calculator.calculate(request.payload)
      });
      server.methods.db.saveEntry(entry, (err, result) => {
        if (err) {
          return reply().code(500);
        }
        server.methods.db.findEntry(result.generated_keys[0], (err, result) => {
          return reply(result);
        });
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/bmi/{id}',
    handler: function(request, reply) {
      console.log(`GET - /api/bmi/${request.params.id}`);
      server.methods.db.findEntry(request.params.id, (err, result) => {
        return reply(result);
      });
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/bmi/{id}',
    handler: function(request, reply) {
      console.log(`DELETE - /api/bmi/${request.params.id}`);
      server.methods.db.deleteEntry(request.params.id, (err) => {
        if (err) {
          return reply().code(500);
        }
        return reply([]);
      });
    }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
  });

});
