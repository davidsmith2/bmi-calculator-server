'use strict';

const Hapi = require('hapi');
const _ = require('lodash');

const BMIService = (function() {
  const data = [];
  return {
    create: function(bmi) {
      data.push(bmi);
    },
    index: function() {
      return data;
    },
    show: function(id) {
      return _.find(data, (obj) => obj.id === id);
    }
  };
}());

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000,
  routes: {
    cors: true
  }
});

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
    return reply(BMIService.index());
  }
});

server.route({
  method: 'POST',
  path: '/api/bmi',
  handler: function(request, reply) {
    BMIService.create(request.payload);
    reply('resource created');
  }
});

server.route({
  method: 'GET',
  path: '/api/bmi/{id}',
  handler: function(request, reply) {
    reply(BMIService.show(request.params.id));
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
