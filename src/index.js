import './styles.css';
import {
  initBoard,
  renderBoard,
  initShipOverlays,
} from './modules/renderGame,js';
import Player from './modules/Player.js';
import Ship from './modules/Ship.js';

// Global turn tracker: "human" or "computer"
let currentTurn;
const players = {
  human: null,
  computer: null,
};

let enemyGrid;
let playerGrid;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the boards
  initBoard('player-grid', false);
  initBoard('enemy-grid', true, (index) =>
    handleEnemyCellClick(index, players.computer.gameBoard)
  );

  enemyGrid = document.getElementById('enemy-grid');
  playerGrid = document.getElementById('player-grid');
  playerGrid.classList.add('disable-grid');

  //   // Create players
  players.human = new Player('real');
  players.computer = new Player('computer');

  placeRandomShips(players.human.gameBoard);
  placeRandomShips(players.computer.gameBoard);

  console.log(players.human.gameBoard);
  console.log(players.computer.gameBoard);

  // Once ships are placed, create ship overlays once
  initShipOverlays(players.human.gameBoard, 'player-overlay', false);
  initShipOverlays(players.computer.gameBoard, 'enemy-overlay', true);

  // Render initial state (cells are updated each time)
  renderBoard(players.human.gameBoard, 'player-grid', 'player-overlay', false);
  renderBoard(players.computer.gameBoard, 'enemy-grid', 'enemy-overlay', true);

  currentTurn = 'human';
  console.log("It's the human turn. Click on an enemy cell to attack.");
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
  if (currentTurn !== 'human') return;
  console.log(`Enemy cell ${index} clicked!`);
  const row = Math.floor(index / 10);
  const col = index % 10;

  // Attack the cell.
  computerBoard.receiveAttack(row, col);

  // Check if the attack was a hit.
  let wasHit = false;
  const cell = computerBoard.board[row][col];
  if (cell && cell.ship && cell.hit) {
    wasHit = true;
  }

  // Re-render the enemy board.
  renderBoard(computerBoard, 'enemy-grid', 'enemy-overlay', true);

  if (wasHit) {
    console.log('Hit! You get another attack.');
    // Remain on human turn—do not switch.
  } else {
    // Switch turn to computer.
    currentTurn = 'computer';
    console.log("Missed! Now it's the computer's turn...");
    computerMove();
  }
}

function computerMove() {
  // Disable enemy board during computer's turn.
  enemyGrid.classList.add('disable-grid');
  // Enable the human board (if you wish to show it differently) or keep it disabled.
  playerGrid.classList.remove('disable-grid');

  setTimeout(() => {
    console.log('Computer making move...');

    const humanBoard = players.human.gameBoard;
    let row, col;
    let legal = false;
    // Find a random legal move.
    while (!legal) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      const cell = humanBoard.board[row][col];
      // Assume a cell is legal if it is either null or contains a ship that has not yet been hit.
      if (cell === null || (cell && cell.ship && !cell.hit)) {
        legal = true;
      }
    }

    console.log(`Computer attacks cell at row ${row}, col ${col}`);
    humanBoard.receiveAttack(row, col);

    // Re-render the human board.
    renderBoard(humanBoard, 'player-grid', 'player-overlay', false);

    // Check if the computer's attack was a hit.
    let wasHit = false;
    const attackedCell = humanBoard.board[row][col];
    if (attackedCell && attackedCell.ship && attackedCell.hit) {
      wasHit = true;
    }

    if (wasHit) {
      console.log('Computer hit! It gets another turn.');
      // Keep turn as 'computer' and call computerMove() again after a delay.
      setTimeout(computerMove, 1000);
    } else {
      console.log("Computer missed! Now it's the human's turn again.");
      currentTurn = 'human';
      // Enable enemy board for human clicks and disable human board.
      enemyGrid.classList.remove('disable-grid');
      playerGrid.classList.add('disable-grid');
    }
  }, 2000); // 2-second delay for computer move.
}
