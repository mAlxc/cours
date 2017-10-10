var colors = require("colors")

function logInfo(text) {
    console.log(text.bgWhite.black);
}

function logError(text) {
    console.log(text.bgRed.blue);
}

exports.colors = colors;