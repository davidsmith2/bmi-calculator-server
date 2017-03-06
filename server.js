'use strict';

const Hapi = require('hapi');
const _ = require('lodash');

const calculateBMI = function(data) {
  var kg, m;
  if (data.mode === 'standard') {
    kg = data.lb * 0.45;
    m = ((data.ft * 12) + data.in) * 0.025;
  }
  if (data.mode === 'metric') {
    kg = data.kg;
    m = data.cm / 100;
  }
  return Number((kg / Math.pow(m, 2)).toFixed(1));
};

const BMIService = (function() {
  const data = [];
  return {
    create: function(item) {
      data.push(Object.assign({}, item, {bmi: calculateBMI(item)}));
    },
    index: function() {
      return data;
    },
    show: function(id) {
      var ret;
      if (id === 'latest') {
        ret = data[data.length - 1];
      } else {
        ret = _.find(data, (obj) => obj.id === id);
      }
      return ret || {};
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
