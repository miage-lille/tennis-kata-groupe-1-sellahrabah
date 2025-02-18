import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, scoreWhenAdvantage, scoreWhenDeuce, scoreWhenForty, scoreWhenPoint } from '..';
import { advantage, deuce, forty, game, thirty } from '../types/score';
import * as fc from 'fast-check';

import * as G from './generators';
import { isSamePlayer } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    fc.assert(
      fc.property(G.getPlayer(), winner => {
        const score = scoreWhenDeuce(winner);
        const scoreExpected = advantage(winner);
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(isSamePlayer(advantagedPlayer, winner));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const scoreExpected = game(winner);
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(!isSamePlayer(advantagedPlayer, winner));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const scoreExpected = deuce();
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(isSamePlayer(fortyData.player, winner));
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = game(winner);
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });
  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        fc.pre(fortyData.otherPoint.kind === 'THIRTY');
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = deuce();
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });
  test('Given player at 40 and other at 15 when other wins, score is 40 - 15', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        fc.pre(fortyData.otherPoint.kind === 'FIFTEEN');
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = forty(fortyData.player, thirty());
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });
});

  // -------------------------TESTS POINTS-------------------------- //
  test('A player scoring from 0 or 15 keeps the game in POINTS state', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        // Vérifier que le gagnant a un score de LOVE ou FIFTEEN
        fc.pre(pointsData[winner].kind === 'LOVE' || pointsData[winner].kind === 'FIFTEEN');
  
        const newScore = scoreWhenPoint(pointsData, winner);
  
        // Le jeu doit rester dans l'état POINTS
        expect(newScore.kind).toBe('POINTS');
  
        // Vérifier l'incrémentation correcte du score du gagnant
        if (newScore.kind === 'POINTS') {
          if (pointsData[winner].kind === 'LOVE') {
            expect(newScore.pointsData[winner].kind).toBe('FIFTEEN');
          }
          if (pointsData[winner].kind === 'FIFTEEN') {
            expect(newScore.pointsData[winner].kind).toBe('THIRTY');
          }
        }
      })
    );
  });
  test('Given one player at 30 and win, score kind is forty', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        // Vérifier que le gagnant a un score de THIRTY
        fc.pre(pointsData[winner].kind === 'THIRTY');
  
        // Vérifier que l'autre joueur n'a pas THIRTY (sinon, ce serait une égalité)
        const opponent = otherPlayer(winner);
        fc.pre(pointsData[opponent].kind !== 'THIRTY');
  
        const newScore = scoreWhenPoint(pointsData, winner);
  
        // Le jeu doit passer à l'état FORTY
        expect(newScore.kind).toBe('FORTY');
  
        // Vérifier que les données FORTY sont bien mises à jour
        if (newScore.kind === 'FORTY') {
          expect(newScore.fortyData.player).toBe(winner);
          expect(newScore.fortyData.otherPoint).toStrictEqual(pointsData[opponent]);
        }
      })
    );
});
