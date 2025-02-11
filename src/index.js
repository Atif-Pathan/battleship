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

function showModal(message) {
  // Create modal overlay element
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'game-modal';
  modalOverlay.classList.add(
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-75',
    'flex',
    'items-center',
    'justify-center',
    'z-50'
  );
  // Create modal content container
  const modalContent = document.createElement('div');
  modalContent.classList.add(
    'bg-white',
    'p-10',
    'rounded-lg',
    'shadow-2xl',
    'text-center',
    'w-1/2',
    'max-w-2xl'
  );
  // Create message element
  const modalMessage = document.createElement('p');
  modalMessage.textContent = message;
  modalMessage.classList.add('text-4xl', 'font-bold', 'mb-8');
  // Create reset button
  const resetButton = document.createElement('button');
  resetButton.id = 'reset-button';
  resetButton.textContent = 'Reset Game';
  resetButton.classList.add(
    'bg-blue-500',
    'text-white',
    'py-3',
    'px-6',
    'rounded',
    'hover:bg-blue-600'
  );
  resetButton.addEventListener('click', resetGame);
  // Append message and button to modal content, then content to overlay.
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(resetButton);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

function resetGame() {
  // Remove the modal
  const modal = document.getElementById('game-modal');
  if (modal) {
    modal.remove();
  }
  computerTargetList.length = 0;
  // Re-initialize boards
  initBoard('player-grid', false);
  initBoard('enemy-grid', true, (index) =>
    handleEnemyCellClick(index, players.computer.gameBoard)
  );
  enemyGrid = document.getElementById('enemy-grid');
  playerGrid = document.getElementById('player-grid');
  playerGrid.classList.add('disable-grid');
  enemyGrid.classList.remove('disable-grid');

  // Create new players
  players.human = new Player('real');
  players.computer = new Player('computer');

  // Place ships randomly
  placeRandomShips(players.human.gameBoard);
  placeRandomShips(players.computer.gameBoard);

  // Create ship overlays once after ships are placed
  initShipOverlays(players.human.gameBoard, 'player-overlay', false);
  initShipOverlays(players.computer.gameBoard, 'enemy-overlay', true);

  // Render initial state
  renderBoard(players.human.gameBoard, 'player-grid', 'player-overlay', false);
  renderBoard(players.computer.gameBoard, 'enemy-grid', 'enemy-overlay', true);

  currentTurn = 'human';
}

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

  // Once ships are placed, create ship overlays once
  initShipOverlays(players.human.gameBoard, 'player-overlay', false);
  initShipOverlays(players.computer.gameBoard, 'enemy-overlay', true);

  // Render initial state
  renderBoard(players.human.gameBoard, 'player-grid', 'player-overlay', false);
  renderBoard(players.computer.gameBoard, 'enemy-grid', 'enemy-overlay', true);

  currentTurn = 'human';
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
  const row = Math.floor(index / 10);
  const col = index % 10;

  // Attack the cell.
  computerBoard.receiveAttack(row, col);

  // Re-render the enemy board.
  renderBoard(computerBoard, 'enemy-grid', 'enemy-overlay', true);

  // check if player won
  if (computerBoard.allShipsSunk()) {
    showModal('You Win!');
    return; // Stop processing turn-switch logic.
  }

  // Check if the attack was a hit.
  let wasHit = false;
  const cell = computerBoard.board[row][col];
  if (cell && cell.ship && cell.hit) {
    wasHit = true;
  }

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

    humanBoard.receiveAttack(row, col);
    renderBoard(humanBoard, 'player-grid', 'player-overlay', false);

    // Check if human board has lost
    if (humanBoard.allShipsSunk()) {
      showModal('You lose!');
      return;
    }

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
  }, 300);
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
