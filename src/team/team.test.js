import _ from 'lodash';

import Player from '../player/player';

import Team from './team';

describe('Team', () => {
  describe('constructor', () => {
    describe('when options are not passed', () => {
      const testPropIsUndefined = (prop) => {
        test(`${prop} is undefined`, () => {
          const newInstance = new Team();
          expect(_.get(newInstance, prop)).toBeUndefined();
        });
      };

      testPropIsUndefined('leagueId');
      testPropIsUndefined('seasonId');
    });

    describe('when options are passed', () => {
      const testPropIsSetFromOptions = (prop) => {
        test(`${prop} is set from options`, () => {
          const value = 25;
          const newInstance = new Team({ [prop]: value });
          expect(_.get(newInstance, prop)).toBe(value);
        });
      };

      testPropIsSetFromOptions('leagueId');
      testPropIsSetFromOptions('seasonId');
    });
  });

  describe('responseMap', () => {
    const buildTeam = (data, options) => Team.buildFromServer(data, options);

    describe('roster', () => {
      describe('manualParse', () => {
        test('returns an array of players', () => {
          const data = {
            owner: {
              firstName: 'Test',
              id: '{BAD5167F-96F5-40FF-AFF0-4D2CC92F4058}',
              lastName: 'Owner'
            },
            roster: {
              entries: [{
                playerPoolEntry: { id: 0 }
              }, {
                playerPoolEntry: { id: 1 }
              }, {
                playerPoolEntry: { id: 2 }
              }]
            }
          };

          const team = buildTeam(data, { seasonId: 2018 });

          expect.hasAssertions();
          _.forEach(team.roster, (player, index) => {
            expect(player).toBeInstanceOf(Player);
            expect(player.id).toBe(index);
            expect(player.seasonId).toBe(team.seasonId);
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
          expect(Team.getIDParams(params)).toBeUndefined();
        });
      };

      describe('when called with no params', () => {
        test('returns undefined', () => {
          expect(Team.getIDParams()).toBeUndefined();
        });
      });

      describe('when id is defined', () => {
        describe('when leagueId is defined', () => {
          describe('when seasonId is defined', () => {
            test('returns a valid caching id', () => {
              const params = { id: 341243, leagueId: 412322, seasonId: 2017 };

              const returnedCachingId = Team.getIDParams(params);
              expect(returnedCachingId).toEqual(params);
            });
          });

          describe('when seasonId is undefined', () => {
            testReturnsUndefined({ id: 341243, leagueId: 312321 });
          });
        });

        describe('when leagueId is not defined', () => {
          describe('when seasonId is defined', () => {
            testReturnsUndefined({ id: 341243, seasonId: 2018 });
          });

          describe('when seasonId is undefined', () => {
            testReturnsUndefined({ id: 341243 });
          });
        });
      });

      describe('when id is undefined', () => {
        describe('when leagueId is defined', () => {
          describe('when seasonId is defined', () => {
            testReturnsUndefined({ leagueId: 231231, seasonId: 2018 });
          });

          describe('when seasonId is undefined', () => {
            testReturnsUndefined({ leagueId: 231231 });
          });
        });

        describe('when leagueId is not defined', () => {
          describe('when seasonId is defined', () => {
            testReturnsUndefined({ seasonId: 2018 });
          });

          describe('when seasonId is undefined', () => {
            testReturnsUndefined({});
          });
        });
      });
    });
  });
});
