import ApiModel from '../api-model/api-model.js';
import NFLTeam from '../nfl-team/nfl-team.js';

/**
 * Represents a NFL game. All NFL games for a given week can be found in a boxscore. Additionally,
 * a roster will have all games relevant to the players on the roster.
 * @extends ApiModel
 */
class NFLGame extends ApiModel {
  static displayName = 'NFLGame';

  static idName = 'gameId';

  /**
   * @typedef {object} NFLGameModel
   * @property {number} gameId Note: There is no known endpoint to do anything with this id.
   * @property {string} gameDate The timestamp of when the NFL game is scheduled for.
   * @property {string} gameStatus A string representing the state of the game. Returned on the
   *                               response as a numerical enum:
   *                               1: Game has not started
   *                               2: Game in progress
   *                               3: Game finished
   *
   * @property {NFLTeam} homeTeam The NFLTeam that is the home team in the game.
   * @property {NFLTeam} awayTeam The NFLTeam that is the away team in the game.
   * @property {number} homeTeamScore The score of the home team.
   * @property {number} awayTeamScore The score of the away team.
   *
   * @property {number} quarter The quarter in which the game is in. NOTE: `quarter` will be `0` if
   *                            the game has not started yet. `quarter` will be `4` if the game is
   *                            finished.
   * @property {string} timeLeftInQuarter A string with how much time is left in the quarter.
   *                                      Formatted as `MM:SS`.
   */

  /**
    * @type {NFLGameModel}
    */
  static responseMap = {
    gameId: 'gameId',
    gameDate: 'gameDate',
    gameStatus: {
      key: 'status',
      manualParse: (responseData) => {
        switch (responseData) {
          case 1: return 'Game has not started';
          case 2: return 'Game in progress';
          case 3: return 'Game finished';
          default: return 'ERROR: gameStatus not recognized';
        }
      }
    },

    homeTeam: {
      key: 'homeProTeamId',
      manualParse: (responseData) => NFLTeam.get(responseData)
    },
    awayTeam: {
      key: 'awayProTeamId',
      manualParse: (responseData) => NFLTeam.get(responseData)
    },
    homeTeamScore: 'homeScore',
    awayTeamScore: 'awayScore',

    quarter: 'period',
    timeLeftInQuarter: 'timeRemainingInPeriod'
  };
}

export default NFLGame;
