var mongoHelper = require("./mongoHelper");
var crypthelper = require("./cryptHelper")
var crypto = require('crypto');

function newuser(data, res) {
    console.log(data)
    if (data.username && data.name && data.password && data.mail && data.firstName) {
        var params = {
            username: data.username
        }
        mongoHelper.findOnewithParams("users", params, function (results) {
            if (results != null) {
                res.send({
                    error: {
                        err_code: 400,
                        err_msg: "Cet username existe deja"
                    }
                })
            } else {
                //pas d'username deja present avec ce nom

                cryptPass = crypthelper.encrypted(data.password)
                crypto.randomBytes(48, function (err, buff) {
                    token = buff.toString('hex');
                    var user = {
                        username: data.username,
                        password: cryptPass,
                        name: data.name,
                        firstName: data.firstName,
                        mail: data.mail,
                        token: token
                    }
                    mongoHelper.insertIn("users", user, res);
                })

            }
        }, null);
    } else {
        res.send({
            error: {
                err_code: 400,
                err_msg: "informations incompletes"
            }
        })
    }
}

function login(data, res) {
    //encryptage du mot de passe
    if (data) {
        if (data.password && data.username) {
            password = crypthelper.encrypted(data.password);
            var params = {
                username: data.username,
                password: password
            }
            mongoHelper.findOnewithParams("users", params, function (result) {
                if (result) {
                    res.send({
                        sucess: {
                            suc_code: 200,
                            suc_msg: "Connection valid",
                        },
                        token:result.token
                    })
                } else {
                    res.send({
                        error: {
                            err_code: 400,
                            err_msg: "Wrong user/password"
                        }
                    })
                }
            }, null);
        } else {
            res.send({
                error: {
                    err_code: 400,
                    err_msg: "informations incompletes"
                }
            })
        }
    } else {
        res.send({
            error: {
                err_code: 400,
                err_msg: "informations incompletes"
            }
        })
    }
}

function updateMyself(data, res) {
    var params = {};
    mongoHelper.findOnewithParams("users", { username: data.username }, function (result) {
        data.data.params.forEach(function(element,id) {
            params[element.prop] = element.val;
        }, this);
        mongoHelper.updateIn("users",{_id:result._id},params,res)
    },null)
}

function getToken(data, res) {

}
exports.login = login;
exports.newuser = newuser;
exports.updateMyself = updateMyself