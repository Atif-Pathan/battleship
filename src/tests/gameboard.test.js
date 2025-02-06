import Ship from '../modules/Ship';
import GameBoard from '../modules/Gameboard';

describe('GameBoard Initialization', () => {
  let myBoard;

  beforeEach(() => {
    myBoard = new GameBoard();
  });

  it('should initialize with a 10x10 empty 2D array', () => {
    expect(myBoard.board).toBeDefined();
    expect(myBoard.board).toHaveLength(10);
    myBoard.board.forEach((row) => {
      expect(row).toHaveLength(10);
      row.forEach((cell) => {
        expect(cell).toBe(null);
      });
    });
  });
});

describe('GameBoard - Ship Placement', () => {
  let myBoard, testShip1, testShip2;

  beforeEach(() => {
    myBoard = new GameBoard();
    testShip1 = new Ship(3); // defaults to horizontal
    testShip2 = new Ship(4);
    testShip2.rotate(); // Assume rotate() changes orientation to vertical
  });

  it('should place a horizontal ship at the given coordinates', () => {
    // Place testShip1 horizontally starting at row 1, col 1.
    expect(myBoard.placeShip(testShip1, 1, 1)).toBe(true);
    expect(myBoard.board[1][1]).toEqual({ ship: testShip1, hit: false });
    expect(myBoard.board[1][2]).toEqual({ ship: testShip1, hit: false });
    expect(myBoard.board[1][3]).toEqual({ ship: testShip1, hit: false });
  });

  it('should place a vertical ship at the given coordinates', () => {
    // Place testShip2 vertically starting at row 2, col 1.
    expect(myBoard.placeShip(testShip2, 2, 1)).toBe(true);
    expect(myBoard.board[2][1]).toEqual({ ship: testShip2, hit: false });
    expect(myBoard.board[3][1]).toEqual({ ship: testShip2, hit: false });
    expect(myBoard.board[4][1]).toEqual({ ship: testShip2, hit: false });
    expect(myBoard.board[5][1]).toEqual({ ship: testShip2, hit: false });
  });

  it('should add a ship to the ships array when placed successfully', () => {
    expect(myBoard.placeShip(testShip1, 1, 1)).toBe(true);
    expect(
      myBoard.ships.some((placement) => placement.ship === testShip1)
    ).toBe(true);
  });

  it('should not place a ship if any part is outside of the grid (horizontal)', () => {
    expect(myBoard.placeShip(testShip1, 3, 8)).toBe(false);
    expect(myBoard.board[3][8]).toBe(null);
    expect(myBoard.board[3][9]).toBe(null);
  });

  it('should not place a ship if any part is outside of the grid (vertical)', () => {
    expect(myBoard.placeShip(testShip2, 7, 8)).toBe(false);
    expect(myBoard.board[7][8]).toBe(null);
    expect(myBoard.board[8][8]).toBe(null);
    expect(myBoard.board[9][8]).toBe(null);
  });

  it('should not allow placement if the new ship’s perimeter collides with an existing ship', () => {
    // Place testShip1 at (5,5) horizontally:
    expect(myBoard.placeShip(testShip1, 5, 5)).toBe(true);

    // Create a new ship of length 2.
    const testShip3 = new Ship(2); // defaults to horizontal
    // Try to place testShip3 so that its area touches the perimeter of testShip1.
    // testShip1 occupies (5,5), (5,6), (5,7) and its perimeter (via getPerimeter) includes (4,7) among others.
    // Attempt placing testShip3 at (4,7) horizontally.
    expect(myBoard.placeShip(testShip3, 4, 7)).toBe(false);
    // Likewise, ensure that no cell around (4,7) was modified.
    expect(myBoard.board[4][7]).toBe(null);
  });
});

