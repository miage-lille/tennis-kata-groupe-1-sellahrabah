import { Player } from './player';

// Surely not the best choice
export type Point = number;

export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};

export type Points = {
  kind: 'POINTS';
  pointsData: PointsData;
};

export const points = (
  playerOnePoints: Point,
  playerTwoPoints: Point
): Points => ({
  kind: 'POINTS',
  pointsData: {
    PLAYER_ONE: playerOnePoints,
    PLAYER_TWO: playerTwoPoints,
  },
});

// Exercice 0: Write all type constructors of Points, Deuce, Forty and Advantage types.

export type Deuce = {
  kind: 'DEUCE';
};

export const deuce = (): Deuce => ({
  kind: 'DEUCE',
});

export type Forty = {
  kind: 'FORTY';
  player: Player; // Player who has 40 points
  otherPoint: Point; // Other player's points
};

export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  player,
  otherPoint,
});

export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player; // Player who has the advantage
};

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});

export type Game = {
  kind: 'GAME';
  player: Player; // Player has won
};

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});

// Updating the Score type to include the new types
export type Score = Points | Deuce | Forty | Advantage | Game;
