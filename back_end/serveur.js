// Importation des modules
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// env variables
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000';

// const LS_HOST = process.env.LS_HOST || 'localhost';
// const LS_PORT = process.env.LS_PORT || '5501';

//config
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize the "plain HTTP" server

const server = http.createServer(app);



app.use(express.static(path.join(__dirname, '..', 'front_end')));


// Allow requests from this origin
// (cross-origin resource sharing to support : browser > nginx > node)
// app.use(cors( /*{ origin: `http://${HOST}:${PORT}`, credentials: true }*/ ));


//websocket
const websocket = require('./websocket');

websocket.init(server);
//routes 

const authRouter = require('./routes/authentification');

app.use('/authentification', authRouter);

server.listen('8080', ' 0.0.0.0' , () => {
  console.log(`Serveur démarré http://${HOST}:${PORT}`);
});



// // WebSocket server

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
  
  //   var board = new SBoard();  
  
  //   console.log("a user connected to socket");
  //   ws.on('message', (message) => {
    //     const data = JSON.parse(message);  
    //     //console.log(`Received: ${data}`);
    //     // ws.send(`You sent: ${message}`);
    //     if(data.choice){
      //       console.log(`Received: ${data.choice}`);  
      //       var coord = SBoard.cellIdToCoord(data.choice);
      //       console.log(board.stringAt(coord));
      //     }
      //   });
      
      //   // handle error gracefully
      //   ws.on('error', (error) => {
        //       const index = connections.indexOf(ws);  
        //       if (index !== -1) {
          //         connections.splice(index, 1);  
          //       }
          //       console.log(`- websocket error (${connections.length})`);
          //   });
          
          // });
          
// Chess game
// const SBoard = require('./chessgame/board');
          