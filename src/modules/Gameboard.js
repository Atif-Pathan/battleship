export default class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.missedAttacks = [];
  }

  getPerimeter(ship, rowStart, colStart, boardSize = 10) {
    // Determine how many rows and columns the ship occupies.
    let rowSpan, colSpan;
    if (ship.orientation === 'horizontal') {
      rowSpan = 1;
      colSpan = ship.length;
    } else if (ship.orientation === 'vertical') {
      rowSpan = ship.length;
      colSpan = 1;
    } else {
      throw new Error('Unknown orientation');
    }

    // Calculate the bounding box (one extra row/col on all sides).
    const top = rowStart - 1;
    const bottom = rowStart + rowSpan;
    const left = colStart - 1;
    const right = colStart + colSpan;

    const perimeter = [];

    // Loop through the bounding box.
    for (let r = top; r <= bottom; r++) {
      for (let c = left; c <= right; c++) {
        // Skip coordinates that belong to the ship's occupied area.
        if (
          r >= rowStart &&
          r < rowStart + rowSpan &&
          c >= colStart &&
          c < colStart + colSpan
        ) {
          continue;
        }
        // Only include coordinates that are within board bounds.
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
          perimeter.push([r, c]);
        }
      }
    }
    return perimeter;
  }

  getDiagonalCells(row, col, boardSize = 10) {
    const diagonals = [];
    const potentialDiagonals = [
      [row - 1, col - 1], // Top-left
      [row - 1, col + 1], // Top-right
      [row + 1, col - 1], // Bottom-left
      [row + 1, col + 1], // Bottom-right
    ];

    for (const [r, c] of potentialDiagonals) {
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        diagonals.push([r, c]);
      }
    }

    return diagonals;
  }

  fitsHorizontally(shipLength, colStart) {
    return colStart + shipLength - 1 < 10;
  }

  fitsVertically(shipLength, rowStart) {
    return rowStart + shipLength - 1 < 10;
  }

  placeShip(ship, rowStart, colStart) {
    if (ship.orientation === 'horizontal') {
      // 1) Check that the ship squares themselves are free
      if (!this.fitsHorizontally(ship.length, colStart)) {
        return false;
      }
      for (let c = colStart; c < colStart + ship.length; c++) {
        if (this.board[rowStart][c] !== null) {
          return false; // The actual ship space is occupied
        }
      }

      // 2) Check perimeter squares
      const perimeterCells = this.getPerimeter(ship, rowStart, colStart);
      for (const [r, c] of perimeterCells) {
        if (this.board[r][c] !== null) {
          return false; // Perimeter is blocked
        }
      }

      // 3) Actually place the ship
      for (let c = colStart; c < colStart + ship.length; c++) {
        this.board[rowStart][c] = { ship, hit: false };
      }
      this.ships.push({ ship, rowStart, colStart });
      return true;
    } else if (ship.orientation === 'vertical') {
      if (!this.fitsVertically(ship.length, rowStart)) {
        return false;
      }
      for (let r = rowStart; r < rowStart + ship.length; r++) {
        if (this.board[r][colStart] !== null) {
          return false; // The actual ship space is occupied
        }
      }

      // Check perimeter
      const perimeterCells = this.getPerimeter(ship, rowStart, colStart);
      for (const [r, c] of perimeterCells) {
        if (this.board[r][c] !== null) {
          return false;
        }
      }

      // Place ship
      for (let r = rowStart; r < rowStart + ship.length; r++) {
        this.board[r][colStart] = { ship, hit: false };
      }
      this.ships.push({ ship, rowStart, colStart });
      return true;
    }
    return false;
  }

  receiveAttack(row, col) {
    const cell = this.board[row][col];
    if (cell && cell.ship && !cell.hit) {
      cell.hit = true; // Mark this cell as hit.
      cell.ship.hit(); // Call the ship's hit method.
      if (cell.ship.isSunk()) {
        // Find the ship placement info
        const placement = this.ships.find((p) => p.ship === cell.ship);
        if (placement) {
          const perimeter = this.getPerimeter(
            cell.ship,
            placement.rowStart,
            placement.colStart
          );
          perimeter.forEach(([r, c]) => {
            // Mark each cell as "M" if it is still empty.
            if (this.board[r][c] === null) {
              this.board[r][c] = 'M';
            }
          });
        }
      } else {
        // For a single hit that doesn't sink the ship, you might mark the diagonal cells as M:
        const diagonals = this.getDiagonalCells(row, col);
        diagonals.forEach(([r, c]) => {
          if (this.board[r][c] === null) {
            this.board[r][c] = 'M';
          }
        });
      }
    } else if (cell === null) {
      // If the cell is empty, mark as a miss.
      this.board[row][col] = 'M';
      if (
        !this.missedAttacks.some(
          (coord) => coord[0] === row && coord[1] === col
        )
      ) {
        this.missedAttacks.push([row, col]);
      }
    }
  }

  allShipsSunk() {
    return this.ships.every((placement) => placement.ship.isSunk());
  }
}
