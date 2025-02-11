import './styles.css';
import {
  initBoard,
  renderBoard,
  initShipOverlays,
} from './modules/renderGame,js';
import Player from './modules/Player.js';
import Ship from './modules/Ship.js';

let currentTurn;
const players = {
  human: null,
  computer: null,
};

let enemyGrid;
let playerGrid;

const computerTargetList = [];

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the boards
  initBoard('player-grid', false);
  initBoard('enemy-grid', true, (index) =>
    handleEnemyCellClick(index, players.computer.gameBoard)
  );

  enemyGrid = document.getElementById('enemy-grid');
  playerGrid = document.getElementById('player-grid');
  playerGrid.classList.add('disable-grid');

  // Create players
  players.human = new Player('real');
  players.computer = new Player('computer');

  placeRandomShips(players.human.gameBoard);
  placeRandomShips(players.computer.gameBoard);

  console.log(players.human.gameBoard);
  console.log(players.computer.gameBoard);

  // Once ships are placed, create ship overlays once
  initShipOverlays(players.human.gameBoard, 'player-overlay', false);
  initShipOverlays(players.computer.gameBoard, 'enemy-overlay', true);

  // Render initial state
  renderBoard(players.human.gameBoard, 'player-grid', 'player-overlay', false);
  renderBoard(players.computer.gameBoard, 'enemy-grid', 'enemy-overlay', true);

  currentTurn = 'human';
  console.log("It's the human turn. Click on an enemy cell to attack.");
});

function placeRandomShips(gameBoard) {
  // place 10 ships of these sizes:
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  for (const size of shipSizes) {
    const ship = new Ship(size);

    // Randomly rotate ship 50% of the time
    if (Math.random() < 0.5) {
      ship.rotate();
    }

    let placed = false;
    while (!placed) {
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

  if (!wasHit) {
    // Switch turn to computer if no hit
    currentTurn = 'computer';
    computerMove();
  }
  // else, human player gets to go again
}

function computerMove() {
  enemyGrid.classList.add('disable-grid');
  playerGrid.classList.remove('disable-grid');

  setTimeout(() => {
    console.log('Computer making move...');
    const humanBoard = players.human.gameBoard;
    let row, col;
    let legal = false;

    // If our target list is not empty, try its next candidate.
    if (computerTargetList.length > 0) {
      // Remove any targets that are no longer legal.
      while (
        computerTargetList.length > 0 &&
        !isLegalMove(
          humanBoard,
          computerTargetList[0][0],
          computerTargetList[0][1]
        )
      ) {
        computerTargetList.shift();
      }
      if (computerTargetList.length > 0) {
        [row, col] = computerTargetList.shift();
        legal = true;
      }
    }

    // If no valid target was available, pick a random legal cell.
    if (!legal) {
      while (!legal) {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        if (isLegalMove(humanBoard, row, col)) {
          legal = true;
        }
      }
    }

    console.log(`Computer attacks cell at row ${row}, col ${col}`);
    humanBoard.receiveAttack(row, col);
    renderBoard(humanBoard, 'player-grid', 'player-overlay', false);

    // Determine if the move was a hit.
    let wasHit = false;
    const attackedCell = humanBoard.board[row][col];
    if (attackedCell && attackedCell.ship && attackedCell.hit) {
      wasHit = true;
    }

    if (wasHit) {
      // Add adjacent candidates from this hit.
      addAdjacentCandidates(humanBoard, row, col);
      // computer gets to go again
      setTimeout(() => computerMove(), 1000);
    } else {
      // computer missed so switch turn
      currentTurn = 'human';
      enemyGrid.classList.remove('disable-grid');
      playerGrid.classList.add('disable-grid');
    }
  }, 1000);
}

function isLegalMove(board, row, col) {
  // legal if its null or its a ship that isnt hit
  const cell = board.board[row][col];
  return cell === null || (cell && cell.ship && !cell.hit);
}

function addAdjacentCandidates(board, row, col) {
  const candidates = [];
  if (row - 1 >= 0) candidates.push([row - 1, col]); // Up
  if (row + 1 < 10) candidates.push([row + 1, col]); // Down
  if (col - 1 >= 0) candidates.push([row, col - 1]); // Left
  if (col + 1 < 10) candidates.push([row, col + 1]); // Right

  candidates.forEach(([r, c]) => {
    // Add if legal and not already in the target list.
    if (
      isLegalMove(board, r, c) &&
      !computerTargetList.some((coord) => coord[0] === r && coord[1] === c)
    ) {
      computerTargetList.push([r, c]);
    }
  });
}
