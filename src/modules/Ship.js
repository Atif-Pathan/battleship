export default class Ship {
  constructor(length) {
    this.length = length;
    this.hitsTaken = 0;
    this.sunk = false;
    this.orientation = 'horizontal';
  }

  hit() {
    this.hitsTaken += 1;
  }

  isSunk() {
    if (this.length === this.hitsTaken) {
      this.sunk = true;
    }
    return this.sunk;
  }

  rotate() {
    if (this.orientation === 'horizontal') {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }
  }
}
