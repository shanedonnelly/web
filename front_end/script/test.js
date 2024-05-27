const IP = 'localhost';
const PORT = '4000';


//Test.js
var ws = null;

ws = new WebSocket(`ws://${IP}:${PORT}`);

state = 0;


ws.onopen = function() {
    console.log('WebSocket connection established.');
}
ws.onmessage = function(event){
    var data = JSON.parse(event.data);
    treateData(data);
}


function treateData(data){
    console.log(data);
    var result = data.result;
    var message = data.message;
    var type = data.type;

    if (result == true){
        if (type == 'always'){
            console.log('always');
        }
        else {
            if (message == 'message 0' && state == 0){
                state = 1;
            }
            else if (message == 'message 1' && state == 1){
                state = 2;
            }
            else if (message == 'message 2' && state == 2){
                state = 3;
            }
        }
    }
}

function waitForState(expectedState) {
    return new Promise(function(resolve) {
        var checkState = setInterval(function() {
            if (state === expectedState) {
                clearInterval(checkState);
                resolve();
            }
        }, 50); // Check state every 1 second
    });
}

function test(){
    waitForState(1).then(function() {
        console.log('State is now 1');
        // Do some stuff
    
        return waitForState(2);
    }).then(function() {
        console.log('State is now 2');
        // Do some more stuff
    
        return waitForState(3);
    }).then(function() {
        console.log('State is now 3');
        // Do even more stuff
    });
}

test();
