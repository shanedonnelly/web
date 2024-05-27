

const IP = 'localhost';
const PORT = '3000';

var ws = null;
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the token exists
if (document.cookie.includes('gameToken')) {
    var gameToken = getCookie('gameToken');
    ws = new WebSocket(`ws://${IP}:${PORT}?token=${gameToken}`);
    ws.onopen = function() {
        console.log('WebSocket connection established.');
    };
    ws.onmessage = function (event){
        var data = JSON.parse(event.data);
        treateData(data);
    }
    ws.onclose = function(event) {
        alert('Connection WebSocket fermée');
        
    };

}
else {
    console.log('No gameToken found');
    if (ws){
        ws.close();
        document.getElementById('overlay-button').innerHTML = 'Se connecter pour jouer';
    }
}

var state = 'waiting for click';
var level = 1;
var role = null;
var gameStarted = false;
var clickCount = 0;
var firstChoice = null;
var secondChoice = null;


document.getElementById('overlay-button').addEventListener('click', askToPlay);

document.getElementById('grid').addEventListener('click', function(event) {
    // Check if the clicked element has the class 'cell'
    console.log('progressing');
    if (event.target.classList.contains('cell')) {
        // Save the id of the clicked cell
        clickedCellId = event.target.id;

        // Check the role
        if (role === 'black' || role === 'white') {
            console.log('in good place')
            if (clickCount === 0) {
                // Do something
                firstChoice = clickedCellId;
                clickCount++;
            }
            else if (clickCount === 1) {
                secondChoice = clickedCellId;
                ws.send(JSON.stringify({ type: 'play_move', cellfrom : firstChoice, cellto : secondChoice }));
                clickCount = 0;
        }
        }
    }
});

gameConnectAndPlay();

function gameConnectAndPlay(){
    try {
        console.log('in gameConnectAndPlay');
        console.log('state : ', state);
        waitForState('waiting for game to start')
        .then(function() {
            console.log('State is now waiting for game to start');
            // Do some more stuff
            return waitForState('game started');
        }).then(function() {
            console.log('State is now game started');
            // Do some more stuff
            return waitForState('game finished');
        }).then(function() {
            console.log('State is now game finished');
            
            // Add your code here to handle the refreshed page
        });
    }
    catch (error) {
        console.log(error);
    }
}

function askToPlay() {
    try {
        if (state === 'waiting for click') {
            ws.send(JSON.stringify({ type: 'ask_to_play' }));
            console.log('Asking to play');
            state = 'waiting for response';
            level = 2;
        }
    }
    catch (error) {
        console.log(error);
    }
}




function treateData(data){
    console.log(data);
    var result = data.result;
    var info = data.info;
    var type = data.type;

    if (result == true){
        if (type == 'new_state' && !gameStarted){
            newState(info);
        }
            
        if (type == 'join_response' && state === 'waiting for response'){
            role = info;
            console.log('role : ', role);
            state = 'waiting for game to start';
            level = 3;
        }
        if (type == 'game_started' && state === 'waiting for game to start'){
            gameStarted = true;
            state = 'game started';
            level = 4;
            console.log('game started');
            startGame();
        }
        if (type == 'game_finished' && state === 'game started'){
            state = 'game finished';
            level = 5;
            console.log('game finished');
        }
        if (type == 'game_reset'){
            state = 'waiting for click';
            level = 1;
            gameStarted = false;
            
            gameReset();
            
        }
    }
}

function gameReset(){
    state = 'waiting for click';
    level = 1;
    role = null;
    gameStarted = false;
    console.log('game reset');
    document.getElementById('overlay-button').innerHTML = 'Se connecter pour jouer';
    document.getElementById('grid').style.opacity = 0.5;
    document.getElementById('overlay-button').style.display = 'block';
    gameConnectAndPlay();
}

function startGame(){
    try {
        console.log('in start game');
        clearDisplay();
        fillBoard();
        // Add your code here to start the game
        console.log('playing game');

    }
    catch (error) {
        console.log(error);
    }
}

document.getElementById('grid').addEventListener('click', function(event) {
    // Check if the clicked element has the class 'cell'
    console.log('progressing');
    if (event.target.classList.contains('cell')) {
        // Save the id of the clicked cell
        clickedCellId = event.target.id;

        // Check the role
        if (role === 'black' || role === 'white') {
            console.log('in good place')
            if (clickCount === 0) {
                // Do something
                firstChoice = clickedCellId;
                clickCount++;
            }
            else if (clickCount === 1) {
                secondChoice = clickedCellId;
                ws.send(JSON.stringify({ type: 'play_move', cellfrom : firstChoice, cellto : secondChoice }));
                clickCount = 0;
        }
        }
    }
});


