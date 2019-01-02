import axios from 'axios';

import BaseObject from './src/base-object/base-object.js';
import BaseCachableObject from './src/base-cachable-object/base-cachable-object.js';
import BaseAPIObject from './src/base-api-object/base-api-object.js';

import Boxscore from './src/boxscore/boxscore.js';
import BoxscorePlayer from './src/boxscore-player/boxscore-player.js';
import BoxscorePlayerPointStats
  from './src/boxscore-player-point-stats/boxscore-player-point-stats.js';
import BoxscoreTeam from './src/boxscore-team/boxscore-team.js';

import League from './src/league/league.js';
import NFLGame from './src/nfl-game/nfl-game.js';
import Player from './src/player/player.js';
import Scoreboard from './src/scoreboard/scoreboard.js';
import ScoreboardMatchup from './src/scoreboard-matchup/scoreboard-matchup.js';
import Team from './src/team/team.js';

import nflTeams from './src/nfl-teams/nfl-teams.js';
import {
  nflTeamIdToNFLTeam,
  nflTeamIdToNFLTeamAbbreviation,
  slotCategoryIdToPositionMap
} from './src/constants.js';

axios.defaults.baseURL = 'http://games.espn.com/ffl/api/v2/';

export {
  BaseObject,
  BaseCachableObject,
  BaseAPIObject,

  Boxscore,
  BoxscorePlayer,
  BoxscorePlayerPointStats,
  BoxscoreTeam,
  League,
  NFLGame,
  Player,
  Scoreboard,
  ScoreboardMatchup,
  Team,

  nflTeams,
  nflTeamIdToNFLTeam,
  nflTeamIdToNFLTeamAbbreviation,
  slotCategoryIdToPositionMap
};
