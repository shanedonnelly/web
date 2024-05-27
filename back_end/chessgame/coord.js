
 class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    equals(obj) {
        if (this === obj)
            return true;
        if (obj === null || this.constructor !== obj.constructor)
            return false;
        const other = obj;
        return this.x === other.x && this.y === other.y;
    }
}
module.exports = Coord;