describe('GameBoard - Edge Cases for Ship Placement', () => {
  let myBoard, testShip, testShip2;

  beforeEach(() => {
    myBoard = new GameBoard();
    // For these tests, use a short ship (length 2) for clarity.
    testShip = new Ship(2);
    testShip2 = new Ship(2);
    testShip2.rotate();
  });

  it('should place a horizontal ship at the top-left corner (0,0)', () => {
    expect(myBoard.placeShip(testShip, 0, 0)).toBe(true);
    // For a horizontal ship of length 2 starting at (0,0):
    // it occupies (0,0) and (0,1).
    expect(myBoard.board[0][0]).toEqual({ ship: testShip, hit: false });
    expect(myBoard.board[0][1]).toEqual({ ship: testShip, hit: false });
    // Check perimeter: getPerimeter should return only in-bound coordinates.
    const perimeter = myBoard.getPerimeter(testShip, 0, 0);
    perimeter.forEach(([r, c]) => {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(10);
      expect(c).toBeLessThan(10);
    });
  });

  it('should place a horizontal ship at the top-right corner', () => {
    // For a horizontal ship of length 2 placed at (0,8):
    // it occupies (0,8) and (0,9)
    expect(myBoard.placeShip(testShip, 0, 8)).toBe(true);
    expect(myBoard.board[0][8]).toEqual({ ship: testShip, hit: false });
    expect(myBoard.board[0][9]).toEqual({ ship: testShip, hit: false });
    const perimeter = myBoard.getPerimeter(testShip, 0, 8);
    perimeter.forEach(([r, c]) => {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(10);
      expect(c).toBeLessThan(10);
    });
  });

  it('should place a vertical ship at the bottom-left corner', () => {
    // For a vertical ship of length 2 placed at (8,0):
    // it occupies (8,0) and (9,0)
    expect(myBoard.placeShip(testShip2, 8, 0)).toBe(true);
    expect(myBoard.board[8][0]).toEqual({ ship: testShip2, hit: false });
    expect(myBoard.board[9][0]).toEqual({ ship: testShip2, hit: false });
    const perimeter = myBoard.getPerimeter(testShip2, 8, 0);
    perimeter.forEach(([r, c]) => {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(10);
      expect(c).toBeLessThan(10);
    });
  });

  it('should place a vertical ship at the bottom-right corner', () => {
    // For a vertical ship of length 2 placed at (8,9):
    // it occupies (8,9) and (9,9)
    expect(myBoard.placeShip(testShip2, 8, 9)).toBe(true);
    expect(myBoard.board[8][9]).toEqual({ ship: testShip2, hit: false });
    expect(myBoard.board[9][9]).toEqual({ ship: testShip2, hit: false });
    const perimeter = myBoard.getPerimeter(testShip2, 8, 9);
    perimeter.forEach(([r, c]) => {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(10);
      expect(c).toBeLessThan(10);
    });
  });
});

