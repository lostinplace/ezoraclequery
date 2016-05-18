var oracledb = require('oracledb'),
  minimist = require('minimist'),
  _ = require('lodash'),
  defaultBatchSize=1000;

function ezoraclequery(dbConfig, query, outStream, aBatchSize){
  var batchSize = aBatchSize || defaultBatchSize;

  function onConnection(err, connection){
    if(err){
      console.error(err.message);
      return;
    }

    var responseHandler = generateResponseHandler(outStream, connection, batchSize),
      querySettings = {
          resultSet: true,
          prefetchRows: batchSize
      };
    connection.execute(query,[],querySettings,responseHandler);
  }
  oracledb.getConnection(dbConfig, onConnection);
}

function generateResponseHandler(anOutStream, connection, batchSize){
  var columns,
    rowSetFinished = false;

  function getColumnName(aMetaData){return aMetaData.name;}

  function responseHandler(err, result){
    var rows=0;
    if (err) {
      console.error(err.message);
      doRelease(connection);
      return;
    }
    columns = result.resultSet.metaData.map(getColumnName);

    function perpetualRowSetReader(){
      result.resultSet.getRows(batchSize,function(err,rows){
        writeRows(err,rows);
        if(!rowSetFinished) setTimeout(perpetualRowSetReader, 5);
        else doClose(connection, result.resultSet);
      })
    }
    perpetualRowSetReader();
  }

  function writeRows(err,rows){
    var outObj,
      row,
      column,
      outString;

    if( err || !rows.length){
      if(err) console.error(err.message);
      rowSetFinished = true;
      return
    }

    for(var rowIndex=0; rowIndex<rows.length; rowIndex++){
      outObj = {};
      row = rows[rowIndex];
      for(var columnIndex=0; columnIndex<columns.length; columnIndex++){
        column = columns[columnIndex];
        outObj[column] = row[columnIndex];
      }
      outString = `${JSON.stringify(outObj)}\n`;
      anOutStream.write(outString);
    }
  }

  return responseHandler;
}

function writeErrorMessage(err){
  if(err) console.error(err.message);
}

function doRelease(connection)
{
  connection.release(writeErrorMessage);
}

function doClose(connection, resultSet)
{
  function onError(err)
  {
    writeErrorMessage(err);
    doRelease(connection);
  }
  resultSet.close(onError);
}

module.exports = ezoraclequery;
