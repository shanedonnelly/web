const { CONNECTING } = require('ws');
const db = require('./config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
console.log("module userExists imported"); 

async function userExists(username) {
    try {
        const result = await db.query('SELECT user_exists($1)', [username]);
        //console.log("database result : ", result, result.rows[0]);
        return result.rows[0].user_exists;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function addUser(username, password) {
    try {
        const result = await db.query('SELECT add_user($1, $2,false, 0 )', [username, password]);
        return result.rows[0].add_user;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function checkPassword(username, password) {
    try {
        const result = await db.query('SELECT get_password($1)', [username]);
        const password_hash = result.rows[0].get_password;
        const isMatch = await bcrypt.compare(password, password_hash);
        if (!isMatch) {
            console.log("Invalid password");
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
function checkToken(token){
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        if (decoded){
            const username = decoded.username;
            console.log("token of user : ", username, " is valid");
        }
        else {
            console.log("Invalid token");
        }
        return decoded;
    } catch (err) {
        console.error("error in checkToken", err);
    }
}
function checkGameToken(token){
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        if (decoded){
            const username = decoded.username;
            console.log("gametoken of user : ", username, " is valid");
        }
        else {
            console.log("Invalid GameToken");
        }
        return decoded;
    } catch (err) {
        console.error("error in checkGameToken", err);
        return false;
    }
}


module.exports = {
    userExists,
    addUser,
    checkPassword,
    checkToken,
    checkGameToken
} ;