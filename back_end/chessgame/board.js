const SColor = require('./color.js');
const SPiece = require('./piece.js');
const Coord = require('./coord.js');
const PieceName = require('./piecename.js');
const LineDirection = require('./linedirection.js');
// Java code translation
class SBoard {
    constructor() {
        this.currentPlayer =new SColor('BLANC');
        this.plateau = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.ajoutSet(new SColor('BLANC'));
        this.ajoutSet(new SColor('NOIR'));
    }

    toString() {
        return `SBoard [currentPlayer=${this.currentPlayer}\n plateau=${this.boardString()}]`;
    }

    boardString() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.plateau[i][j];
                if (p !== null) {
                    res += this.plateau[i][j].toString();
                }
            }
            res += "\n";
        }
        return res;
    }

    static cellIdToCoord(cellId){
        const column = cellId.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - parseInt(cellId[1]);
        return new Coord(column, row);
    }
    getPiecefrom(c) {
        return this.plateau[c.x][c.y];
    }

    stringAt(c){
        const piece = this.getPiecefrom(c);
        if(piece == null){
            return 'Case Vide';
        }
        else{
            return piece.toString();
        }
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer.inverse();
    }

    setPieceOf(c, s) {
        this.plateau[c.x][c.y] = s;
    }

    ajoutSet(c) {
        let dy = 0;
        let dyp = 0;
        if (SColor.areEqual(c.color, SColor.BLANC)) {
            dy = 7;
            dyp = 5;
        }
        for (let i = 0; i < 8; i++) {
            this.plateau[i][1 + dyp] = new SPiece(c, PieceName.PAWN, new Coord(i, 1 + dyp));
        }
        this.plateau[0][dy] = new SPiece(c, PieceName.ROOK, new Coord(0, dy));
        this.plateau[7][dy] = new SPiece(c, PieceName.ROOK, new Coord(7, dy));
        this.plateau[1][dy] = new SPiece(c, PieceName.KNIGHT, new Coord(1, dy));
        this.plateau[6][dy] = new SPiece(c, PieceName.KNIGHT, new Coord(6, dy));
        this.plateau[2][dy] = new SPiece(c, PieceName.BISHOP, new Coord(2, dy));
        this.plateau[5][dy] = new SPiece(c, PieceName.BISHOP, new Coord(5, dy));
        this.plateau[3][dy] = new SPiece(c, PieceName.QUEEN, new Coord(3, dy));
        this.plateau[4][dy] = new SPiece(c, PieceName.KING, new Coord(4, dy));
    }


    static onBoard(x, y) {
        return x >= 1 && x <= 8 && y >= 1 && y <= 8;
    }

    correctChoice(from) {
        const x = from.x;
        const y = from.y;
        let res = true;
        const piece = this.plateau[x][y];

        if (piece !== null) {
            console.log(piece.toString());
        }

        if (piece === null) {
            res = false;
        } else if (piece.color !== this.currentPlayer) {
            res = false;
        }
        return res;
    }

    caseVide(c) {
        return this.plateau[c.x][c.y] === null;
    }

    caseVide(x, y) {
        return this.plateau[x][y] === null;
    }

    cibleCorrect(to) {
        const x2 = to.x;
        const y2 = to.y;
        const piecevisé = this.plateau[x2][y2];

        if (piecevisé !== null) {
            console.log(piecevisé.toString());
        }

        if (piecevisé !== null && this.currentPlayer === piecevisé.color) {
            return false;
        } else return true;
    }

    verifCoup(from, to) {
        let res = true;
        const x = from.x;
        const y = from.y;
        const piece = this.plateau[x][y];
        switch (piece.name) {
            case PAWN:
                res = verifPawnMove(from, to);
                break;
            case BISHOP:
                res = verifBishopMove(from, to);
                break;
            case KING:
                res = verifKingMove(from, to);
                break;
            case KNIGHT:
                res = verifKnightMove(from, to);
                break;
            case QUEEN:
                res = verifQueenMove(from, to);
                break;
            case ROOK:
                res = verifRookMove(from, to);
                break;
            default:
                break;
        }
        console.log(res);
        return res;
    }

    directLineCheck(from, to) {
        let dir = null;
        if (from.x === to.x) {
            if (from.y > to.y) {
                dir = LineDirection.NORD;
            } else {
                dir = LineDirection.SUD;
            }
        } else if (from.y === to.y) {
            if (from.x < to.x) {
                dir = LineDirection.EST;
            }
        } else {
            dir = LineDirection.NOTHING;
        }
        return dir;
    }

    diagnonalCheck(from, to) {
        let dir = null;
        if (Math.abs(from.x - to.x) === Math.abs(from.y - to.y)) {
            if (from.x < to.x) {
                if (from.y > to.y) {
                    dir = LineDirection.NORDEST;
                } else {
                    dir = LineDirection.SUDEST;
                }
            } else {
                if (from.y > to.y) {
                    dir = LineDirection.NORDOUEST;
                } else {
                    dir = LineDirection.SUDOUEST;
                }
            }
        } else {
            dir = LineDirection.NOTHING;
        }
        return dir;
    }

    linePossible(line, from, to) {
        let res = true;
        let x = from.x;
        let y = from.y;
        let dx = 0;
        let dy = 0;
        console.log(line);
        switch (line) {
            case NOTHING:
                return false;
            case EST:
                dx = 1;
                break;
            case NORDEST:
                dx = 1;
                dy = -1;
                break;
            case NORD:
                dy = -1;
                break;
            case NORDOUEST:
                dx = -1;
                dy = -1;
                break;
            case OUEST:
                dx = -1;
                break;
            case SUDOUEST:
                dx = -1;
                dy = 1;
                break;
            case SUD:
                dy = 1;
                break;
            case SUDEST:
                dy = 1;
                dx = 1;
                break;
            default:
                break;
        }
        x += dx;
        y += dy;

        while (x !== to.x && y !== to.x && res) {
            console.log(x + " " + y);
            if (!this.caseVide(x, y)) {
                res = false;
            }
            x += dx;
            y += dy;
        }
        return res;
    }

    verifRookMove(from, to) {
        let res = true;
        const dir = directLineCheck(from, to);
        if (dir === LineDirection.NOTHING) {
            res = false;
            return res;
        } else {
            res = linePossible(dir, from, to);
        }
        return res;
    }

    verifQueenMove(from, to) {
        let res = true;
        let dir = directLineCheck(from, to);
        if (dir === LineDirection.NOTHING) {
            dir = this.diagnonalCheck(from, to);
        }
        if (dir === LineDirection.NOTHING) {
            res = false;
        } else {
            res = linePossible(dir, from, to);
        }
        return res;
    }

    verifKnightMove(from, to) {
        const res =
            (Math.abs(from.x - to.x) === 1 && Math.abs(from.y - to.y) === 2) ||
            (Math.abs(from.x - to.x) === 2 && Math.abs(from.y - to.y) === 1);
        return res;
    }

    verifKingMove(from, to) {
        const res =
            Math.abs(from.x - to.x) <= 1 && Math.abs(from.y - to.y) <= 1;
        return res;
    }

    verifBishopMove(from, to) {
        let res = true;
        const dir = this.diagnonalCheck(from, to);
        if (dir === LineDirection.NOTHING) {
            res = false;
            return res;
        } else {
            res = linePossible(dir, from, to);
        }
        return res;
    }

    verifPawnMove(from, to) {
        const sens = this.currentPlayer.pawnDirection();
        const firstDepart = from.y === this.currentPlayer.pawnFirstLineX();
        let res = false;

        console.log(
            firstDepart +
                " " +
                sens +
                " " +
                this.currentPlayer.pawnFirstLineX() +
                " " +
                from.x +
                " " +
                from.y +
                " " +
                to.x +
                " " +
                to.y +
                " "
        );

        if (
            firstDepart &&
            to.equals(new Coord(from.x, from.y + 2 * sens)) &&
            this.caseVide(from.x, from.y + sens) &&
            this.caseVide(from.x, from.y + 2 * sens)
        ) {
            res = true;
        } else if (
            to.equals(new Coord(from.x, from.y + sens)) &&
            this.caseVide(from.x, from.y + sens)
        ) {
            res = true;
        } else if (
            (to.equals(new Coord(from.x - 1, from.y + sens)) ||
                to.equals(new Coord(from.x + 1, from.y + sens))) &&
            !this.caseVide(to) &&
            this.plateau[to.x][to.y].color.equals(currentPlayer.inverse())
        ) {
            res = true;
        }
        return res;
    }
}

module.exports = SBoard;

