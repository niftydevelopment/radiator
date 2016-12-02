var _ = require('lodash');

var generate = function(builds) {
  var result = _.chain(builds).groupBy('user').map(function(o) {
    return {
      'user': o[0].user,
      'failedBuilds': o.length
    };
  }).sortBy(result, [function(o) { return !o.failedBuilds; }]).value();

  console.log('Den som just nu skall bjuda på öl på nästa AW är:', result[0].user);
}

exports.generate = generate;