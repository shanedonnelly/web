// File: main.js
const SBoard = require('./board');

var board = new SBoard();
console.log(board.toString());
var coord = SBoard.cellIdToCoord('A1');
var piece = board.getPiecefrom(coord)
console.log(coord,piece,piece.toString());