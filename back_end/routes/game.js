const express = require('express');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const app = express();
let roleCounter = 0;

const authController = require('../controller/authentification_ctrl');
const e = require('express');

const router = express.Router();

router.get('/join', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const decoded = authController.checkToken(token);
    if (!decoded) {
        return res.status(500).send({ error: 'Failed to authenticate token' });
    }
    

        let role;
        if (roleCounter === 0) {
            role = 'white';
            roleCounter++;

        } else if (roleCounter === 1) {
            role = 'black';
            roleCounter ++
        } else {
            role = 'watcher';
        }

        const gameToken = generateGameToken(decoded.username, role);
        console.log(`User ${decoded.username} assigned role ${role}`);
        res.cookie('gameToken', gameToken, { httpOnly: true });
        res.send({ role });
    });


function generateGameToken(username, role) {
    return jwt.sign({ username, role }, 'game_token', { expiresIn: '30m' });
}

const wss = new WebSocket.Server({ port: 8080 });

wss.e

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.token) {
                jwt.verify(data.token, 'your_secret_key', (err, decoded) => {
                    if (err) {
                        ws.send(JSON.stringify({ error: 'Invalid token' }));
                    } else {
                        // Process the message
                        console.log(`Received message ${data.payload} from user ${decoded.username}`);
                    }
                });
            } else {
                ws.send(JSON.stringify({ error: 'No token provided' }));
            }
        } catch (err) {
            console.error(err);
        }
    });
});

module.exports = router;