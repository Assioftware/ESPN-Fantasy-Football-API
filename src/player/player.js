import _ from 'lodash';

import ApiModel from '../api-model/api-model.js';

import { slotCategoryIdToPositionMap } from '../constants.js';

/**
 * Represents an NFL player that can be rostered on a fantasy football team. There is currently not
 * a discovered route to directly get player information. However, player information can be
 * retrieved from a boxscore and a team roster.
 * @extends ApiModel
 */
class Player extends ApiModel {
  static displayName = 'Player';

  static idName = 'playerId';

  /**
   * @typedef {object} PlayerModel
   * @property {number} playerId
   * @property {string} firstName First name of the player.
   * @property {string} lastName Last name of the player.
   * @property {string} jerseyNumber The jersey number the player wears.
   * @property {number} percentOwned The percentage of ESPN leagues in which this player is owned.
   * @property {number} percentOwnedChange The change in player ownership percentage in the last
   *                                       week across all ESPN.
   * @property {number} percentStarted The percentage of ESPN league in which this player was
   *                                   started for the week.
   * @property {boolean} isDroppable Whether or not the player can be dropped from a team.
   * @property {boolean} isActive Whether or not the player is active? TOOD: Improve
   * @property {boolean} isIREligible Whether or not the player is eligible to be placed in an IR
   *                                  roster slot.
   *
   * @property {string[]} eligiblePositions A list of the eligible position slots the player may be
   *                                        played in.
   */

  /**
    * @type {PlayerModel}
    */
  static responseMap = {
    playerId: 'playerId',

    firstName: 'firstName',
    lastName: 'lastName',
    jerseyNumber: 'jersey',

    percentOwned: 'percentOwned',
    percentOwnedChange: 'percentChange',
    percentStarted: 'percentStarted',

    isDroppable: 'isDroppable',
    isActive: 'isActive',
    isIREligible: 'isIREligible',

    eligiblePositions: {
      key: 'eligibleSlotCategoryIds',
      manualParse: (responseData) => _.map(
        responseData, (posId) => _.get(slotCategoryIdToPositionMap, posId)
      )
    }
  };

  /**
   * @throws Always, as there is no top level route to retrieve Players.
   */
  static read() {
    throw new Error(`${this.displayName}: read: Cannot call read.`);
  }
}

export default Player;
