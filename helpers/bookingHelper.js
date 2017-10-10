var mongohelper = require("./mongoHelper");
var mongoId = require("mongodb").ObjectId;
var moment = require("moment");
var format = 'DD/MM/YYYY'

function book(req, res) {
    if (req.body.data) {
        if (req.body.data.id) {
            var params = { _id: new mongoId(req.body.data.id) }
            mongohelper.findOnewithParams("locations", params, function (result) {
                if (result != null) {
                    var reservable = true;
                    var dispo = req.body.data.dispo
                    var deb = moment(dispo.deb, format)
                    var fin = moment(dispo.fin, format)
                    result.booking.forEach(function (element, id) {
                        if ((moment(element.deb, format).isBetween(deb, fin)) || (moment(element.deb, format).isSame(deb)) || (moment(element.fin, format).isBetween(deb, fin))) {
                            reservable = false;
                        }
                    }, this);
                    if (reservable) {
                        var options = {
                            "$push": {
                                "booking": {deb:dispo.deb,fin : dispo.fin, username:req.body.username}
                            }
                        }
                        mongohelper.updateIn("locations", params, options,  res);
                    } else {
                        res.send({
                            error: {
                                err_code: 400,
                                err_msg: "Ces dates ne sont pas disponible"
                            }
                        })
                    }

                }
            }, null)
        } else {
            //error no id
        }
    }
}


exports.book = book