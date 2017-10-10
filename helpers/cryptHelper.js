var crypto = require('crypto');

// On définit notre algorithme de cryptage
var algorithm = 'aes256';

// Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
var password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

// on crypte notre chaine de caractere
function encrypted(text) {
    var cipher = crypto.createCipher(algorithm, password); //definition de l'encrypteur
    var crypted = cipher.update(text, 'utf8', 'hex'); //l'encriptage ce fait ici
    crypted += cipher.final('hex'); //fin de l'encryptage
    return crypted
}

function getToken(data,res,callback) {
    var token = null;
    crypto.randomBytes(48, function (err, buff) {
        token = buff.toString('hex');
        callback(data,token,res)        
    })
}
// On décrypte notre texte
function uncrypted(crypted) {
    var decipher = crypto.createDecipher(algorithm, password); //definition du décrypteur
    var dec = decipher.update(crypted, 'hex', 'utf8'); //decryptage
    dec += decipher.final('utf8');// fin
    return dec;
}

exports.encrypted = encrypted;
exports.uncrypted = uncrypted;
exports.getToken = getToken;