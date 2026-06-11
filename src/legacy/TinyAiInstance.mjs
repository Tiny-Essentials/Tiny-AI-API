import objectHash from 'object-hash';
import { EventEmitter } from 'events';
import { encode as encodeBase64 } from 'js-base64';
import { isJsonObject, objType } from '../tiny-modules/basics/objFilter.mjs';

/**
 * @typedef {Object} SessionDataContent
 * @property {AIContentData[]} data
 * @property {number[]} ids
 * @property {{ data: Array<TokenCount>; [key: string]: * }} tokens
 * @property {{ data: Array<string>; [key: string]: * }} hash
 * @property {string|null} systemInstruction
 * @property {{ name: string; type: string; }[]} [customList]
 * @property {string|null} model
 *
 */

/**
 * @typedef {Record<string, any> & SessionDataContent} SessionData
 */

/**
 * @typedef {Object} AiModel
 * @property {any} _response
 * @property {number} index
 * @property {string|null} name
 * @property {string|null} id
 * @property {string|null} displayName
 * @property {string|null} version
 * @property {string|null} description
 * @property {number|null} inputTokenLimit
 * @property {number|null} outputTokenLimit
 * @property {number|null} temperature
 * @property {number|null} maxTemperature
 * @property {number|null} topP
 * @property {number|null} topK
 * @property {string[]} [supportedGenerationMethods]
 */

/**
 * @typedef {Object} AiCategory
 * @property {string} category
 * @property {string} displayName
 * @property {number} index
 * @property {AiModel[]} data
 */

/**
 * @typedef {Object} AIContentData
 * @property {Array<Record<'text' | 'inlineData', string | { mime_type: string, data: string } | null>>} parts
 * @property {string|undefined} [role]
 * @property {string|number|undefined} [finishReason]
 */

/**
 * @typedef {{ count: number|null, hide?: boolean }} TokenCount
 */

/**
 * Tiny AI Server Communication API
 * -----------------------------
 * This class is responsible for managing AI session data, including models, history, and content generation.
 * The script is designed to interact with the AI API, providing a complete structure for creating user interfaces (UI) or AI-powered chatbots.
 * It implements a session management system to help handle multiple different bots.
 * However, this script is not optimized for efficiently handling multiple AI instances simultaneously, which may be required for high-load scenarios or when running several AI instances at once.
 *
 * **Note**: This script does not automatically manage or track the token count for messages. Developers need to implement their own logic to monitor and manage token usage if necessary.
 *
 * Documentation written with the assistance of OpenAI's ChatGPT.
 * @deprecated
 */
class TinyAiInstance {
  /**
   * Important instance used to make event emitter.
   * @type {EventEmitter}
   */
  #events = new EventEmitter();

  /**
   * Important instance used to make system event emitter.
   * @type {EventEmitter}
   */
  #sysEvents = new EventEmitter();
  #sysEventsUsed = false;

  /**
   * Emits an event with optional arguments to all system emit.
   * @param {string | symbol} event - The name of the event to emit.
   * @param {...any} args - Arguments passed to event listeners.
   */
  #emit(event, ...args) {
    this.#events.emit(event, ...args);
    if (this.#sysEventsUsed) this.#sysEvents.emit(event, ...args);
  }

