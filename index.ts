import { isSamePlayer, Player } from './types/player';
import { advantage, deuce, fifteen, forty, FortyData, game, Point, points, PointsData, Score, thirty } from './types/score';
import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

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
  const currentPoint = current[winner];
  switch (currentPoint.kind) {
    case 'LOVE':
      return points(
        winner === 'PLAYER_ONE' ? fifteen() : current.PLAYER_ONE,
        winner === 'PLAYER_TWO' ? fifteen() : current.PLAYER_TWO
      );
    case 'FIFTEEN':
      return points(
        winner === 'PLAYER_ONE' ? thirty() : current.PLAYER_ONE,
        winner === 'PLAYER_TWO' ? thirty() : current.PLAYER_TWO
      );
    case 'THIRTY': {
      const opponent = winner === 'PLAYER_ONE' ? 'PLAYER_TWO' : 'PLAYER_ONE';
      return forty(winner, current[opponent]);
    }
    default:
      throw new Error('Invalid state');
  }
};

export const incrementPoint = (point: Point): Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return some(fifteen());
    case 'FIFTEEN':
      return some(thirty());
    case 'THIRTY':
      return none;
    default:
      return none;
  }
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'DEUCE':
      return advantage(winner);
    case 'ADVANTAGE':
      return currentScore.player === winner ? game(winner) : deuce();
    case 'GAME':
      return currentScore;
    default:
      throw new Error('Invalid state');
};
}

