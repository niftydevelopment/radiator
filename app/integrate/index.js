var git_pull = require('./git-pull.js');
var mail = require('./mail.js');
const properties = require('./../properties');

properties.fetch('branches').then(branches => {

  integrate(branches.featureBranches, 0);

});

var integrate = (branches, index) => {
  if (branches.length === index) {
    return;
  }

  var current = branches[index];
  
  git_pull.execute(current).then(result => {
    console.log('Det funkade ta nästa:', result);
    integrate(branches, ++index);
  }, (error) => {
    console.log('NAj! Maila AC!', error);
  });
}

/*
https://www.youtube.com/watch?v=gq80Y5-ZJdg

chrome: 6% free disk space ===
50MB minimum budget.

eviction strategies. disk full.
persistance storage --> permission för permanent storage.
quota api calculation

https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
wrappers
http://blogs.bytecode.com.au/glen/2016/01/11/dexie.html
*/