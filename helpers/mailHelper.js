var mongohelper = require("./mongohelper")
var nodemailer = require("nodemailer")



var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alxc.code@gmail.com',
        pass: 'rudy1310'
    }
});

function sendMailTo(adrMail, content, type) {
    if (type === "html") {
        var mailOptions = {
            from: 'alxc.code@gmail.com',
            to: adrMail,
            subject: 'Sending Email using Node.js',
            html: content
        };

    } else if (type === "text") {
        var mailOptions = {
            from: 'alxc.code@gmail.com',
            to: adrMail,
            subject: 'Sending Email using Node.js',
            text: content
        };
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function getAllMails(callback) {
    mongohelper.getFieldFromCollToArray("users", { mail: 1, name: 1, firstName: 1 }, callback)
}

function sendAll(content) {
    var adrMail = ""
    var mailOptions = {}
    getAllMails(function (results) {
        results.forEach(function (element, id) {
            if (element.mail) {
                mailOptions = {
                    from: 'alxc.code@gmail.com',
                    to: element.mail,
                    subject: 'BnB',
                    html: '<h1>Hy ' + element.firstName + '</h1><p>'+content+'</p>'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }, this);
    })
}

exports.sendAll = sendAll
exports.sendMailTo = sendMailTo
