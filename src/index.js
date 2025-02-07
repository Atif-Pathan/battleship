import './styles.css';
import { initBoard, renderBoard } from './modules/renderGame,js';
import Player from './modules/Player.js';
import Ship from './modules/Ship.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the boards
  initBoard('player-grid', false); // Player board (non-clickable)
  initBoard('enemy-grid', true); // Enemy board (clickable)

  //   // Create players
  const player = new Player('real');
  const computer = new Player('computer');

  placeRandomShips(player.gameBoard);
  placeRandomShips(computer.gameBoard);

  console.log(player.gameBoard);
  console.log(computer.gameBoard);

  renderBoard(player.gameBoard, 'player-grid', 'player-overlay');
  //   renderBoard(computer.gameBoard, 'enemy-grid', 'enemy-overlay');
});

function placeRandomShips(gameBoard) {
  // The 10 ships you want to place:
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  for (const size of shipSizes) {
    // Create a ship
    const ship = new Ship(size);

    // Randomly choose orientation 50% of the time
    if (Math.random() < 0.5) {
      ship.rotate(); // By default, your Ship is horizontal, so rotate to vertical
    }

    let placed = false;
    while (!placed) {
      // Pick random row & column from 0 to 9
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);

      // Attempt to place
      placed = gameBoard.placeShip(ship, row, col);
      // If `placeShip` returns false, it means collision/out-of-bounds;
      // keep trying until success.
    }
  }
}
