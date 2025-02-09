import './styles.css';
import {
  initBoard,
  renderBoard,
  initShipOverlays,
} from './modules/renderGame,js';
import Player from './modules/Player.js';
import Ship from './modules/Ship.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the boards
  initBoard('player-grid', false);
  initBoard('enemy-grid', true, (index) =>
    handleEnemyCellClick(index, computer.gameBoard)
  );

  //   // Create players
  const player = new Player('real');
  const computer = new Player('computer');

  placeRandomShips(player.gameBoard);
  placeRandomShips(computer.gameBoard);

  console.log(player.gameBoard);
  console.log(computer.gameBoard);

  // Once ships are placed, create ship overlays once
  initShipOverlays(player.gameBoard, 'player-overlay', false);
  initShipOverlays(computer.gameBoard, 'enemy-overlay', true);

  // Render initial state (cells are updated each time)
  renderBoard(player.gameBoard, 'player-grid', 'player-overlay', false);
  renderBoard(computer.gameBoard, 'enemy-grid', 'enemy-overlay', true);
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

function handleEnemyCellClick(index, computerBoard) {
  console.log(`Enemy cell ${index} clicked!`);
  const row = Math.floor(index / 10);
  const col = index % 10;

  // Attack the cell
  computerBoard.receiveAttack(row, col);

  // Re-render so hits/misses show up
  renderBoard(computerBoard, 'enemy-grid', 'enemy-overlay', true);
}