  /**
   * Provides access to a secure internal EventEmitter for subclass use only.
   *
   * This method exposes a dedicated EventEmitter instance intended specifically for subclasses
   * that extend the main class. It prevents subclasses from accidentally or intentionally using
   * the primary class's public event system (`emit`), which could lead to unpredictable behavior
   * or interference in the base class's event flow.
   *
   * For security and consistency, this method is designed to be accessed only once.
   * Multiple accesses are blocked to avoid leaks or misuse of the internal event bus.
   *
   * @returns {EventEmitter} A special internal EventEmitter instance for subclass use.
   * @throws {Error} If the method is called more than once.
   */
  getSysEvents() {
    if (this.#sysEventsUsed)
      throw new Error(
        'Access denied: getSysEvents() can only be called once. ' +
          'This restriction ensures subclass event isolation and prevents accidental interference ' +
          'with the main class event emitter.',
      );
    this.#sysEventsUsed = true;
    return this.#sysEvents;
  }

  /**
   * @typedef {(...args: any[]) => void} ListenerCallback
   * A generic callback function used for event listeners.
   */

  /**
   * Sets the maximum number of listeners for the internal event emitter.
   *
   * @param {number} max - The maximum number of listeners allowed.
   */
  setMaxListeners(max) {
    this.#events.setMaxListeners(max);
  }

  /**
   * Emits an event with optional arguments.
   * @param {string | symbol} event - The name of the event to emit.
   * @param {...any} args - Arguments passed to event listeners.
   * @returns {boolean} `true` if the event had listeners, `false` otherwise.
   */
  emit(event, ...args) {
    return this.#events.emit(event, ...args);
  }

  /**
   * Registers a listener for the specified event.
   * @param {string | symbol} event - The name of the event to listen for.
   * @param {ListenerCallback} listener - The callback function to invoke.
   * @returns {this} The current class instance (for chaining).
   */
  on(event, listener) {
    this.#events.on(event, listener);
    return this;
  }

  /**
   * Registers a one-time listener for the specified event.
   * @param {string | symbol} event - The name of the event to listen for once.
   * @param {ListenerCallback} listener - The callback function to invoke.
   * @returns {this} The current class instance (for chaining).
   */
  once(event, listener) {
    this.#events.once(event, listener);
    return this;
  }

  /**
   * Removes a listener from the specified event.
   * @param {string | symbol} event - The name of the event.
   * @param {ListenerCallback} listener - The listener to remove.
   * @returns {this} The current class instance (for chaining).
   */
  off(event, listener) {
    this.#events.off(event, listener);
    return this;
  }

  /**
   * Alias for `on`.
   * @param {string | symbol} event - The name of the event.
   * @param {ListenerCallback} listener - The callback to register.
   * @returns {this} The current class instance (for chaining).
   */
  addListener(event, listener) {
    this.#events.addListener(event, listener);
    return this;
  }

  /**
   * Alias for `off`.
   * @param {string | symbol} event - The name of the event.
   * @param {ListenerCallback} listener - The listener to remove.
   * @returns {this} The current class instance (for chaining).
   */
  removeListener(event, listener) {
    this.#events.removeListener(event, listener);
    return this;
  }

  /**
   * Removes all listeners for a specific event, or all events if no event is specified.
   * @param {string | symbol} [event] - The name of the event. If omitted, all listeners from all events will be removed.
   * @returns {this} The current class instance (for chaining).
   */
  removeAllListeners(event) {
    this.#events.removeAllListeners(event);
    return this;
  }

  /**
   * Returns the number of times the given `listener` is registered for the specified `event`.
   * If no `listener` is passed, returns how many listeners are registered for the `event`.
   * @param {string | symbol} eventName - The name of the event.
   * @param {Function} [listener] - Optional listener function to count.
   * @returns {number} Number of matching listeners.
   */
  listenerCount(eventName, listener) {
    return this.#events.listenerCount(eventName, listener);
  }

  /**
   * Adds a listener function to the **beginning** of the listeners array for the specified event.
   * The listener is called every time the event is emitted.
   * @param {string | symbol} eventName - The event name.
   * @param {ListenerCallback} listener - The callback function.
   * @returns {this} The current class instance (for chaining).
   */
  prependListener(eventName, listener) {
    this.#events.prependListener(eventName, listener);
    return this;
  }

  /**
   * Adds a **one-time** listener function to the **beginning** of the listeners array.
   * The next time the event is triggered, this listener is removed and then invoked.
   * @param {string | symbol} eventName - The event name.
   * @param {ListenerCallback} listener - The callback function.
   * @returns {this} The current class instance (for chaining).
   */
  prependOnceListener(eventName, listener) {
    this.#events.prependOnceListener(eventName, listener);
    return this;
  }

  /**
   * Returns an array of event names for which listeners are currently registered.
   * @returns {(string | symbol)[]} Array of event names.
   */
  eventNames() {
    return this.#events.eventNames();
  }

  /**
   * Gets the current maximum number of listeners allowed for any single event.
   * @returns {number} The max listener count.
   */
  getMaxListeners() {
    return this.#events.getMaxListeners();
  }

  /**
   * Returns a copy of the listeners array for the specified event.
   * @param {string | symbol} eventName - The event name.
   * @returns {Function[]} An array of listener functions.
   */
  listeners(eventName) {
    return this.#events.listeners(eventName);
  }

  /**
   * Returns a copy of the internal listeners array for the specified event,
   * including wrapper functions like those used by `.once()`.
   * @param {string | symbol} eventName - The event name.
   * @returns {Function[]} An array of raw listener functions.
   */
  rawListeners(eventName) {
    return this.#events.rawListeners(eventName);
  }

  /** @type {string|null} */ #_apiKey = null;
  /** @type {function|null} */ #_getModels = null;
  /** @type {function|null} */ #_countTokens = null;
  /** @type {function|null} */ #_genContentApi = null;
  /** @type {string|null} */ #_selectedHistory = null;
  /** @type {Record<string, function>} */ #_partTypes = {};
  /** @type {function} */ #_insertIntoHistory = () => {};
  /** @type {Record<string|number, string|{ text: string, hide?: boolean }>} */ _errorCode = {};
  /** @type {string|null} */ _nextModelsPageToken = null;

  /** @type {(AiModel|AiCategory)[]} */ models = [];
  /** @type {Object.<string, SessionData>} */ history = {};
  _isSingle = false;

  /**
   * Creates an instance of the TinyAiInstance class.
   * Initializes internal variables, sets up initial configurations for handling AI models,
   * session history, and content generation, with the option to use a single or multiple instances.
   *
   * @param {boolean} [isSingle] - If true, configures the instance to handle a single session only.
   */
  constructor(isSingle = false) {
    this._isSingle = isSingle;

    /**
     * Updates an existing entry in the session history.
     *
     * @param {string} id - The session identifier.
     * @param {Record<string, any>} data - Data fields to update within the session.
     * @returns {boolean} True if the update succeeded, false otherwise.
     */
    this.#_insertIntoHistory = function (id, data) {
      if (typeof id === 'string' && this.history[id]) {
        for (const where in data) {
          this.history[id][where] = data[where];
        }
        return true;
      }
      return false;
    };

    /**
     * Parsers for different part types.
     * @type {{ text: (input: any) => string|null, inlineData: (input: any) => { mime_type: string, data: string }|null }}
     */
    this.#_partTypes = {
      text: (/** @type {string} */ text) => (typeof text === 'string' ? text : null),
      inlineData: (/** @type {{ mime_type: string; data: string; }} */ data) => {
        if (typeof data.mime_type === 'string' && typeof data.data === 'string') return data;
        return null;
      },
    };

