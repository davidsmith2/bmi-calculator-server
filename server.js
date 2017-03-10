'use strict';

const Hapi = require('hapi');
const _ = require('lodash');

const getBMIDescription = function(value) {
  let description = 'Obese';
  if (value < 18.5) {
    description = 'Underweight';
  } else if (value < 25) {
    description = 'Normal weight';
  } else if (value < 30) {
    description = 'Overweight';
  }
  return {
    value,
    description
  };
};

const getBMIValue = function(data) {
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

const getBMI = _.flow([getBMIValue, getBMIDescription]);

const BMIService = (function() {
  const data = [];
  return {
    create: function(item) {
      data.push(Object.assign({}, item, {bmi: getBMI(item)}));
    },
    index: function() {
      return data;
    },
    show: function(id) {
      var ret;
      if (id === 'latest') {
        ret = data[data.length - 1];
      } else {
        ret = _.find(data, (obj) => {
          return obj.id === Number(id);
        });
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
