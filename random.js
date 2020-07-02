let globals = require('./globals.js');
let random = {};

random.getRandomFarewell = function() {

  return globals.farewells[random.randomNumber(globals.farewells.length)];
}

random.randomNumber = function(max) {

  return Math.floor(Math.random() * max);
}

module.exports = random;
