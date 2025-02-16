import { isSamePlayer, Player } from './types/player';
import { advantage, deuce, FortyData, game, Point, PointsData, Score } from './types/score';
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
  switch (point.kind) {
    case 'LOVE':
      return '0';
    case 'FIFTEEN':
      return '15'; 
    case 'THIRTY':
      return '30';
    default:
      throw new Error(`Unknown point: ${point.kind}`);
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return `Player One: ${pointToString(score.pointsData.PLAYER_ONE)}, Player Two: ${pointToString(score.pointsData.PLAYER_TWO)}`;
    case 'GAME':
      return `Game won by ${score.player === "PLAYER_ONE" ? "Player One" : "Player Two"}`;
    case 'DEUCE':
      return 'Deuce';
    case 'ADVANTAGE':
      return `Advantage ${score.player === "PLAYER_ONE" ? "Player One" : "Player Two"}`;
    case 'FORTY':
      return `Forty ${score.fortyData.player === "PLAYER_ONE" ? "Player One" : "Player Two"}`;
      default:
      throw new Error(`Unknown score: ${score}`);
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  return advantage(winner);
};


export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if(advantagedPlayed === winner){
    return game(winner);
  }
  return deuce();
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    matchOpt(
      () => deuce(),
      p => forty(currentForty.player, p) as Score
    )
  );
};

export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
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
function pipe(arg0: any, arg1: any): Score {
  throw new Error('Function not implemented.');
}

function incrementPoint(otherPoint: Point): any {
  throw new Error('Function not implemented.');
}

function matchOpt(arg0: () => import("./types/score").Deuce, arg1: (p: any) => Score): any {
  throw new Error('Function not implemented.');
}

function forty(player: string, p: any): Score {
  throw new Error('Function not implemented.');
}

