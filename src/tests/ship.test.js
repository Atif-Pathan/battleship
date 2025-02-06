// const Ship = require('../modules/Ship');
import Ship from '../modules/Ship';

describe('Ship', () => {
  let myShip;

  beforeEach(() => {
    myShip = new Ship(3);
  });

  describe('Initialization', () => {
    it('should initialize with 0 hits', () => {
      expect(myShip.hitsTaken).toBe(0);
    });
    it('should not be sunken (afloat)', () => {
      expect(myShip.sunk).toBe(false);
    });
    it('should have correct length', () => {
      expect(myShip.length).toBe(3);
    });
  });

  describe('Ship Orientation', () => {
    it('should have a default orientation of "horizontal"', () => {
      expect(myShip.orientation).toBe('horizontal');
    });

    it('should rotate from horizontal to vertical', () => {
      myShip.rotate();
      expect(myShip.orientation).toBe('vertical');
    });

    it('should rotate from horizontal to vertical to horizontal again', () => {
      // First, rotate to get vertical orientation
      myShip.rotate();
      // Then, rotate back
      myShip.rotate();
      expect(myShip.orientation).toBe('horizontal');
    });
  });

  describe('hit()', () => {
    it('should increase the number of hits', () => {
      const initialHits = myShip.hitsTaken;
      myShip.hit();
      expect(myShip.hitsTaken).toBe(initialHits + 1);
    });
  });

  describe('isSunk()', () => {
    it('should return false when hits are less than length', () => {
      expect(myShip.isSunk()).toBe(false);
    });

    it('should return true when hits equal the length', () => {
      for (let i = 0; i < 3; i++) {
        myShip.hit();
      }
      expect(myShip.isSunk()).toBe(true);
    });

    it('should remain sunk once sunk', () => {
      for (let i = 0; i < 3; i++) {
        myShip.hit();
      }
      expect(myShip.isSunk()).toBe(true);
      // Call it again
      expect(myShip.isSunk()).toBe(true);
    });
  });
});