    // Is single instance
    if (this._isSingle) {
      this.startDataId('main', true);
      // @ts-ignore
      this.startDataId = null;
      // @ts-ignore
      this.stopDataId = null;
      // @ts-ignore
      this.selectDataId = null;
    }
  }

  /**
   * Capitalizes the first letter of the provided string.
   *
   * @param {string} str - The input string to capitalize.
   * @returns {string} The string with the first character in uppercase.
   */
  #capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Sets a custom value in the selected session history.
   *
   * @param {string} name - The name of the custom value to set.
   * @param {*} value - The value to be assigned to the custom key.
   * @param {number} [tokenAmount] - The token amount associated with the custom value (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the custom value name is invalid (not a non-empty string) or conflicts with existing data.
   * @returns {void} This method does not return a value.
   */
  setCustomValue(name, value, tokenAmount, id) {
    if (typeof name === 'string' && name.length > 0 && name !== 'customList') {
      // Prepare value to send
      const sendValue = { [name]: value };

      // This value is extremely important for the import process to identify which custom values are being used
      const selectedId = this.getId(id);
      if (selectedId && this.history[selectedId]) {
        const history = this.history[selectedId];
        if (!Array.isArray(history.customList)) history.customList = [];

        // Validate the custom value
        if (value !== null) {
          const props = history.customList.find((/** @type {*} */ item) => item.name === name);
          if (!props || typeof props.type !== 'string' || typeof props.name !== 'string') {
            if (typeof history[name] === 'undefined')
              history.customList.push({
                name,
                // @ts-ignore
                type: objType(value),
              });
            else throw new Error('This value name is already being used!');
          } else if (props.type !== objType(value))
            throw new Error(
              `Invalid custom value type! ${name}: ${props.type} === ${objType(value)}`,
            );
        }

        // Add Tokens
        if (typeof tokenAmount === 'number') this.history[selectedId].tokens[name] = tokenAmount;

        // Send custom value into the history
        if (value !== null) {
          this.#_insertIntoHistory(selectedId, sendValue);
          this.history[selectedId].hash[name] = objectHash(value);
        }

        // Complete
        this.#emit(`set${this.#capitalizeFirstLetter(name)}`, value, selectedId);
        return;
      }
    }
    throw new Error('Invalid custom value!');
  }

  /**
   * Resets a custom value in the selected session history.
   *
   * @param {string} name - The name of the custom value to reset.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the custom value name is invalid or does not match an existing entry.
   * @returns {void} This method does not return a value.
   */
  resetCustomValue(name, id) {
    if (typeof name === 'string' && name.length > 0 && name !== 'customList') {
      // Prepare value to send
      const sendValue = { [name]: null };

      // This value is extremely important for the import process to identify which custom values are being used
      const selectedId = this.getId(id);
      if (selectedId && this.history[selectedId]) {
        const history = this.history[selectedId];
        if (!Array.isArray(history.customList)) history.customList = [];

        // Validate the custom value
        const props = history.customList.find((/** @type {*} */ item) => item.name === name);
        if (
          isJsonObject(props) &&
          typeof props.type === 'string' &&
          typeof props.name === 'string'
        ) {
          // Reset Tokens
          if (typeof this.history[selectedId].tokens[name] !== 'undefined')
            delete this.history[selectedId].tokens[name];

          // Reset custom value
          this.#_insertIntoHistory(selectedId, sendValue);
          if (typeof this.history[selectedId].hash[name] !== 'undefined')
            delete this.history[selectedId].hash[name];

          // Complete
          this.#emit(`set${this.#capitalizeFirstLetter(name)}`, null, selectedId);
          return;
        }
      }
      throw new Error('Invalid custom value data type!');
    }
    throw new Error('Invalid custom value!');
  }

  /**
   * Completely removes a custom value from the selected session history.
   *
   * @param {string} name - The name of the custom value to erase.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the custom value name is invalid or does not exist.
   * @returns {void} This method does not return a value.
   */
  eraseCustomValue(name, id) {
    this.resetCustomValue(name, id);
    const history = this.getData(id);
    if (history && history.customList) {
      const index = history.customList.findIndex((item) => item.name === name);
      if (index > -1) history.customList.splice(index, 1);
      return;
    }
    throw new Error('Invalid custom value!');
  }

  /**
   * Retrieves a custom value from the selected session history.
   *
   * @param {string} name - The name of the custom value to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {*} The value associated with the specified name, or `null` if it does not exist.
   */
  getCustomValue(name, id) {
    const history = this.getData(id);
    return history && typeof history[name] !== 'undefined' && history[name] !== null
      ? history[name]
      : null;
  }

  /**
   * Retrieves the list of custom values from the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {Array<*>} An array of custom values if available, or an empty array if no custom values exist.
   */
  getCustomValueList(id) {
    const history = this.getData(id);
    return history && Array.isArray(history.customList) ? history.customList : [];
  }

  /**
   * Set the maximum output tokens setting for an AI session.
   *
   * @param {number} value - The maximum number of output tokens to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setMaxOutputTokens(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { maxOutputTokens: value });
      this.#emit('setMaxOutputTokens', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the maximum output tokens setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The maximum output tokens value, or null if not set.
   */
  getMaxOutputTokens(id) {
    const history = this.getData(id);
    return history && typeof history.maxOutputTokens === 'number' ? history.maxOutputTokens : null;
  }

  /**
   * Set the AI temperature setting for a session.
   *
   * @param {number} value - The temperature value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setTemperature(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { temperature: value });
      this.#emit('setTemperature', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the AI temperature setting for a session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The temperature value, or null if not set.
   */
  getTemperature(id) {
    const history = this.getData(id);
    return history && typeof history.temperature ? history.temperature : null;
  }

  /**
   * Set the top-p (nucleus sampling) value in an AI session.
   *
   * @param {number} value - The top-p value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setTopP(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { topP: value });
      this.#emit('setTopP', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the top-p (nucleus sampling) setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The top-p value, or null if not set.
   */
  getTopP(id) {
    const history = this.getData(id);
    return history && typeof history.topP === 'number' ? history.topP : null;
  }

  /**
   * Set the top-k setting for an AI session.
   *
   * @param {number} value - The top-k value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setTopK(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { topK: value });
      this.#emit('setTopK', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the top-k setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The top-k value, or null if not set.
   */
  getTopK(id) {
    const history = this.getData(id);
    return history && typeof history.topK === 'number' ? history.topK : null;
  }

  /**
   * Set the presence penalty setting for an AI session.
   *
   * @param {number} value - The presence penalty value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setPresencePenalty(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { presencePenalty: value });
      this.#emit('setPresencePenalty', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the presence penalty setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The presence penalty value, or null if not set.
   */
  getPresencePenalty(id) {
    const history = this.getData(id);
    return history && typeof history.presencePenalty === 'number' ? history.presencePenalty : null;
  }

  /**
   * Set the frequency penalty setting for an AI session.
   *
   * @param {number} value - The frequency penalty value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setFrequencyPenalty(value, id) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { frequencyPenalty: value });
      this.#emit('setFrequencyPenalty', value, selectedId);
      return;
    }
    throw new Error('Invalid number value!');
  }

  /**
   * Get the frequency penalty setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The frequency penalty value, or null if not set.
   */
  getFrequencyPenalty(id) {
    const history = this.getData(id);
    return history && typeof history.frequencyPenalty === 'number'
      ? history.frequencyPenalty
      : null;
  }

  /**
   * Set the setting for enabling enhanced civic answers in an AI session.
   *
   * @param {boolean} value - Whether to enable enhanced civic answers (true or false).
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setEnabledEnchancedCivicAnswers(value, id) {
    if (typeof value === 'boolean') {
      const selectedId = this.getId(id);
      this.#_insertIntoHistory(selectedId, { enableEnhancedCivicAnswers: value });
      this.#emit('setEnabledEnchancedCivicAnswers', value, selectedId);
      return;
    }
    throw new Error('Invalid boolean value!');
  }

  /**
   * Get the setting for whether enhanced civic answers are enabled in an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {boolean | null} The value indicating whether enhanced civic answers are enabled, or null if not set.
   */
  isEnabledEnchancedCivicAnswers(id) {
    const history = this.getData(id);
    return history && typeof history.enableEnhancedCivicAnswers === 'boolean'
      ? history.enableEnhancedCivicAnswers
      : null;
  }

  /**
   * Set the model for an AI session.
   *
   * @param {string} data - The model to be set (must be a string).
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setModel(data, id) {
    const model = typeof data === 'string' ? data : null;
    const selectedId = this.getId(id);
    this.#_insertIntoHistory(selectedId, { model });
    this.#emit('setModel', model, selectedId);
  }

  /**
   * Get the model for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {string | null} The model, or null if not set.
   */
  getModel(id) {
    const history = this.getData(id);
    return history && typeof history.model === 'string' ? history.model : null;
  }

  /**
   * Build content data for an AI session.
   *
   * @param {Array<*>} [contents] - An optional array to which the built content data will be pushed.
   * @param {Record<string, any>} item - The item containing content parts or a content object.
   * @param {string|null} [role] - The role to be associated with the content (optional).
   * @param {boolean} [rmFinishReason=false] - If true, removes the `finishReason` property from the content.
   * @returns {AIContentData|number} The constructed content data object, or array length if pushed to an array.
   */
  buildContents(contents, item = {}, role = null, rmFinishReason = false) {
    // Content Data
    const tinyThis = this;
    /** @type {{ finishReason: string|number|undefined, parts: any[], role: string|undefined }} */
    const contentData = { parts: [], finishReason: undefined, role: undefined };

    // Role
    if (typeof role === 'string') contentData.role = role;

    /** @param {Record<string, any>} content */
    const insertPart = (content) => {
      /** @type {Record<string, function>} */
      const tinyResult = {};
      for (const valName in content) {
        if (typeof tinyThis.#_partTypes[valName] === 'function')
          tinyResult[valName] = tinyThis.#_partTypes[valName](content[valName]);
      }
      contentData.parts.push(tinyResult);
    };

    if (Array.isArray(item.parts)) {
      for (const index in item.parts) insertPart(item.parts[index]);
    } else if (item.content) insertPart(item.content);

    if (!rmFinishReason)
      if (typeof item.finishReason === 'string' || typeof item.finishReason === 'number')
        contentData.finishReason = item.finishReason;

    // Complete
    if (Array.isArray(contents)) return contents.push(contentData);
    return contentData;
  }

  /**
   * Set the API key for the AI session.
   *
   * @param {string} apiKey - The API key to be set.
   * @returns {void} This function does not return a value.
   */
  setApiKey(apiKey) {
    this.#_apiKey = typeof apiKey === 'string' ? apiKey : null;
  }

  /**
   * Set the token for the next page of models in the AI session.
   *
   * @param {string} nextModelsPageToken - The token for the next models page.
   * @returns {void} This function does not return a value.
   */
  _setNextModelsPageToken(nextModelsPageToken) {
    this._nextModelsPageToken =
      typeof nextModelsPageToken === 'string' ? nextModelsPageToken : null;
  }

  /**
   * Set the function to retrieve models for the AI session.
   *
   * @param {Function} getModels - The function to retrieve models.
   * @returns {void} This function does not return a value.
   */
  _setGetModels(getModels) {
    this.#_getModels = typeof getModels === 'function' ? getModels : null;
  }

  /**
   * Get a list of models for the AI session.
   *
   * @param {number} [pageSize=50] - The number of models to retrieve per page. Defaults to 50.
   * @param {string|null} [pageToken=null] - The token for the next page of models, if available. Defaults to null.
   * @returns {Array<*>} The list of models retrieved.
   * @throws {Error} If no model list API function is defined.
   */
  getModels(pageSize = 50, pageToken = null) {
    if (typeof this.#_getModels === 'function')
      return this.#_getModels(this.#_apiKey, pageSize, pageToken || this._nextModelsPageToken);
    throw new Error('No model list api script defined.');
  }

  /**
   * Get the list of models for the AI session.
   *
   * @returns {(AiModel|AiCategory)[]} The list of models.
   */
  getModelsList() {
    return Array.isArray(this.models) ? this.models : [];
  }

  /**
   * Get model data from the list of models.
   *
   * @param {string} id - The model data id to search for in the models list.
   * @returns {AiModel|null} The model data if found, otherwise null.
   */
  getModelData(id) {
    // @ts-ignore
    const model = this.models.find((item) => item.id === id);
    // @ts-ignore
    if (model) return model;
    else {
      for (const index in this.models) {
        // @ts-ignore
        if (this.models[index].category) {
          // @ts-ignore
          const modelCategory = this.models[index].data.find((item) => item.id === id);
          if (modelCategory) return modelCategory;
        }
      }
    }
    return null;
  }

  /**
   * Check if a model exists in the model list.
   *
   * @param {string} id - The model id to check for in the models list.
   * @returns {boolean} True if the model exists, false otherwise.
   */
  existsModel(id) {
    return this.getModelData(id) ? true : false;
  }

  /**
   * Insert a new model into the AI session's models list.
   * If the model already exists, it will not be inserted again.
   *
   * @param {Object} model - The model to insert.
   * @param {*} model._response - The raw response.
   * @param {number} model.index - The index position.
   * @param {string} model.id - The unique identifier for the model.
   * @param {string} [model.name] - The name of the model.
   * @param {string} [model.displayName] - The display name of the model.
   * @param {string} [model.version] - The version of the model.
   * @param {string} [model.description] - A description of the model.
   * @param {number} [model.inputTokenLimit] - The input token limit for the model.
   * @param {number} [model.outputTokenLimit] - The output token limit for the model.
   * @param {number} [model.temperature] - The temperature setting for the model.
   * @param {number} [model.maxTemperature] - The maximum temperature setting for the model.
   * @param {number} [model.topP] - The top P setting for the model.
   * @param {number} [model.topK] - The top K setting for the model.
   * @param {Array<string>} [model.supportedGenerationMethods] - The generation methods supported by the model.
   * @param {Object} [model.category] - The category of the model.
   * @param {string} model.category.id - The unique identifier for the category.
   * @param {string} model.category.displayName - The display name of the category.
   * @param {number} model.category.index - The index of the category.
   * @returns {Record<string, any>|null} The inserted model data, or null if the model already exists.
   */
  _insertNewModel(model) {
    if (!isJsonObject(model)) throw new Error('Model data must be a valid object.');
    // @ts-ignore
    if (this.models.findIndex((item) => item.id === model.id) < 0) {
      /** @type {AiModel} */
      const newData = {
        _response: model._response,
        index: typeof model.index === 'number' ? model.index : 9999999,
        name: typeof model.name === 'string' ? model.name : null,
        id: typeof model.id === 'string' ? model.id : null,
        displayName: typeof model.displayName === 'string' ? model.displayName : null,
        version: typeof model.version === 'string' ? model.version : null,
        description: typeof model.description === 'string' ? model.description : null,
        inputTokenLimit: typeof model.inputTokenLimit === 'number' ? model.inputTokenLimit : null,
        outputTokenLimit:
          typeof model.outputTokenLimit === 'number' ? model.outputTokenLimit : null,
        temperature: typeof model.temperature === 'number' ? model.temperature : null,
        maxTemperature: typeof model.maxTemperature === 'number' ? model.maxTemperature : null,
        topP: typeof model.topP === 'number' ? model.topP : null,
        topK: typeof model.topK === 'number' ? model.topK : null,
      };

      // Supported generation methods
      if (Array.isArray(model.supportedGenerationMethods)) {
        newData.supportedGenerationMethods = [];
        for (const index in model.supportedGenerationMethods) {
          if (typeof model.supportedGenerationMethods[index] === 'string')
            newData.supportedGenerationMethods.push(model.supportedGenerationMethods[index]);
        }
      }

      // Is category
      if (
        model.category &&
        typeof model.category.id === 'string' &&
        typeof model.category.displayName === 'string' &&
        typeof model.category.index === 'number'
      ) {
        // Check category
        /** @type {AiCategory|null} */
        // @ts-ignore
        let category = this.models.find((item) => item.category === model.category.id);
        // Insert new category
        if (!category) {
          category = {
            category: model.category.id,
            displayName: model.category.displayName,
            index: model.category.index,
            data: [],
          };
          this.models.push(category);
        }

        // Compare function that sorts objects by their `index` property.
        category.data.push(newData);
        category.data.sort(
          /** @param {{ index: number, [key: string]: any }} a @param {{ index: number, [key: string]: any }} b */
          (a, b) => a.index - b.index,
        );
      }

      // Normal mode
      else this.models.push(newData);

      // Sort data
      this.models.sort((a, b) => a.index - b.index);
      return newData;
    }
    return null;
  }

  /**
   * Sets a function to handle the count of tokens in the AI session.
   * If a valid function is provided, it will be used to count tokens.
   *
   * @param {Function} countTokens - The function that will handle the token count.
   * @throws {Error} Throws an error if the provided value is not a function.
   * @returns {void}
   */
  _setCountTokens(countTokens) {
    this.#_countTokens = typeof countTokens === 'function' ? countTokens : null;
  }

  /**
   * Counts the tokens based on the provided data and model, using a defined token counting function.
   * If the function to count tokens is not set, an error is thrown.
   *
   * @param {Record<string, any>} data - The data that needs to be tokenized.
   * @param {string} [model] - The model to use for counting tokens. If not provided, the default model is used.
   * @param {AbortController} [controller] - The controller that manages the process or settings for counting tokens.
   * @throws {Error} Throws an error if no token counting function is defined.
   * @returns {Record<string, any>} The count of tokens.
   */
  countTokens(data, model, controller) {
    if (typeof this.#_countTokens === 'function')
      return this.#_countTokens(this.#_apiKey, model || this.getModel(), controller, data);
    throw new Error('No count token api script defined.');
  }

  /**
   * @typedef {{ text: string, hide?: boolean }} ErrorCode
   */

  /**
   * Sets the error codes for the current session.
   *
   * @param {Record<string|number, string|ErrorCode>} errors - The error codes to set, typically an object containing error code definitions.
   * @returns {void}
   */
  _setErrorCodes(errors) {
    this._errorCode = errors;
  }

  /**
   * Get error details based on the provided error code.
   *
   * @param {string|number} code - The error code to look up.
   * @returns {ErrorCode|null} An object containing the error message, or null if no error is found.
   */
  getErrorCode(code) {
    if (this._errorCode) {
      const errData = this._errorCode[code];
      if (errData) {
        if (typeof errData === 'string') return { text: errData };
        else if (isJsonObject(errData) && typeof errData.text === 'string') return errData;
      }
    }
    return null;
  }

  /**
   * Sets the content generation callback function for the AI session.
   *
   * @param {Function} callback - The callback function that handles content generation.
   * @returns {void}
   */
  _setGenContent(callback) {
    this.#_genContentApi = typeof callback === 'function' ? callback : null;
  }

  /**
   * Generates content for the AI session.
   *
   * @param {Record<string, any>} data - The data for content generation.
   * @param {string} [model] - The model to be used for content generation. If not provided, the default model is used.
   * @param {AbortController} [controller] - The controller managing the content generation process.
   * @param {Function} [streamCallback] - The callback function for streaming content (optional).
   * @returns {Record<string, any>} The generated content returned by the API.
   * @throws {Error} If no content generator API script is defined.
   */
  genContent(data, model, controller, streamCallback) {
    if (typeof this.#_genContentApi === 'function')
      return this.#_genContentApi(
        this.#_apiKey,
        typeof streamCallback === 'function' ? true : false,
        data,
        model || this.getModel(),
        streamCallback,
        controller,
      );
    throw new Error('No content generator api script defined.');
  }

  /**
   * Select a session history ID to set as the active session.
   * If `null` is passed, it deselects the current session ID.
   *
   * @param {string|null} id - The session history ID to select, or `null` to deselect the current session.
   * @returns {boolean} `true` if the session ID was successfully selected or deselected, `false` if the ID does not exist in history.
   */
  selectDataId(id) {
    if (id !== null) {
      if (this.history[id]) {
        this.#_selectedHistory = id;
        this.#emit('selectDataId', id);
        return true;
      }
      return false;
    }
    this.#_selectedHistory = null;
    this.#emit('selectDataId', null);
    return true;
  }

  /**
   * Get the currently selected session history ID.
   * If no ID is provided, it returns the default selected session history ID.
   *
   * @param {string} [id] - The session history ID to retrieve. If not provided, it uses the default selected ID.
   * @returns {string|null} The selected session history ID, or `null` if no history ID is selected.
   */
  getId(id) {
    const result = id && !this._isSingle ? id : this.#_selectedHistory;
    if (typeof result === 'string') return result;
    return null;
  }

  /**
   * Resets all stored data associated with a given session.
   *
   * This method resolves the target session ID (either the one provided or the
   * currently selected session) and removes all indexed items from its history.
   *
   * **Return codes:**
   * - `0`: No valid session was found; nothing was reset.
   * - `1`: A valid session was found but had no items to delete.
   * - `2`: Items were successfully deleted during the reset process.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session ID will be used.
   * @returns {number} A status code indicating the reset result.
   */
  resetContentData(id) {
    let result = 0;
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      result = 1;
      const data = this.history[selectedId];
      while (data.ids.length > 0) {
        result = 2;
        this.deleteIndex(0);
      }
    }
    return result;
  }

  /**
   * Get the data associated with a specific session history ID.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {SessionData|null} The data associated with the session ID, or `null` if no data exists for that ID.
   */
  getData(id) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) return this.history[selectedId];
    return null;
  }

  /**
   * Calculates the total number of tokens used for messages in the session history.
   *
   * This method iterates over the `tokens` array in the session history and sums the `count` of tokens
   * from each message, returning the total sum. If no valid session history is found or if token data is
   * missing, it will return `null`.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number|null} The total number of tokens used in the session history, or `null` if no data is available.
   */
  getTotalTokens(id) {
    const history = this.getData(id);
    if (history) {
      let result = 0;
      for (const msgIndex in history.tokens.data) {
        if (typeof history.tokens.data[msgIndex].count === 'number')
          result += history.tokens.data[msgIndex].count;
      }
      for (const item in history.tokens) {
        if (typeof history.tokens[item] === 'number') {
          result += history.tokens[item];
        }
      }
      return result;
    }
    return null;
  }

  /**
   * Retrieves the token data for a specific message in the session history by its index.
   *
   * **Note**: This method does not manage the token count automatically. It assumes that token data has been added
   * to the history using the `addData` method.
   *
   * @param {number} msgIndex - The index of the message in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {TokenCount|null} The token data associated with the message at the specified index, or `null` if the data is not found.
   */
  getMsgTokensByIndex(msgIndex, id) {
    const history = this.getData(id);
    if (history) {
      const existsIndex = this.indexExists(msgIndex, id);
      if (existsIndex) return history.tokens.data[msgIndex];
    }
    return null;
  }

  /**
   * Retrieves the token data for a specific message in the session history by its message ID.
   *
   * **Note**: This method does not manage the token count automatically. It assumes that token data has been added
   * to the history using the `addData` method.
   *
   * @param {number} msgId - The unique ID of the message in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {TokenCount|null} The token data associated with the message with the given ID, or `null` if the message is not found.
   */
  getMsgTokensById(msgId, id) {
    const history = this.getData(id);
    if (history) {
      const msgIndex = this.getIndexOfId(msgId);
      if (msgIndex > -1) return history.tokens.data[msgIndex];
    }
    return null;
  }

  /**
   * Retrieves the hash of a message at a specified index in the selected session history.
   *
   * @param {number} msgIndex - The index of the message whose hash is being retrieved.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The hash value of the message at the specified index, or null if the index is invalid or does not exist.
   */
  getMsgHashByIndex(msgIndex, id) {
    const history = this.getData(id);
    if (history) {
      const existsIndex = this.indexExists(msgIndex, id);
      if (existsIndex) return history.hash.data[msgIndex];
    }
    return null;
  }

  /**
   * Retrieves the hash of a message based on its ID from the selected session history.
   *
   * @param {number} msgId - The ID of the message whose hash is being retrieved.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The hash value of the message with the specified ID, or null if the message ID is invalid or does not exist.
   */
  getMsgHashById(msgId, id) {
    const history = this.getData(id);
    if (history) {
      const msgIndex = this.getIndexOfId(msgId);
      if (msgIndex > -1) return history.hash.data[msgIndex];
    }
    return null;
  }

  /**
   * Checks if a specific index exists in the session history.
   *
   * **Note**: This method assumes that the history data is available and that the `getMsgByIndex` method is used
   * to retrieve the index. If the `getMsgByIndex` method returns a valid index, this method will return `true`.
   *
   * @param {number} index - The index to check for existence in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the index exists, otherwise `false`.
   */
  indexExists(index, id) {
    return this.getMsgByIndex(index, id) ? true : false;
  }

  /**
   * Retrieve a specific data entry by its index from the session history.
   *
   * @param {number} index - The index of the data entry to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData|null} The data entry at the specified index, or `null` if the index is out of bounds or no data exists for the given session ID.
   */
  getMsgByIndex(index, id) {
    const history = this.getData(id);
    if (history && history.data[index]) return history.data[index];
    return null;
  }

  /**
   * Retrieves a specific message by its ID from the session history.
   *
   * @param {number} msgId - The ID of the message to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData|null} The message data associated with the given ID, or `null` if the message ID is invalid or does not exist.
   */
  getMsgById(msgId, id) {
    const history = this.getData(id);
    if (history) {
      const index = this.getIndexOfId(msgId);
      if (history.data[index]) return history.data[index];
    }
    return null;
  }

  /**
   * Retrieve the index of a specific message ID in the session history.
   *
   * @param {number} msgId - The message ID to search for.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The index of the message ID in the session history, or `-1` if not found.
   */
  getIndexOfId(msgId, id) {
    const history = this.getData(id);
    if (history) return history.ids.indexOf(msgId);
    return -1;
  }

  /**
   * Retrieve the message ID at a specific index in the session history.
   *
   * @param {number} index - The index of the data to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|number} The message ID at the specified index, or `-1` if the index is out of bounds or not found.
   */
  getIdByIndex(index, id) {
    const history = this.getData(id);
    if (history) return history.data[index] ? history.ids[index] : -1;
    return -1;
  }

  /**
   * Delete a specific entry from the session history at the given index.
   *
   * @param {number} index - The index of the entry to delete.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the entry was successfully deleted, `false` if the index is invalid or the entry does not exist.
   */
  deleteIndex(index, id) {
    const history = this.getData(id);
    if (history && history.data[index]) {
      const msgId = this.getIdByIndex(index);
      history.data.splice(index, 1);
      history.ids.splice(index, 1);
      history.hash.data.splice(index, 1);
      history.tokens.data.splice(index, 1);
      this.#emit('deleteIndex', index, msgId, this.getId(id));
      return true;
    }
    return false;
  }

  /**
   * Replaces an entry at the specified index in the session history with new data.
   *
   * @param {number} index - The index of the entry to replace.
   * @param {AIContentData} [data] - The new data to replace the existing entry (optional).
   * @param {TokenCount} [tokens] - The token count associated with the new entry (optional).
   * @param {string} [id] - The session ID (optional). If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the entry was successfully replaced, `false` if the index is invalid or the entry does not exist.
   */
  replaceIndex(index, data, tokens, id) {
    const history = this.getData(id);
    if (history && history.data[index] && (data || tokens)) {
      let hash = null;
      if (data) {
        hash = objectHash(data);
        history.data[index] = data;
        history.hash.data[index] = hash;
      }

      if (tokens) history.tokens.data[index] = tokens;
      this.#emit('replaceIndex', index, data, tokens, hash, this.getId(id));
      return true;
    }
    return false;
  }

  /**
   * Retrieve the index of the last entry in the session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The index of the last entry in the session history, or `-1` if the history is empty or invalid.
   */
  getLastIndex(id) {
    const history = this.getData(id);
    if (history && history.data[history.data.length - 1]) return history.data.length - 1;
    return -1;
  }

  /**
   * Retrieve the data of the last entry in the session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData|null} The data of the last entry in the session history, or `null` if the history is empty or invalid.
   */
  getLastIndexData(id) {
    const history = this.getData(id);
    if (history && history.data[history.data.length - 1])
      return history.data[history.data.length - 1];
    return null;
  }

  /**
   * Check if the session history has at least one entry.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the session history has at least one entry, `false` otherwise.
   */
  existsFirstIndex(id) {
    const history = this.getData(id);
    if (history && history.data[0]) return true;
    return false;
  }

  /**
   * Retrieve the first entry in the session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData|null} The first entry of the session history, or `null` if no entry exists.
   */
  getFirstIndexData(id) {
    const history = this.getData(id);
    if (history && history.data[0]) return history.data[0];
    return null;
  }

  /**
   * Adds new data to the selected session history.
   * If no session ID is provided, the currently selected session history ID will be used.
   *
   * **Note**: The `tokenData` parameter is optional and can be used to track token-related data associated with the new entry.
   * This may include token counts, but this script does not manage token counting automatically. Developers must implement token management separately if necessary.
   *
   * @param {AIContentData} data - The data to be added to the session history.
   * @param {TokenCount} [tokenData={count: null}] - Optional token-related data to be associated with the new entry. Defaults to `{count: null}`.
   * @param {string} [id] - The session history ID. If omitted, the currently selected session ID will be used.
   * @returns {number} The new ID of the added data entry.
   * @throws {Error} If the provided session ID is invalid or the session ID does not exist in history.
   */
  addData(data, tokenData = { count: null }, id = undefined) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      if (typeof this.history[selectedId].nextId !== 'number') this.history[selectedId].nextId = 0;
      const newId = this.history[selectedId].nextId;
      this.history[selectedId].nextId++;
      const hash = objectHash(data);

      const tokenContent = isJsonObject(tokenData)
        ? tokenData
        : { count: typeof tokenData === 'number' ? tokenData : null };

      this.history[selectedId].data.push(data);
      this.history[selectedId].tokens.data.push(tokenContent);
      this.history[selectedId].ids.push(newId);
      this.history[selectedId].hash.data.push(hash);

      this.#emit('addData', newId, data, tokenContent, hash, selectedId);
      return newId;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Sets a prompt for the selected session history.
   *
   * @param {string} [promptData] - The prompt to be set for the session.
   * @param {number} [tokenAmount] - The number of tokens associated with the prompt (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the provided session ID is invalid or the prompt data is not a string.
   */
  setPrompt(promptData, tokenAmount, id) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      if (typeof promptData === 'string') {
        const hash = objectHash(promptData);
        this.history[selectedId].prompt = promptData;
        this.history[selectedId].hash.prompt = hash;
      }

      if (typeof tokenAmount === 'number') this.history[selectedId].tokens.prompt = tokenAmount;
      this.#emit('setPrompt', promptData, selectedId);
      return;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Retrieves the prompt of the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The prompt for the session if available, otherwise null.
   */
  getPrompt(id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      typeof this.history[selectedId].prompt === 'string' &&
      this.history[selectedId].prompt.length > 0
    ) {
      return this.history[selectedId].prompt;
    }
    return null;
  }

  /**
   * Sets the first dialogue for the selected session history.
   *
   * @param {string} [dialogue] - The dialogue to set as the first dialogue.
   * @param {number} [tokenAmount] - The number of tokens associated with the dialogue (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} Throws an error if the session ID is invalid or the dialogue is not a string.
   * @returns {void}
   */
  setFirstDialogue(dialogue, tokenAmount, id) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      if (typeof dialogue === 'string') {
        const hash = objectHash(dialogue);
        this.history[selectedId].firstDialogue = dialogue;
        this.history[selectedId].hash.firstDialogue = hash;
      }

      if (typeof tokenAmount === 'number')
        this.history[selectedId].tokens.firstDialogue = tokenAmount;
      this.#emit('setFirstDialogue', dialogue, selectedId);
      return;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Retrieves the first dialogue from the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The first dialogue if it exists and is a non-empty string, or null if no first dialogue is set.
   */
  getFirstDialogue(id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      typeof this.history[selectedId].firstDialogue === 'string' &&
      this.history[selectedId].firstDialogue.length > 0
    ) {
      return this.history[selectedId].firstDialogue;
    }
    return null;
  }

  /**
   * Sets file data for the selected session history.
   *
   * @param {string} [mime] - The MIME type of the file (e.g., 'text/plain', 'application/pdf') (optional).
   * @param {string} [data] - The file content, either as a string or base64-encoded (optional).
   * @param {boolean} [isBase64=false] - A flag indicating whether the `data` is already base64-encoded. Defaults to false.
   * @param {number} [tokenAmount] - The token count associated with the file data (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the session ID is invalid or data/mime is not a string.
   * @returns {void}
   */
  setFileData(mime, data, isBase64 = false, tokenAmount = undefined, id = undefined) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      let hash;
      if (typeof data === 'string' && typeof mime === 'string') {
        this.history[selectedId].file = {
          mime,
          data,
          base64: !isBase64 ? encodeBase64(data) : data,
        };
        hash = objectHash(this.history[selectedId].file);
        this.history[selectedId].hash.file = hash;
      }

      if (typeof tokenAmount === 'number') this.history[selectedId].tokens.file = tokenAmount;
      this.#emit('setFileData', this.history[selectedId].file, hash, selectedId);
      return;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Removes file data from the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the session history ID is invalid.
   * @returns {void} This method does not return a value.
   */
  removeFileData(id) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      delete this.history[selectedId].file;
      delete this.history[selectedId].hash.file;
      delete this.history[selectedId].tokens.file;
      this.#emit('setFileData', null, null, selectedId);
      return;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Retrieves file data from the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {{data: string, mime: string}|null} The file data, including MIME type and encoded content, or null if no file data is found.
   * @throws {Error} If no valid session history ID is found.
   */
  getFileData(id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      this.history[selectedId].file &&
      typeof this.history[selectedId].file.data === 'string' &&
      typeof this.history[selectedId].file.mime === 'string'
    ) {
      return this.history[selectedId].file;
    }
    return null;
  }

  /**
   * Sets a system instruction for the selected session history.
   *
   * @param {string} [data] - The system instruction to set.
   * @param {number} [tokenAmount] - The token count associated with the system instruction (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the session history ID is invalid or the provided data is not a string.
   * @returns {void}
   */
  setSystemInstruction(data, tokenAmount, id) {
    const selectedId = this.getId(id);
    if (selectedId && this.history[selectedId]) {
      if (typeof data === 'string') {
        const hash = objectHash(data);
        this.history[selectedId].systemInstruction = data;
        this.history[selectedId].hash.systemInstruction = hash;
      }

      if (typeof tokenAmount === 'number')
        this.history[selectedId].tokens.systemInstruction = tokenAmount;
      this.#emit('setSystemInstruction', data, selectedId);
      return;
    }
    throw new Error('Invalid history id data!');
  }

  /**
   * Retrieves the system instruction for the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The system instruction for the selected session, or `null` if no instruction is set.
   */
  getSystemInstruction(id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      typeof this.history[selectedId].systemInstruction === 'string'
    ) {
      return this.history[selectedId].systemInstruction;
    }
    return null;
  }

  /**
   * Retrieves the token count for a specific category within the selected session history.
   *
   * @param {string} where - The category from which to retrieve the token count (e.g., 'prompt', 'file', 'systemInstruction').
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number|null} The token count if available, otherwise null.
   */
  getTokens(where, id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      typeof this.history[selectedId].tokens[where] === 'number'
    )
      return this.history[selectedId].tokens[where];
    return null;
  }

  /**
   * Retrieves the hash value for a specific item in the selected session history.
   *
   * @param {string} where - The key representing the item whose hash value is being retrieved (e.g., 'prompt', 'file', 'systemInstruction').
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The hash value of the specified item, or null if the item does not exist.
   */
  getHash(where, id) {
    const selectedId = this.getId(id);
    if (
      selectedId &&
      this.history[selectedId] &&
      typeof this.history[selectedId].hash[where] === 'string'
    )
      return this.history[selectedId].hash[where];
    return null;
  }

  /**
   * Starts a new data session with the given session ID.
   *
   * @param {string} id - The session ID for the new data session.
   * @param {boolean} [selected=false] - A flag to indicate whether this session should be selected as the active session.
   * @returns {SessionData} The newly created session data, which includes an empty data array, an empty IDs array, and null values for system instruction and model.
   */
  startDataId(id, selected = false) {
    this.history[id] = {
      data: [],
      ids: [],
      tokens: { data: [] },
      hash: { data: [] },
      systemInstruction: null,
      model: null,
    };
    if (selected) this.selectDataId(id);
    this.#emit('startDataId', this.history[id], id, selected ? true : false);
    return this.history[id];
  }

  /**
   * Stop the data session associated with the provided ID.
   * This will remove the session data from history and reset the selected session ID if necessary.
   *
   * @param {string} id - The session history ID to stop and remove from history.
   * @returns {boolean} `true` if the session ID was found and successfully stopped, `false` otherwise.
   */
  stopDataId(id) {
    if (this.history[id]) {
      delete this.history[id];
      if (this.getId() === id) this.selectDataId(null);
      this.#emit('stopDataId', id);
      return true;
    }
    return false;
  }

  /**
   * Destroys the instance by clearing history and removing all event listeners.
   *
   * This method resets the internal `history` object, effectively discarding any stored
   * data or state associated with the instance's operations. It also removes all listeners
   * from both `#events` and `#sysEvents` to ensure no further event handling occurs and to
   * prevent memory leaks.
   *
   * This method should be called when the instance is no longer needed.
   *
   * @returns {void}
   */
  destroy() {
    this.history = {};
    this.#events.removeAllListeners();
    this.#sysEvents.removeAllListeners();
  }
}

export default TinyAiInstance;