function fillBoard(){
    if (role == 'black'){
        console.log('role is black so we change the html ', role);
        document.getElementById('grid').innerHTML = `
        <div class="cell" id="h1"></div><div class="cell" id="g1"></div><div class="cell" id="f1"></div><div class="cell" id="e1"></div><div class="cell" id="d1"></div><div class="cell" id="c1"></div><div class="cell" id="b1"></div><div class="cell" id="a1"></div>
        <div class="cell" id="h2"></div><div class="cell" id="g2"></div><div class="cell" id="f2"></div><div class="cell" id="e2"></div><div class="cell" id="d2"></div><div class="cell" id="c2"></div><div class="cell" id="b2"></div><div class="cell" id="a2"></div>
        <div class="cell" id="h3"></div><div class="cell" id="g3"></div><div class="cell" id="f3"></div><div class="cell" id="e3"></div><div class="cell" id="d3"></div><div class="cell" id="c3"></div><div class="cell" id="b3"></div><div class="cell" id="a3"></div>
        <div class="cell" id="h4"></div><div class="cell" id="g4"></div><div class="cell" id="f4"></div><div class="cell" id="e4"></div><div class="cell" id="d4"></div><div class="cell" id="c4"></div><div class="cell" id="b4"></div><div class="cell" id="a4"></div>
        <div class="cell" id="h5"></div><div class="cell" id="g5"></div><div class="cell" id="f5"></div><div class="cell" id="e5"></div><div class="cell" id="d5"></div><div class="cell" id="c5"></div><div class="cell" id="b5"></div><div class="cell" id="a5"></div>
        <div class="cell" id="h6"></div><div class="cell" id="g6"></div><div class="cell" id="f6"></div><div class="cell" id="e6"></div><div class="cell" id="d6"></div><div class="cell" id="c6"></div><div class="cell" id="b6"></div><div class="cell" id="a6"></div>
        <div class="cell" id="h7"></div><div class="cell" id="g7"></div><div class="cell" id="f7"></div><div class="cell" id="e7"></div><div class="cell" id="d7"></div><div class="cell" id="c7"></div><div class="cell" id="b7"></div><div class="cell" id="a7"></div>
        <div class="cell" id="h8"></div><div class="cell" id="g8"></div><div class="cell" id="f8"></div><div class="cell" id="e8"></div><div class="cell" id="d8"></div><div class="cell" id="c8"></div><div class="cell" id="b8"></div><div class="cell" id="a8"></div>`;
    }
    // Select all cells with id ending in 1, 2, 7, or 8
let cells = document.querySelectorAll('[id$="1"], [id$="2"], [id$="7"], [id$="8"]');

var color = 'white';
var piece = null;
// Iterate over the selected cells
for (let i = 0; i < cells.length; i++) {
    let id = cells[i].id;
    // If the id ends in 7 or 8, set the color to black
    if (id.endsWith('7') || id.endsWith('8')) {
        color = 'black';
    }
    else {
        color = 'white';
    }
    if (id.endsWith('2') || id.endsWith('7')) {
        piece = 'pawn';
    }
    else {
        if (id.startsWith('a') || id.startsWith('h')) {
            piece = 'rook';
        }
        if (id.startsWith('b') || id.startsWith('g')) {
            piece = 'knight';
        }
        if (id.startsWith('c') || id.startsWith('f')) {
            piece = 'bishop';
        }
        if (id.startsWith('d')) {
            piece = 'queen';
        }
        if (id.startsWith('e')) {
            piece = 'king';
        }
    }

    // Create a new image element
    let child = document.createElement('img');
    
    // Set the source of the image
    console.log(`assets/game/finalpiece/${color}/${piece}.png`);
    child.src = `assets/game/finalpiece/${color}/${piece}.png`;

    // Append the image element to the current cell
    cells[i].appendChild(child);
}
}
    



clearDisplay = function(){
    document.getElementById('overlay-button').style.display = 'none';
    document.getElementById('game').style.opacity = 1;
}

function waitForState(expectedState) {
    console.log('waiting for state : ', expectedState);
    return new Promise(function(resolve) {
        var checkState = setInterval(function() {
            // console.log('state : ', state);
            // console.log('expected state : ', expectedState);
            if (state === expectedState) {
                clearInterval(checkState);
                resolve();
            }
        }, 50); // Check state every 1 second
    });
}



// game part 
function newState(new_state) {
// console.log('new state : ', new_state);
   var playbutton = document.getElementById('overlay-button');
   if (new_state === 0) {
      playbutton.innerHTML = 'Play 0/2';
   }
   if (new_state === 1) {
        playbutton.innerHTML = 'Play 1/2';
   }
   if (new_state === 2) {
        playbutton.innerHTML = 'Watch 2/2';
   }
}



// function sendClick(event) {
//     // Get the element that was clicked
//     var target = event.target;
//     console.log("enter in func send click");
//     // Check if the clicked element is a cell
//     if (target.classList.contains('cell')) {
//         // Get the id of the cell
//         var cellId = target.id;
//         var req = JSON.stringify({ choice: cellId });
//         console.log(('Sending: ' + req));
//         ws.send(JSON.stringify({ choice: cellId }));
//         // Do something with the cell id...
//     }
// }