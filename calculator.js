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

const calculate = _.flow([getBMIValue, getBMIDescription]);

module.exports = {calculate};
