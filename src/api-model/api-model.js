import axios from 'axios';
import _ from 'lodash';
import q from 'q';

/**
 * The base class for all models.
 * @class
 */
class ApiModel {
  constructor(options = {}) {
    this.constructor._populateApiModel({
      data: options,
      model: this,
      isDataFromServer: false
    });
  }

  /**
   * The class name. Minification will break `this.constructor.name`, so this allows for verbose
   * printing even in minified code.
   * @type {String}
   */
  static displayName = 'ApiModel';

  /**
   * Denotes which attribute the ID of the model is defined on. This is typically the model name
   * appended by 'Id' (e.g. 'leagueId', 'teamId').
   * @type {String}
   */
  static idName = 'id';

  /**
   * Returns the passed instance of the ApiModel populated with the passed data, mapping the
   * attributes defined in the value of responseMap to the matching key.
   * @private
   * @param  {object} options.data
   * @param  {ApiModel} options.model The model to populate. This model will be mutated.
   * @param  {boolean} options.isDataFromServer When true, the data came from ESPN. When false, the
   *                                            data came locally (typically from another ApiModel).
   * @return {ApiModel} The mutated ApiModel model.
   */
  static _populateApiModel({ data, model, isDataFromServer }) {
    /**
     * @typedef {object} ResponseMapValueObject
     *
     * The `responseMap` can have two values: a string or a ResponseMapValueObject. When string, the
     * data found on that response is directly mapped to the ApiModel without mutation. When
     * ResponseMapValueObject, the data at the `key` will be used to create ApiModel(s) that are
     * then assigned onto the parent ApiModel as an attribute at the key of the `responseMap`.
     *
     * @property {string} key The key on the response data where the data can be found.
     * @property {ApiModel} ApiModel The ApiModel to create with the response data.
     * @property {boolean} isArray Whether or not the response data is an array. Useful for attributes
     *                             such as "teams".
     *
     * @example
     * static responseMap = {
     *   teams: { // ResponseMapValueObject
     *     key: 'teams_on_response',
     *     ApiModel: Team,
     *     isArray: true
     *   }
     * };
     *
     */
    _.forEach(this.responseMap, (value, key) => {
      let item;

      if (!isDataFromServer) {
        item = _.get(data, key);
      } else if (_.isString(value)) {
        item = _.get(data, value);
      } else if (_.isPlainObject(value)) {
        const ValueApiModelClass = value.ApiModel;
        const responseData = _.get(data, value.key);

        const buildModel = (passedData) => ValueApiModelClass.buildFromServer(passedData);
        item = value.isArray ? _.map(responseData, buildModel) : buildModel(responseData);
      } else {
        throw new Error(
          `${this.displayName}: _populateApiModel: Did not recognize responseMap value type for ` +
          `key ${key}`
        );
      }

      _.set(model, key, item);
    });

    this.cache[model.getId()] = model;

    return model;
  }

  /**
   * Returns a new instance of an ApiModel populated with passed data
   * @private
   * @param  {object} options.data
   * @param  {object} options.constructorParams Params to be passed to the instance's constructor.
   *                                            Useful for passing parent data, such as `leagueId`.
   * @param  {boolean} options.isDataFromServer When true, the data came from ESPN. When false, the
   *                                            data came locally (typically from another ApiModel).
   * @return {ApiModel} The mutated ApiModel model.
   */
  static _buildNewApiModel({ data, constructorParams, isDataFromServer }) {
    const model = new this(constructorParams);
    this._populateApiModel({ data, model, isDataFromServer });
    return model;
  }

  /**
   * Returns a new instance of the ApiModel populated with the passed data that came from ESPN,
   * mapping the attributes defined in the value of responseMap to the matching key. Use this method
   * when constructing ApiModels with responses.
   * @param  {object} data Data originating from the server.
   * @param  {object} constructorParams Params to be passed to the instance's constructor. Useful
   *                                    for passing parent data, such as `leagueId`.
   * @return {ApiModel} A new instance of the ApiModel populated with the passed data.
   */
  static buildFromServer(data, constructorParams) {
    return this._buildNewApiModel({ data, constructorParams, isDataFromServer: true });
  }

  /**
   * Returns a new instance of the ApiModel populated with the passed data that originated locally.
   * Passed data attributes are excepted to be matching the keys of the responseMap. Use this method
   * when constructing ApiModels with local data.
   * @param  {object} data Data originating locally.
   * @param  {object} constructorParams Params to be passed to the instance's constructor. Useful
   *                                    for passing parent data, such as `leagueId`.
   * @return {ApiModel} A new instance of the ApiModel populated with the passed data.
   */
  static buildFromLocal(data, constructorParams) {
    return this._buildNewApiModel({ data, constructorParams, isDataFromServer: false });
  }

  /**
   * Returns all cached models of an ApiModel. If no cache exists, a cache object is created. This
   * implementation ensures each class has a unique cache of only instances of the ApiModel that
   * does not overlap with other ApiModel classes.
   * @return {object} All cached models of the ApiModel type.
   */
  static get cache() {
    if (!this._cache) {
      this._cache = {};
    }

    return this._cache;
  }

  /**
   * Sets the cache object.
   * @param  {object} cache
   */
  static set cache(cache) {
    this._cache = cache;
  }

  static clearCache() {
    this._cache = {};
  }

  /**
   * Makes a call to the passed route with the passed params.
   * @async
   * @throws {Error} If route is not passed
   * @param  {string} options.route
   * @param  {Object} options.params Params to pass on the GET call.
   * @return {Promise}
   */
  static read({ route, params } = { route: this.constructor.route }) {
    if (!route) {
      throw new Error(`${this.displayName}: static read: cannot read without route`);
    }

    // eslint-disable-next-line no-console
    return axios.get(route, { params }).catch(() => console.warn('read errored'));
  }

  /**
   * Makes a call to the passed route with the passed params. Defers actual GET call to
   * `static read` Automatically includes the id of the instance in the params. On successful read,
   * populates the instance with the new response data.
   * @async
   * @throws {Error} If route is not passed
   * @param  {string} options.route
   * @param  {Object} options.params Params to pass on the GET call.
   * @return {Promise}
   */
  read({ route, params, reload = true } = { route: this.constructor.route, reload: true }) {
    const id = this.getId();
    if (!id) {
      throw new Error(`${this.displayName}: static read: cannot read on instance without an id`);
    } else if (this.constructor.cache[id] && !reload) {
      return this.constructor.cache[id];
    }

    const paramsWithId = _.assign({}, params, { [this.constructor.idName]: id });
    return this.constructor.read({
      route,
      params: paramsWithId
    }).then((response) => {
      this.constructor._populateApiModel({
        data: response.data,
        model: this,
        isDataFromServer: true
      });

      return response; // Allows promise chaining to work with response.
    });
  }

  /**
   * Gets the instance's id, using `static idName` to set the correct attribute.
   * @return {number}
   */
  getId() {
    return _.get(this, this.constructor.idName);
  }

  /**
   * Gets the instance's id, using `static idName` to set the correct attribute.
   * @param {number} id
   */
  setId(id) {
    _.set(this, this.constructor.idName, id);
  }
}

export default ApiModel;
