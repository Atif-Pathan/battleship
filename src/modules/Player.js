import GameBoard from './Gameboard';

export default class Player {
  constructor(type = 'real') {
    this.type = type;
    this.gameBoard = new GameBoard();
  }
}
