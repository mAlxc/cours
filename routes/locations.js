var express = require('express');
var router = express.Router();
var crypthelper = require("../helpers/cryptHelper")
var mongoHelper = require("../helpers/mongoHelper")
var locationHelper = require("../helpers/locationHelper")
/* GET users listing. */
router.post('/', function (req, res, next) {
    mongoHelper.isValidtoken(req, res, handler)
});

function handler(req, res) {
    if (!!req.body.script) {
        switch (req.body.script) {
            case "add_location":
                locationHelper.addNewLoc(req, res);
                break;
            case "get_all":
                locationHelper.getall(req.body.data, res);
                break;
            case "get_with_param":
                locationHelper.getWithParams(req.body.data, res);
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
