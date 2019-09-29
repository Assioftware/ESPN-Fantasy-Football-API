import axios from 'axios';
import _ from 'lodash';

import Boxscore from '../boxscore/boxscore';
import FreeAgentPlayer from '../free-agent-player/free-agent-player';
import League from '../league/league';
import NFLGame from '../nfl-game/nfl-game';
import Team from '../team/team';

axios.defaults.baseURL = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/';

class Client {
  constructor(options = {}) {
    this.leagueId = options.leagueId;

    this.setCookies({ espnS2: options.espnS2, SWID: options.SWID });
  }

  /**
   * Correctly builds an axios config with cookies, if set on the instance
   * @param  {object} config An axios config.
   * @return {object}        An axios config with cookies added if set on instance
   * @private
   */
  _buildAxiosConfig(config) {
    if ((this.espnS2 && this.SWID)) {
      const headers = { Cookie: `espn_s2=${this.espnS2}; SWID=${this.SWID};` };
      return _.merge({}, config, { headers, withCredentials: true });
    }

    return config;
  }

  /**
   * Set cookies from ESPN for interacting with private leagues in NodeJS. Both cookie smust be
   * provided to be set.
   * @param {string} options.espnS2
   * @param {string} options.SWID
   */
  setCookies({ espnS2, SWID }) {
    if (espnS2 && SWID) {
      this.espnS2 = espnS2;
      this.SWID = SWID;
    }
  }

  /**
   * Returns all boxscores for a week.
   * NOTE: Due to the way ESPN populates data, both the `scoringPeriodId` and `matchupPeriodId` are
   * required and must correspond with each other correctly.
   * @param  {number} options.seasonId The season in which the boxscores occur.
   * @param  {number} options.matchupPeriodId
   * @param  {number} options.scoringPeriodId
   * @return {Boxscore[]}
   */
  getBoxscoreForWeek({ seasonId, matchupPeriodId, scoringPeriodId }) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = `?view=mMatchup&view=mMatchupScore&scoringPeriodId=${scoringPeriodId}`;
    const route = `${routeBase}${routeParams}`;

    return axios.get(route, this._buildAxiosConfig()).then((response) => {
      const schedule = _.get(response.data, 'schedule');
      const data = _.filter(schedule, { matchupPeriodId });

      return _.map(data, (matchup) => (
        Boxscore.buildFromServer(matchup, { leagueId: this.leagueId, seasonId })
      ));
    });
  }

  /**
   * Returns all free agents (in terms of the league's rosters) for a given week.
   * NOTE: `scoringPeriodId` of 0 corresponds to the preseason; `18` for after the season ends.
   * @param  {number} options.seasonId
   * @param  {number} options.scoringPeriodId
   * @return {FreeAgentPlayer[]}
   */
  getFreeAgents({ seasonId, scoringPeriodId }) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = `?scoringPeriodId=${scoringPeriodId}&view=kona_player_info`;
    const route = `${routeBase}${routeParams}`;

    return axios.get(route, this._buildAxiosConfig()).then((response) => {
      const data = _.get(response.data, 'players');
      return _.map(data, (player) => (
        FreeAgentPlayer.buildFromServer(player, { leagueId: this.leagueId, seasonId })
      ));
    });
  }

  /**
   * Returns an array of Team object representing each fantasy football team in the FF league.
   * @param  {number} options.seasonId
   * @param  {number} options.scoringPeriodId
   * @return {Team[]}
   */
  getTeamsAtWeek({ seasonId, scoringPeriodId }) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = `?scoringPeriodId=${scoringPeriodId}&view=mRoster&view=mTeam`;
    const route = `${routeBase}${routeParams}`;

    return axios.get(route, this._buildAxiosConfig()).then((response) => {
      const data = _.get(response.data, 'teams');
      return _.map(data, (team) => (
        Team.buildFromServer(team, { leagueId: this.leagueId, seasonId })
      ));
    });
  }

  /**
   * Returns all NFL games that occur in the passed timeframe. NOTE: Date format must be "YYYYMMDD".
   * @param  {string} options.startDate Must be in "YYYYMMDD" format.
   * @param  {string} options.endDate   Must be in "YYYYMMDD" format.
   * @return {NFLGame[]}
   */
  getNFLGamesForPeriod({ startDate, endDate }) {
    const routeBase = 'apis/fantasy/v2/games/ffl/games';
    const routeParams = `?dates=${startDate}-${endDate}&pbpOnly=true`;
    const route = `${routeBase}${routeParams}`;

    const axiosConfig = this._buildAxiosConfig({ baseURL: 'https://site.api.espn.com/' });

    return axios.get(route, axiosConfig).then((response) => {
      const data = _.get(response.data, 'events');
      return _.map(data, (game) => NFLGame.buildFromServer(game));
    });
  }

  /**
   * Returns info on an ESPN fantasy football league
   * @param  {number} options.seasonId
   * @return {League}
   */
  getLeagueInfo({ seasonId }) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = '?view=mSettings';
    const route = `${routeBase}${routeParams}`;

    return axios.get(route, this._buildAxiosConfig()).then((response) => {
      const data = _.get(response.data, 'settings');
      return League.buildFromServer(data, { leagueId: this.leagueId, seasonId });
    });
  }
}

export default Client;
