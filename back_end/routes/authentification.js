
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authController = require('../controller/authentification_ctrl');


const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        console.log("create request");
        var username = req.body.username;
        var password = req.body.password;
        console.log("userExists request user name : ", username);
        const userexist = await authController.userExists(username);
        console.log("userexist : ", userexist);
        if (userexist) {
            console.log("User already exists");
            // Send a JSON response
            res.json({ result: false });
            return;
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            authController.addUser(username, hashedPassword);
            res.json({ result: true });
        }
    }
    catch (err) {
        console.log("Error in create request");
        res.json({ result: false });
    }
});


router.post('/login', async (req, res) => {
    console.log("login request");
    var username = req.body.username;
    var password = req.body.password;
    const userexist = await authController.userExists(username);
    if (!userexist) {
        console.log("User does not exist");
        // Send a JSON response
        res.json({ result: false });
        
        return;
    }
    else {
        const result = await authController.checkPassword(username, password);
        if (result) {
            console.log("user logged in : ", username);

            // Create a JWT
            const token = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '2h' });
            const gameToken = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '2h' });
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 2); // Set the expiration date to 2 hours from now

            // Set the JWT as an HTTP-only cookie
            res.cookie('token', token,
                {
                    httpOnly: true,
                    // secure: true, // use with https
                    sameSite: 'lax',  // use with https
                    expires : expirationDate
                }
            );
            res.cookie('gameToken', gameToken,
                {
                    httpOnly: false,
                    // secure: true, // use with https
                    sameSite: 'lax' , // use with https
                    expires : expirationDate
                }
            );
            res.cookie('username', username,
                {
                    // secure: true, // use with https
                    sameSite: 'lax' // use with https
                }
            );
            // Send a JSON response
            res.json({ result: true, username: username});
        }
        else {
            console.log("Password is incorrect");
            // Send a JSON response
            res.json({ result: false });
        }
    }
    // rest of your code
});

router.post('/logout', (req, res) => {
    try {
        console.log("logout request");
        res.clearCookie('token');
        res.clearCookie('username');
        res.clearCookie('gameToken');
        res.json({ result: true });

    }
    catch (err) {
        console.log("Error in logout request");
        res.json({ result: false });
    }
});

router.get('/checkToken', (req, res) => {
    try {
        console.log("checkToken request");
        const token = req.cookies.token;
        if (!token) {
            return res.json({ tokenExists: false });
        }
        else {
            jwt.verify(token, 'your_secret_key');
            res.json({ tokenExists: true });
    
        }

    }
    catch (err) {
        console.log("errror : ", err) ;
        res.json({ tokenExists: false });
    }
});


module.exports = router;
