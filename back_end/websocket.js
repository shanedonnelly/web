// websocket.js

module.exports.init = (server) => {

const url = require('url');

const WebSocket = require('ws');
const authController = require('./controller/authentification_ctrl');
const cookie = require('cookie');

var state = 0;
var connections = [];
var watchers = [];
var playerWhite = null;
var playerBlack = null;

var gameStarted = false;

//socket

const wss = new WebSocket.Server({ server, verifyClient: verifyClient });

function verifyClient(info, done) {
    try {
        const parsedUrl = url.parse(info.req.url, true);
        // console.log('parsedUrl : ', parsedUrl);
        // console.log('parsedUrl.query.token : ', parsedUrl.query.token);
        const gametoken = parsedUrl.query.token;
        const user = authController.checkGameToken(gametoken);
        if (user) {
        info.req.username = user.username;
        done(true);
        } else {
        done(false, 401, 'Unauthorized');
    }
    }
    catch (error) {
    console.log(error);
    done(false, 401, 'Unauthorized');
    }
}
wss.on('connection', (ws, req) => {
try {
    connections.push(ws);
    ws.username = req.username;
    console.log('user : ', ws.username, ' connected to socket');
    ws.send(JSON.stringify({ result : true , type: 'new_state', info : state}));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        threatData(data, ws);
    });

    ws.on('close', () => {
        ws.on('close', () => {
            console.log('Connection closed with user ', ws.username);
            removeFromAll(ws);
        });
    });
} catch (error) {    
    console.log(error);
}
});
//functions 

function informNewState() {
    connections.forEach(connection => {
        if (connection) connection.send(JSON.stringify({ result : true , type: 'new_state', info : state}));
    });
    if (playerWhite) playerWhite.send(JSON.stringify({ result : true , type: 'new_state', info : state}));
    if (playerBlack) playerBlack.send(JSON.stringify({ result : true , type: 'new_state', info : state}));
    watchers.forEach(watcher => {
        if (watcher) watcher.send(JSON.stringify({ result : true , type: 'new_state', info : state}));
    });
}


function removeFromConnections(ws) {
    const index = connections.indexOf(ws);
    if (index !== -1) {
        connections.splice(index, 1);
    }
}


function removeFromAll(ws) {
    // Remove from connections
    const index = connections.indexOf(ws);
    if (index !== -1) {
        connections.splice(index, 1);
    }

    // Remove from watchers
    const watcherIndex = watchers.indexOf(ws);
    if (watcherIndex !== -1) {
        watchers.splice(watcherIndex, 1);
    }

    // Remove from playerWhite
    if (playerWhite === ws) {
        playerWhite = null;
    }

    // Remove from playerBlack
    if (playerBlack === ws) {
        playerBlack = null;
    }
}

function resetGame() {
    console.log('Resetting game');
    try {
        state = 0;
        if (playerWhite) {
        playerWhite.send(JSON.stringify({ reset : true, type: 'game_reset' }));
        }
        if (playerBlack) {
        playerBlack.send(JSON.stringify({ result : true, type: 'game_reset' }));
        }
        playerWhite = null;
        playerBlack = null;
        gameStarted = false;
        connections.forEach(connection => {
            if (connection) connection.send(JSON.stringify({  result : true, type: 'game_reset' }));
        });
        watchers.forEach(watcher => {
            if (watcher) watcher.send(JSON.stringify({ result : true, type: 'game_reset' }));
        });
        informNewState();
        
    } catch (error) {
        console.log(error);
    }
}

function initializePlayerWhite(ws) {
    try {
        console.log('Player white connected assigned to : ', ws.username);
        playerWhite = ws;
        removeFromConnections(playerWhite);
        playerWhite.on('close', () => {
            console.log('Player white disconnected');
            removeFromAll(playerWhite);
            resetGame();
        });
        playerWhite.send(JSON.stringify({ type: 'join_response', result: true, info: 'white' }));

    }
    catch (error) {
        console.log(error);
    }
}

function initializePlayerBlack(ws) {
    try {
        console.log('Player black connected assigned to : ', ws.username);
        playerBlack = ws;
        removeFromConnections(playerBlack);
        playerBlack.on('close', () => {
            console.log('Player black disconnected');
            removeFromAll(playerBlack);
            resetGame();
        });
        playerBlack.send(JSON.stringify({ type: 'join_response', result: true, info: 'black' }));
    }
    catch (error) {
        console.log(error);
    }
}

function initializeWatcher(ws) {
    try {
        watchers.push(ws);
        ws.send(JSON.stringify({ type: 'join_response', result: true, role: 'watcher' }));
    }
    catch (error) {
        console.log(error);
    }
}

function threatData(data, ws) {
    try {

        console.log(data);
        const type = data.type;
        if (type === 'ask_to_play') {
            if (state === 0) {
                initializePlayerWhite(ws);
                state = 1;
                informNewState();
            } else if (state === 1) {
                initializePlayerBlack(ws);
                state = 2;
                informNewState();
                startGame();
            } else {
                initializeWatcher(ws);
            }
        }
        else if (type === 'move') {
            if (ws === playerWhite) {
                playerBlack.send(JSON.stringify({ type: 'move', move: data.move }));
            } else if (ws === playerBlack) {
                playerWhite.send(JSON.stringify({ type: 'move', move: data.move }));
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

function informPlayersAndWatchers(result, type, info) {
    if (playerWhite) playerWhite.send(JSON.stringify({ result : result , type: type, info : info}));
    if (playerBlack) playerBlack.send(JSON.stringify({ result : result , type: type, info : info}));
    watchers.forEach(watcher => {
        if (watcher) watcher.send(JSON.stringify({ result : result , type: type, info : info}));
    });


}

function startGame() {
    try {
        console.log('Game started');
        informPlayersAndWatchers(true, 'game_started', true);

        playerWhite.on('message', function(message) {
            var data = JSON.parse(message);
            if (data.type === 'play_move') {
                console.log('Player white played move');
                console.log(data);
                waitForPlayerMove(playerBlack);
            }
        });

        playerBlack.on('message', function(message) {
            var data = JSON.parse(message);
            if (data.type === 'play_move') {
                console.log('Player black played move');
                console.log(data);
                waitForPlayerMove(playerWhite);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}

function waitForPlayerMove(player) {
    player.on('message', function(message) {
        var data = JSON.parse(message);
        if (data.type === 'play_move') {
            console.log(data);
            waitForPlayerMove(playerBlack);
        }
    });
}

}