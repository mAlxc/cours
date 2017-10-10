var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/bnb"
var moment = require("moment");

/**
 * @function initmongo fonction d'initialisation de mongoDb
 */
function initMongo() {
  MongoClient.connect(url, function (error, db) {
    if (error) {
      console.log(error)
    } else {
      //db.getCollection(collectionname);
      console.log("Connecté à la base de données", db.databaseName);
      appVars.db = db;
    }

  });
}

/**
 * 
 * @param {*} collectionname 
 * @param {*} data 
 * @param {*} res 
 */
function insertIn(collectionname, data, res,callback) {
  if (appVars.db) {
    collection = appVars.db.collection(collectionname)
    collection.insert(data, null, function (error, results) {
      if (error) {
        if (callback) {
          callback(error)
        } else {
          res.send({
            error: {
              err_code: 201,
              err_msg: "Impossible d'ecrire dans la base",
              err_data: error
            }
          })
        }
      }
      if (callback) {
        callback(results);
      }
      res.send({
        sucess: {
          suc_code: 200,
          suc_msg: "La ligne ete ajouter dans " + collectionname,
          suc_data: results
        }
      })
    });
  } else {
    res.status(500)
    res.end()
  }
}

function isValidtoken(req, res, next) {
  if ((req.body.script != "login") && (req.body.script != "signin")) {
    var params = {
      username: req.body.username,
      token: req.body.token
    }
    findOnewithParams("users", params, function (result) {
      if (result) {
        next(req, res);
      } else {
        res.send({
          error: {
            err_code: 400,
            err_msg: "Invalid Token"
          }
        })
      }
    }, null);
  } else {
    next(req, res)
  }
}


function updateIn(collectionname, params,options,res) {
  if (appVars.db) {
    collection = appVars.db.collection(collectionname)
    collection.update(params,options, function (error, results) {
      if (error) throw error;
      res.send({
        sucess: {
          suc_code: 200,
          suc_msg: "La ligne ete mise a jour dans " + collectionname,
          suc_data: results
        }
      })
    });
  } else {
    res.status(500)
    res.end()
  }
}

/**
 * 
 * @param {*} collectionname 
 * @param {*} callback 
 * @param {*} res 
 */
function getCollToArray(collectionname, callback, res) {
  appVars.db.collection(collectionname).find().toArray(function (error, results) {
    if (error) {

    } else {
      if (callback === null) {
        res.send(results);
      } else {
        callback(results)
      }
    }
  });
}

function getFieldFromCollToArray(collectionname,fields, callback, res) {
  appVars.db.collection(collectionname).find({},fields).toArray(function (error, results) {
    if (error) {
      console.log(error);
    } else {
      if (callback === null) {
        res.send(results);
      } else {
        callback(results)
      }
    }
  });
}

function findInWithParamsToArray(collectionname, params, callback, res) {
  appVars.db.collection(collectionname).find(params).toArray(function (error, results) {
    if (error) {
    } else {
      if (callback === null) {
        res.send(results);
      } else {
        callback(results)
      }
    }
  });
}

function findOnewithParams(collectionname, params, callback, res) {
  appVars.db.collection(collectionname).findOne(params, function (error, results) {
    if (error) {
    } else {
      if (callback === null) {
        res.send(results);
      } else {
        callback(results)
      }
    }
  })
}


exports.initMongo = initMongo;
exports.insertIn = insertIn;
exports.getCollToArray = getCollToArray;
exports.getFieldFromCollToArray = getFieldFromCollToArray;
exports.findInWithParamsToArray = findInWithParamsToArray;
exports.findOnewithParams = findOnewithParams;
exports.isValidtoken = isValidtoken;
exports.updateIn = updateIn;