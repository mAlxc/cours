var express = require('express');
var router = express.Router();
var crypthelper = require("../helpers/cryptHelper")
var tests = require('../public/json/test.json')
var mongoHelper = require("../helpers/mongoHelper")
var locationHelper = require("../helpers/locationHelper")
var bookingHelper = require("../helpers/bookingHelper")
/* GET users listing. */
router.post('/', function (req, res, next) {
    mongoHelper.isValidtoken(req, res, handler)
});

function handler(req, res) {
    if (!!req.body.script) {
        switch (req.body.script) {
            case "book":
                bookingHelper.book(req, res);
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
        res.status(404)
    }
}

module.exports = router;
