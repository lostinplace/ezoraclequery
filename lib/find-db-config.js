#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  defaultFileName = '.dbconfig',
  pathResolvers = [
    doRecursiveSearch,
    doHomeSearch,
    throwError
  ];

function doRecursiveSearch(){
  return searchRecursive(process.env.PWD);
}

function doHomeSearch(){
  var homeFilePath = path.join(process.env.HOME,defaultFileName),
    exists = fs.existsSync(homeFilePath);
  aPath = exists && homeFilePath;
}

function throwError(){
  throw('could not find dbconfig');
}

function getDbConfig(aPath){
  var configResponse = {},
    searchAttempts = 0;
  if(aPath && fs.existsSync(aPath)){
    throw('no dbconfig at provided path');
  }

  while(!aPath){
    aPath = pathResolvers[searchAttempts++]();
  }

  var configStr=fs.readFileSync(aPath, 'utf8'),
    config = JSON.parse(configStr),
    out = {
      path: aPath,
      config: config
    };
  return out;
}

function searchRecursive(aDirPath){
  var filename = path.join(aDirPath, defaultFileName),
    pathInfo = path.parse(aDirPath),
    exists = fs.existsSync(filename);

  if(exists) return filename;
  if(!exists && !pathInfo.name) return null;
  return searchRecursive(pathInfo.dir);
}

module.exports = getDbConfig;
