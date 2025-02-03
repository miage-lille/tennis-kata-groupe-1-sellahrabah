import { Player } from './types/player';
import { Point, PointsData, Score } from './types/score';
// import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
// import { pipe } from 'fp-ts/lib/function';

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'PLAYER_TWO';
    case 'PLAYER_TWO':
      return 'PLAYER_ONE';
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string => {
  switch (point) {
    case 0:
      return "Love";
    case 15:
      return "Fifteen"; 
    case 30:
      return "Thirty"; 
    case 40:
      return "Forty"; 
    default:
      throw new Error(`Unknown point: ${point}`);
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case "POINTS":
      return `Player One: ${pointToString(score.pointsData.PLAYER_ONE)}, Player Two: ${pointToString(score.pointsData.PLAYER_TWO)}`;
    case "GAME":
      return `Game won by ${score.player === "PLAYER_ONE" ? "Player One" : "Player Two"}`;
    case "DEUCE":
      return "Deuce";
    case "ADVANTAGE":
      return `Advantage ${score.player === "PLAYER_ONE" ? "Player One" : "Player Two"}`;
    default:
      throw new Error(`Unknown score: ${score}`);
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  return {
    kind: "ADVANTAGE",
    player: winner,
  };
};


export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  throw new Error('not implemented');
};

export const scoreWhenForty = (
  currentForty: unknown, // TO UPDATE WHEN WE KNOW HOW TO REPRESENT FORTY
  winner: Player
): Score => {
  throw new Error('not implemented');
};

export const scoreWhenGame = (winner: Player): Score => {
  throw new Error('not implemented');
};

// Exercice 2
// Tip: You can use pipe function from fp-ts to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  throw new Error('not implemented');
};

export const score = (currentScore: Score, winner: Player): Score => {
  throw new Error('not implemented');
};
