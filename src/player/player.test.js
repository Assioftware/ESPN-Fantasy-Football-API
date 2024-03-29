import _ from 'lodash';

import {
  nflTeamIdToNFLTeam,
  nflTeamIdToNFLTeamAbbreviation,
  slotCategoryIdToPositionMap
} from '../constants.js';

import Player from './player.js';

describe('Player', () => {
  describe('constructor', () => {
    describe('when options are not passed', () => {
      const testPropIsUndefined = (prop) => {
        test(`${prop} is undefined`, () => {
          const newInstance = new Player();
          expect(_.get(newInstance, prop)).toBeUndefined();
        });
      };

      testPropIsUndefined('seasonId');
      testPropIsUndefined('scoringPeriodId');
    });

    describe('when options are passed', () => {
      const testPropIsSetFromOptions = (prop) => {
        test(`${prop} is set from options`, () => {
          const value = 25;
          const newInstance = new Player({ [prop]: value });
          expect(_.get(newInstance, prop)).toBe(value);
        });
      };

      testPropIsSetFromOptions('seasonId');
      testPropIsSetFromOptions('scoringPeriodId');
    });
  });

  describe('responseMap', () => {
    const buildPlayer = (data, options) => Player.buildFromServer(data, options);

    describe('jerseyNumber', () => {
      describe('manualParse', () => {
        describe('when a value is passed', () => {
          test('converts response to a number', () => {
            const data = { jersey: '23' };
            const player = buildPlayer(data);

            expect(player.jerseyNumber).toBe(23);
          });
        });

        describe('when a value is not passed', () => {
          test('returns undefined', () => {
            const data = {};
            const player = buildPlayer(data);

            expect(player.jerseyNumber).toBeUndefined();
          });
        });
      });
    });

    describe('proTeam', () => {
      describe('manualParse', () => {
        test('maps team id to human readable string', () => {
          const proTeamId = 22;
          const data = { proTeamId };

          const player = buildPlayer(data);
          expect(player.proTeam).toBe(_.get(nflTeamIdToNFLTeam, proTeamId));
        });
      });
    });

    describe('proTeamAbbreviation', () => {
      describe('manualParse', () => {
        test('maps team id to human readable abbreviation', () => {
          const proTeamId = 22;
          const data = { proTeamId };

          const player = buildPlayer(data);
          expect(player.proTeamAbbreviation).toBe(_.get(nflTeamIdToNFLTeamAbbreviation, proTeamId));
        });
      });
    });

    describe('defaultPosition', () => {
      describe('manualParse', () => {
        test('maps id to human readable position', () => {
          const defaultPositionId = 2;
          const data = { defaultPositionId };

          const player = buildPlayer(data);
          expect(player.defaultPosition).toBe(
            _.get(slotCategoryIdToPositionMap, defaultPositionId)
          );
        });
      });
    });

    describe('eligiblePositions', () => {
      describe('manualParse', () => {
        test('maps ids to positions', () => {
          const eligibleSlots = [0, 1, 2];
          const data = { eligibleSlots };

          const player = buildPlayer(data);

          expect.hasAssertions();
          _.forEach(player.eligiblePositions, (position, index) => {
            expect(position).toBe(
              _.get(slotCategoryIdToPositionMap, eligibleSlots[index])
            );
          });
        });
      });
    });

    describe('acquiredDate', () => {
      describe('manualParse', () => {
        describe('when data is passed', () => {
          test('returns a Date', () => {
            const acquisitionDate = 1545432134218;
            const data = { acquisitionDate };

            const player = buildPlayer(data);
            expect(player.acquiredDate).toEqual(new Date(acquisitionDate));
          });
        });

        describe('when data is not passed', () => {
          test('returns undefined', () => {
            const acquisitionDate = undefined;
            const data = { acquisitionDate };

            const player = buildPlayer(data);
            expect(player.acquiredDate).toBeUndefined();
          });
        });
      });
    });
  });

  describe('class methods', () => {
    describe('getIDParams', () => {
      const testReturnsUndefined = ({ id, seasonId }) => {
        test('returns undefined', () => {
          const params = { id, seasonId };
          expect(Player.getIDParams(params)).toBeUndefined();
        });
      };

      describe('when called with no params', () => {
        test('returns undefined', () => {
          expect(Player.getIDParams()).toBeUndefined();
        });
      });

      describe('when id is defined', () => {
        describe('when seasonId is defined', () => {
          describe('when scoringPeriodId is defined', () => {
            test('returns a valid caching id', () => {
              const params = {
                id: 341243,
                seasonId: 2017,
                scoringPeriodId: 3
              };

              const returnedCachingId = Player.getIDParams(params);
              expect(returnedCachingId).toEqual(params);
            });
          });

          describe('when scoringPeriodId is undefined', () => {
            testReturnsUndefined({
              id: 341243,
              seasonId: 2017
            });
          });
        });

        describe('when seasonId is undefined', () => {
          describe('when scoringPeriodId is defined', () => {
            testReturnsUndefined({ id: 341243, scoringPeriodId: 3 });
          });

          describe('when scoringPeriodId is undefined', () => {
            testReturnsUndefined({ id: 341243 });
          });
        });
      });

      describe('when id is undefined', () => {
        describe('when seasonId is defined', () => {
          describe('when scoringPeriodId is defined', () => {
            testReturnsUndefined({ seasonId: 2017, scoringPeriodId: 2 });
          });

          describe('when scoringPeriodId is undefined', () => {
            testReturnsUndefined({ seasonId: 2017 });
          });
        });

        describe('when seasonId is undefined', () => {
          describe('when scoringPeriodId is defined', () => {
            testReturnsUndefined({ scoringPeriodId: 4 });
          });

          describe('when scoringPeriodId is undefined', () => {
            testReturnsUndefined({});
          });
        });
      });
    });
  });
});