describe('GameBoard - Receive Attack', () => {
  let myBoard, testShip;

  beforeEach(() => {
    myBoard = new GameBoard();
    // Create and place a horizontal ship of length 3 at (3,4); it will occupy (3,4), (3,5), and (3,6).
    testShip = new Ship(3); // defaults to "horizontal"
    myBoard.placeShip(testShip, 3, 4);
  });

  describe('Basic Hit & Miss', () => {
    it('should record a hit on a ship cell and update that cell to hit', () => {
      myBoard.receiveAttack(3, 4);
      expect(testShip.hitsTaken).toBe(1);
      expect(myBoard.board[3][4]).toEqual({ ship: testShip, hit: true });
    });

    it('should record a miss on an empty cell', () => {
      myBoard.receiveAttack(0, 0);
      expect(myBoard.board[0][0]).toBe('M');
    });

    it('should not increase hit count on duplicate attacks on the same ship cell', () => {
      myBoard.receiveAttack(3, 4);
      expect(testShip.hitsTaken).toBe(1);
      myBoard.receiveAttack(3, 4);
      expect(testShip.hitsTaken).toBe(1);
      expect(myBoard.board[3][4]).toEqual({ ship: testShip, hit: true });
    });
  });

  describe('Enhanced Marking on Hit', () => {
    it('should mark the four diagonal cells as "M" when a ship cell is hit but does not sink the ship', () => {
      // Attack the cell (3,4) of the ship.
      myBoard.receiveAttack(3, 4);
      expect(testShip.hitsTaken).toBe(1);
      expect(myBoard.board[3][4]).toEqual({ ship: testShip, hit: true });
      // Expected four diagonals relative to (3,4):
      // Top-left: (2,3)
      // Top-right: (2,5)
      // Bottom-left: (4,3)
      // Bottom-right: (4,5)
      expect(myBoard.board[2][3]).toBe('M');
      expect(myBoard.board[2][5]).toBe('M');
      expect(myBoard.board[4][3]).toBe('M');
      expect(myBoard.board[4][5]).toBe('M');
    });

    it('should mark the entire perimeter as "M" when an attack sinks the ship', () => {
      // Sink the ship by attacking all its cells:
      myBoard.receiveAttack(3, 4);
      myBoard.receiveAttack(3, 5);
      myBoard.receiveAttack(3, 6);
      expect(testShip.hitsTaken).toBe(3);
      expect(testShip.isSunk()).toBe(true);

      // For a horizontal ship placed at (3,4) with length 3,
      // the occupied cells are: (3,4), (3,5), (3,6)
      // Expected perimeter (all cells adjacent to these):
      // Row above: (2,3), (2,4), (2,5), (2,6), (2,7)
      // Same row sides: (3,3) and (3,7)
      // Row below: (4,3), (4,4), (4,5), (4,6), (4,7)
      const expectedPerimeter = [
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 7],
        [3, 3],
        [3, 7],
        [4, 3],
        [4, 4],
        [4, 5],
        [4, 6],
        [4, 7],
      ];
      expectedPerimeter.forEach(([r, c]) => {
        expect(myBoard.board[r][c]).toBe('M');
      });
    });
  });

  describe('Receive Attack Edge Cases', () => {
    let boardEdge, edgeShip;

    beforeEach(() => {
      boardEdge = new GameBoard();
      // Place a horizontal ship of length 2 at the top edge (0,2): occupies (0,2) and (0,3)
      edgeShip = new Ship(2);
      expect(boardEdge.placeShip(edgeShip, 0, 2)).toBe(true);
    });

    it('should mark only valid diagonal cells when a hit occurs on a cell at the top edge', () => {
      // Attack the cell (0,2)
      boardEdge.receiveAttack(0, 2);
      expect(edgeShip.hitsTaken).toBe(1);
      expect(boardEdge.board[0][2]).toEqual({ ship: edgeShip, hit: true });
      // Diagonals for (0,2): potential cells (-1,1), (-1,3), (1,1), (1,3)
      // Only (1,1) and (1,3) are in bounds.
      const expectedDiagonals = [
        [1, 1],
        [1, 3],
      ];
      expectedDiagonals.forEach(([r, c]) => {
        expect(boardEdge.board[r][c]).toBe('M');
      });
    });

    it('should mark only valid diagonal cells when a hit occurs on a cell at the bottom-right corner', () => {
      // Place a horizontal ship of length 2 at the bottom-right corner: occupies (9,8) and (9,9)
      const boardCorner = new GameBoard();
      const cornerShip = new Ship(2); // horizontal by default
      expect(boardCorner.placeShip(cornerShip, 9, 8)).toBe(true);
      // Attack cell (9,8); diagonals for (9,8): (8,7), (8,9), (10,7), (10,9)
      // Only (8,7) and (8,9) are valid.
      boardCorner.receiveAttack(9, 8);
      expect(cornerShip.hitsTaken).toBe(1);
      expect(boardCorner.board[9][8]).toEqual({ ship: cornerShip, hit: true });
      const expectedDiagonalsCorner = [
        [8, 7],
        [8, 9],
      ];
      expectedDiagonalsCorner.forEach(([r, c]) => {
        expect(boardCorner.board[r][c]).toBe('M');
      });
    });
  });
});

describe('GameBoard - Missed Attacks Tracking', () => {
  let myBoard;

  beforeEach(() => {
    myBoard = new GameBoard();
  });

  it('should record a miss in the missedAttacks array when an empty cell is attacked', () => {
    myBoard.receiveAttack(0, 0);
    expect(myBoard.board[0][0]).toBe('M');
    expect(myBoard.missedAttacks).toContainEqual([0, 0]);
  });

  it('should not record duplicate missed attacks for the same cell', () => {
    myBoard.receiveAttack(0, 0);
    myBoard.receiveAttack(0, 0);
    expect(myBoard.board[0][0]).toBe('M');
    expect(myBoard.missedAttacks.length).toBe(1);
    expect(myBoard.missedAttacks).toContainEqual([0, 0]);
  });
});
