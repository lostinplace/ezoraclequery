#!/usr/bin/env node

var ezoraclequery = require('../lib/ezoraclequery'),
  fs = require('fs'),
  minimist = require('minimist'),
  argv = minimist(process.argv.slice(2)),
  getDbConfig = require('../lib/find-db-config');

if(!argv._.length){
  console.error('must include query. see, "man ezoraclequery" for details');
  return;
}
try{
  var dbConfig = getDbConfig();
} catch(ex) {
  console.error(`${ex}. see, "man ezoraclequery" for details`);
  return;
}

console.warn(`using .dbconfig at ${dbConfig.path}`)

var queryFileName = argv._[0],
  queryIsFile = fs.existsSync(queryFileName),
  query = queryIsFile ? fs.readFileSync(queryFileName, 'utf8') : queryFileName;

ezoraclequery(dbConfig.config, query, process.stdout, 1000);
