import Player from '../modules/Player';
import GameBoard from '../modules/Gameboard';

describe('Player Class', () => {
  describe('Real Player', () => {
    let realPlayer;

    beforeEach(() => {
      // Create a real player; for example, by passing "real" as the type.
      realPlayer = new Player('real');
    });

    it('should have a gameboard property that is an instance of GameBoard', () => {
      expect(realPlayer.gameBoard).toBeDefined();
      expect(realPlayer.gameBoard).toBeInstanceOf(GameBoard);
    });

    it('should have a type property set to "real"', () => {
      expect(realPlayer.type).toBe('real');
    });
  });

  describe('Computer Player', () => {
    let computerPlayer;

    beforeEach(() => {
      // Create a computer player by passing "computer" as the type.
      computerPlayer = new Player('computer');
    });

    it('should have a gameboard property that is an instance of GameBoard', () => {
      expect(computerPlayer.gameBoard).toBeDefined();
      expect(computerPlayer.gameBoard).toBeInstanceOf(GameBoard);
    });

    it('should have a type property set to "computer"', () => {
      expect(computerPlayer.type).toBe('computer');
    });
  });

  describe('Default Behavior', () => {
    let defaultPlayer;

    beforeEach(() => {
      // If you want the default player type to be "real" (when no type is provided)
      defaultPlayer = new Player();
    });

    it('should default to a real player if no type is provided', () => {
      expect(defaultPlayer.type).toBe('real');
      expect(defaultPlayer.gameBoard).toBeInstanceOf(GameBoard);
    });
  });
});
