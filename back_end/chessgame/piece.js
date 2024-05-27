
class SPiece {
    constructor(color, name, pos) {
        this.color = color;
        this.name = name;
        this.pos = pos;
    }

    getPos() {
        return this.pos;
    }

    setPos(pos) {
        this.pos = pos;
    }

    getPath() {
        return "tomodify";
    }

    toString() {
        return `SPiece [color=${this.color.toString()}, name=${this.name}, pos=${this.pos}]`;
    }
}

module.exports = SPiece;
