var express = require('express');
var router = express.Router();
var crypthelper = require("../helpers/cryptHelper")
var tests = require("../public/json/users.json")
var mongoHelper = require("../helpers/mongoHelper")
var loginhelper = require("../helpers/loginHelper")

router.post('/', function (req, res, next) {
  mongoHelper.isValidtoken(req, res, handler)
});

function handler(req, res) {
  if (!!req.body.script) {
    switch (req.body.script) {
      case "login":
        loginhelper.login(req.body.data, res)
        break;
      case "signin":
        loginhelper.newuser(req.body.data, res)
        break;
      case "update":
        loginhelper.updateMyself(req.body,res)
        break;
      default:
        res.send({
          error: {
            err_code: 400,
            err_msg: "No script found",
            err_data: req.body
          }
        })
        break;
    }
  } else {
    res.status(402)
    res.end()
  }

}

module.exports = router;
