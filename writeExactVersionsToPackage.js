//https://gist.github.com/kentcdodds/e3f79584d7f255fbcf29

var fs = require('fs');
var path = require('path');

var packageJson = require('./package.json');
strictifyDeps('dependencies');
strictifyDeps('devDependencies');
console.log('done!');

function strictifyDeps(depsProperty) {
  var deps = Object.keys(packageJson[depsProperty]);
  deps.forEach(function(dep) {
    var depPackageJson = require('./node_modules/' + dep + '/package.json');
    packageJson[depsProperty][dep] = depPackageJson.version;
  });

  fs.writeFileSync(path.resolve(__dirname, './package.json'), JSON.stringify(packageJson, null, 2));
}