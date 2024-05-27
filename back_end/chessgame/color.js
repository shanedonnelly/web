class SColor {
    static NOIR = 'NOIR';
    static BLANC = 'BLANC';

    constructor(color) {
        this.color = color;
    }

    static inverse(color) {
        return color === this.BLANC ? this.NOIR : this.BLANC;
    }

    static pawnDirection(color) {
        return color === this.NOIR ? 1 : -1;
    }

    static pawnFirstLineX(color) {
        if (color === this.BLANC) {
            return 6;
        } else if (color === this.NOIR) {
            return 1;
        } else {
            console.log("erreur dans scolor");
            return -1;
        }
    }

    static areEqual(color1, color2) {
        return color1 === color2;
    }

    toString() {
        return this.color;
    }
}

module.exports = SColor;
        