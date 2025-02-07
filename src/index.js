import './styles.css';
import { initBoard } from './modules/renderGame,js';
// import Player from './modules/Player.js';
// import Ship from './modules/Ship.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the boards
  initBoard('player-grid', false); // Player board (non-clickable)
  initBoard('enemy-grid', true); // Enemy board (clickable)

  //   // Create players
  //   const player = new Player('real');
  //   const computer = new Player('computer');

  //   // Populate boards with predetermined placements, for now.
  //   player.gameBoard.placeShip(new Ship(3), 1, 1);
  //   player.gameBoard.placeShip(new Ship(4), 5, 2);
  //   computer.gameBoard.placeShip(new Ship(2), 0, 0);
  //   computer.gameBoard.placeShip(new Ship(5), 7, 3);

  //   // Render the boards
  //   renderBoard(player.gameBoard, 'player-grid');
  //   renderBoard(computer.gameBoard, 'enemy-grid');
});
