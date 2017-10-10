var mongoHelper = require("./mongoHelper");
var mailHelper = require("./mailHelper");
var moment = require("moment")


function addNewLoc(req, res) {
    var data = req.body.data;
    var params = {
        description: data.description
    }
    mongoHelper.findOnewithParams("locations", params, function (result) {
        if (result === null) {
            var loc = {
                name: data.name,
                description: data.description,
                dispo: {
                    deb: moment(data.dispo.deb, "DD/MM/YYYY").format("x"),
                    fin: moment(data.dispo.fin, "DD/MM/YYYY").format("x"),
                    deb_s: data.dispo.deb,
                    fin_s: data.dispo.fin
                },
                "booking": [],
                "owner": req.body.username
            }
            mongoHelper.insertIn("locations", loc, res, function (results) {
                if (results.result.ok > 0) {
                    loc._id = results.ops[0]._id;
                    mailHelper.sendAll(loc);
                }
            })
        } else {
            res.send("fail")
        }
    })
}

function getall(data, res) {
    mongoHelper.getCollToArray("locations", null, res)
}

function getWithParams(data, res) {
    var params = {}
    data.params.forEach(function (obj, id) {
        if (obj.type) {
            console.log(obj.type)
            params["description.type"] = obj.type;
        }
        if (obj.ville) {
            params["description.ville"] = obj.ville;
        }
        if (obj.pays) {
            params["description.pays"] = obj.pays;
        }
        if (obj.espace) {
            params["description.espace"] = (!!obj.espace.sup) ? { "$gte": obj.espace.sup } : { "$lte": obj.espace.min };
        }
        if (obj.divers) {
            params["description.divers"] = { $all: obj.divers };
        }
        if (obj.dispo) {
            params["dispo.fin"] = { $gte: (moment(obj.dispo.deb, "DD/MM/YYYY").add(obj.dispo.days, "days")).format("x") };
            params["dispo.deb"] = { $lte: moment(obj.dispo.fin, "DD/MM/YYYY").subtract(obj.dispo.days, "days").format("x") };
        }
    }, this);
    mongoHelper.findInWithParamsToArray("locations", params, null, res)
}

exports.addNewLoc = addNewLoc;
exports.getall = getall;
exports.getWithParams = getWithParams;