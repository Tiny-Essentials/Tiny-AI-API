import objHash from 'object-hash';
import { EventEmitter } from 'events';
import { encode as encodeBase64 } from 'js-base64';
import { isJsonObject, objType } from './tiny-modules/basics/objFilter.mjs';

/**
 * @typedef {Object} CustomValueDefinition
 * @property {string} name - The name of the custom value.
 * @property {string} type - The expected data type for the custom value.
 * Defines the name and expected data type for a custom value.
 */

/**
 * @typedef {Object} CustomValue
 * @property {string} name - The name of the custom value.
 * @property {*} value - The actual value of the custom value.
 * Represents an active custom value assigned within the session.
 */

/**
 * @typedef {Record<string, any>} HistoryUpdateData
 * The data fields to update within the session history dynamically.
 */

/**
 * @typedef {Object} SessionDataContent
 * @property {AIContentData[]} data - Array of content data entries in the session.
 * @property {number[]} ids - Array of unique IDs corresponding to the content data.
 * @property {{ data: Array<TokenCount>; [key: string]: any }} tokens - Token usage data categorized by message/field.
 * @property {{ data: Array<string>; [key: string]: any }} hash - Hash values for content data entries.
 * @property {string|null} systemInstruction - The system instruction guiding the AI's behavior.
 * @property {CustomValueDefinition[]} [customList] - List of custom values and their types.
 * @property {string|null} model - The currently selected AI model.
 * @property {string|string[]|null} stop - Stop sequences for generation.
 * @property {number|null} repeatPenalty - Penalty applied to repeated tokens.
 * @property {Record<string, number>|null} logitBias - Logit bias applied to specific tokens.
 * Core content structure holding all context for an active AI session.
 */

/**
 * @typedef {Record<string, any> & SessionDataContent} SessionData
 * Represents the complete session data, combining base content and dynamic fields.
 */

/**
 * @typedef {Object} AIContentTextInput
 * @property {'text'} type - The type of input.
 * @property {string} text - The raw text content.
 * Represents a text input structure for AI content.
 */

/**
 * @typedef {Object} AIContentImageInput
 * @property {'image_url'} type - The type of input.
 * @property {Object} image_url - The object containing image data.
 * @property {string} [image_url.url] - The data URI or URL of the image.
 * @property {string} [image_url.data] - The raw base64 data of the image.
 * Represents an image input structure for AI content.
 */

/**
 * @typedef {string|[AIContentTextInput,...AIContentImageInput[]]} AIContentInput
 * Represents the valid input types for AI content, which can be a string or a mix of text and image objects.
 */

/**
 * @typedef {Object} AIToolCall
 * @property {string} id - Unique ID for the tool call.
 * @property {string} type - The type of the tool call (e.g., 'function', 'custom_tool_call', 'tool_search_call').
 * @property {string} [call_id] - A specific reference call identifier for handling results.
 * @property {string} [name] - The name of the tool called.
 * @property {Object} [function] - Details about the standard function to be called.
 * @property {string} function.name - The target function name.
 * @property {string} function.arguments - Stringified JSON arguments for the function.
 * @property {string} [input] - Plain text input generated for custom tools.
 * @property {string} [status] - The execution status, primarily used for custom or deferred tool calls.
 * Represents a specific tool execution request made by the AI model.
 */

/**
 * @typedef {Object} AIContentData
 * @property {AIContentInput} [content] - The input content (text or image).
 * @property {string} role - The role of the message ('user', 'assistant', 'system', 'tool').
 * @property {string|number} [finishReason] - The reason the generation stopped.
 * @property {AIToolCall[]} [tool_calls] - Array of tool calls requested by the model.
 * @property {string} [tool_call_id] - The ID of a specific tool call (used when role is 'tool' for function outputs).
 * @property {string} [name] - The name of the content/message or function.
 * The standardized object format representing a single interaction or message in the AI session.
 */

/**
 * @typedef {Object} TokenCount
 * @property {number|null} count - The amount of tokens.
 * @property {boolean} [hide] - Whether this token count is hidden or ignored in global totals.
 * Represents the token counting details for a specific content entry.
 */

/**
 * Tiny AI Server Communication API (OpenAI Standard)
 * -----------------------------
 * This class manages AI session data natively using the OpenAI API structure.
 * It uses 'role', 'content', and supports 'tools'/'tool_calls' making it perfect
 * for local models via LM Studio, vLLM, or the official OpenAI API.
 *
 * **Note**: This script does not automatically track token count natively since
 * standard OpenAI-compatible APIs often lack a dedicated token-counting endpoint.
 */
class TinyAiInstance2 extends EventEmitter {
  /** @type {string|null} */ #_selectedHistory = null;

  /** @type {Object.<string, SessionData>} */ history = {};
  _isSingle = false;

  /**
   * Sets file data natively formatted for OpenAI Vision APIs.
   * Converts plain data into an image URI structure.
   *
   * @param {string} mime - The MIME type of the file (e.g., 'image/jpeg').
   * @param {string} data - The file content (base64 or string).
   * @param {boolean} [isBase64=false] - Whether data is already base64 encoded.
   * @returns {AIContentImageInput} The formatted image input object.
   */
  static imageToBase64(mime, data, isBase64 = false) {
    if (typeof mime !== 'string' || typeof data !== 'string')
      throw new TypeError('Invalid input! Mime and data must be strings.');
    return {
      type: 'image_url',
      image_url: {
        url: `data:${mime};base64,${!isBase64 ? encodeBase64(data) : data}`,
      },
    };
  }

  /**
   * Creates an instance of the TinyAiInstance2 class.
   *
   * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
   */
  constructor(isSingle = false) {
    super();
    this._isSingle = isSingle;

    // Is single instance
    if (this._isSingle) {
      this.startDataId('main', true);
      this.startDataId = () => {
        throw new Error('startDataId disabled in single instance mode!');
      };
      this.stopDataId = () => {
        throw new Error('stopDataId disabled in single instance mode!');
      };
      this.selectDataId = () => {
        throw new Error('selectDataId disabled in single instance mode!');
      };
    }
  }

  /**
   * Updates an existing entry in the session history.
   * @param {string|null} id - The session identifier.
   * @param {HistoryUpdateData} data - Data fields to update within the session.
   * @returns {boolean} True if the update succeeded, false otherwise.
   */
  #_insertIntoHistory(id, data) {
    if (typeof id === 'string' && this.history[id]) {
      for (const where in data) {
        this.history[id][where] = data[where];
      }
      return true;
    }
    return false;
  }

  /**
   * Capitalizes the first letter of the provided string.
   * @param {string} str - The input string to capitalize.
   * @returns {string} The string with the first character in uppercase.
   */
  #capitalizeFirstLetter(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Sets a custom value in the selected session history.
   *
   * @param {string} name - The name of the custom value to set.
   * @param {*} value - The value to be assigned to the custom key.
   * @param {number} [tokenAmount] - The token amount associated with the custom value (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the custom value name is invalid or conflicts with existing data.
   */
  setCustomValue(name, value, tokenAmount, id) {
    if (typeof name !== 'string' || name.length === 0 || name === 'customList')
      throw new TypeError('Invalid custom value name!');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount! Must be a number.');

    // This value is extremely important for the import process to identify which custom values are being used
    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    const history = this.history[selectedId];
    if (!Array.isArray(history.customList)) history.customList = [];

    // Validate the custom value
    if (value !== null) {
      const props = history.customList.find((item) => item.name === name);
      if (!props || typeof props.type !== 'string' || typeof props.name !== 'string') {
        if (typeof history[name] === 'undefined') {
          history.customList.push({ name, type: objType(value)?.toString() ?? '' });
        } else throw new Error('This value name is already being used!');
      } else if (props.type !== objType(value))
        throw new Error(`Invalid custom value type! Expected ${props.type}, got ${objType(value)}`);
    }

    // Add Tokens
    if (typeof tokenAmount === 'number') this.history[selectedId].tokens[name] = tokenAmount;

    // Send custom value into the history
    if (value !== null) {
      this.#_insertIntoHistory(selectedId, { [name]: value });
      this.history[selectedId].hash[name] = objHash(value);
    }

    // Complete
    this.emit(`set${this.#capitalizeFirstLetter(name)}`, value, selectedId);
  }

  /**
   * Resets a custom value in the selected session history.
   *
   * @param {string} name - The name of the custom value to reset.
   * @param {string} [id] - The session ID.
   * @throws {Error} If the custom value name is invalid or does not match an existing entry.
   */
  resetCustomValue(name, id) {
    if (typeof name !== 'string' || name.length === 0 || name === 'customList')
      throw new TypeError('Invalid custom value name!');

    // This value is extremely important for the import process to identify which custom values are being used
    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    const history = this.history[selectedId];
    if (!Array.isArray(history.customList)) history.customList = [];

    // Validate the custom value
    const props = history.customList.find((item) => item.name === name);
    if (!isJsonObject(props) || typeof props.type !== 'string' || typeof props.name !== 'string')
      throw new TypeError('Invalid custom value data type or custom value not found!');

    // Reset Tokens
    if (typeof this.history[selectedId].tokens[name] !== 'undefined')
      delete this.history[selectedId].tokens[name];

    // Reset custom value
    this.#_insertIntoHistory(selectedId, { [name]: null });
    if (typeof this.history[selectedId].hash[name] !== 'undefined')
      delete this.history[selectedId].hash[name];

    // Complete
    this.emit(`set${this.#capitalizeFirstLetter(name)}`, null, selectedId);
  }

  /**
   * Completely removes a custom value from the selected session history.
   *
   * @param {string} name - The name of the custom value to erase.
   * @param {string} [id] - The session ID.
   * @throws {Error} If the custom value name is invalid or does not exist.
   */
  eraseCustomValue(name, id) {
    this.resetCustomValue(name, id);
    const history = this.getData(id);
    if (history && history.customList) {
      const index = history.customList.findIndex((item) => item.name === name);
      if (index > -1) history.customList.splice(index, 1);
      return;
    }
    throw new Error('Failed to erase custom value: History not found!');
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
   * @returns {CustomValueDefinition[]} An array of custom value definitions if available, or an empty array if no custom values exist.
   */
  getCustomValueList(id) {
    const history = this.getData(id);
    return history && Array.isArray(history.customList) ? history.customList : [];
  }

  /**
   * Set the AI temperature setting for a session.
   *
   * @param {number} value - The temperature value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setTemperature(value, id) {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value))
      throw new TypeError('Invalid temperature value! Must be a valid finite number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { temperature: value });
    this.emit('setTemperature', value, selectedId);
  }

  /**
   * Get the AI temperature setting for a session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The temperature value, or null if not set.
   */
  getTemperature(id) {
    const history = this.getData(id);
    return history && typeof history.temperature === 'number' ? history.temperature : null;
  }

  /**
   * Set the top-p (nucleus sampling) value in an AI session.
   *
   * @param {number} value - The top-p value to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setTopP(value, id) {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value))
      throw new TypeError('Invalid topP value! Must be a valid finite number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { topP: value });
    this.emit('setTopP', value, selectedId);
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
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value))
      throw new TypeError('Invalid topK value! Must be a valid finite number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { topK: value });
    this.emit('setTopK', value, selectedId);
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
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value))
      throw new TypeError('Invalid presencePenalty value! Must be a valid finite number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { presencePenalty: value });
    this.emit('setPresencePenalty', value, selectedId);
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
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value))
      throw new TypeError('Invalid frequencyPenalty value! Must be a valid finite number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { frequencyPenalty: value });
    this.emit('setFrequencyPenalty', value, selectedId);
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
   * Set the stop sequences for the AI session.
   *
   * @param {string|string[]|null} value - The stop sequence(s) to be used.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setStop(value, id) {
    if (typeof value !== 'string' && !Array.isArray(value) && value !== null)
      throw new TypeError('Invalid stop value. Must be a string, array, or null!');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { stop: value });
    this.emit('setStop', value, selectedId);
  }

  /**
   * Get the stop sequences for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {string|string[]|null} The stop sequence(s), or null if not set.
   */
  getStop(id) {
    const history = this.getData(id);
    return history && typeof history.stop !== 'undefined' ? history.stop : null;
  }

  /**
   * Set the logit bias for the AI session.
   *
   * @param {Record<string, number>|null} value - The logit bias object.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setLogitBias(value, id) {
    if (!isJsonObject(value) && value !== null)
      throw new TypeError('Invalid logitBias value. Must be a JSON object or null!');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { logitBias: value });
    this.emit('setLogitBias', value, selectedId);
  }

  /**
   * Get the logit bias for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {Record<string, number>|null} The logit bias object, or null if not set.
   */
  getLogitBias(id) {
    const history = this.getData(id);
    return history && isJsonObject(history.logitBias) ? history.logitBias : null;
  }

  /**
   * Set the repeat penalty for an AI session.
   *
   * @param {number|null} value - The repeat penalty value.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setRepeatPenalty(value, id) {
    if ((typeof value !== 'number' || Number.isNaN(value)) && value !== null)
      throw new TypeError('Invalid repeatPenalty value! Must be a valid number or null.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { repeatPenalty: value });
    this.emit('setRepeatPenalty', value, selectedId);
  }

  /**
   * Get the repeat penalty for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The repeat penalty value, or null if not set.
   */
  getRepeatPenalty(id) {
    const history = this.getData(id);
    return history && typeof history.repeatPenalty === 'number' ? history.repeatPenalty : null;
  }

  /**
   * Set the model for an AI session.
   *
   * @param {string} data - The model identifier to be set.
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {void} This function does not return a value.
   */
  setModel(data, id) {
    if (typeof data !== 'string' && data !== null)
      throw new TypeError('Invalid model data type! Must be a string or null.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    this.#_insertIntoHistory(selectedId, { model: data });
    this.emit('setModel', data, selectedId);
  }

  /**
   * Get the model for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {string | null} The model identifier, or null if not set.
   */
  getModel(id) {
    const history = this.getData(id);
    return history && typeof history.model === 'string' ? history.model : null;
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
      if (typeof id !== 'string')
        throw new TypeError('Invalid select ID! Must be a string or null.');
      if (this.history[id]) {
        this.#_selectedHistory = id;
        this.emit('selectDataId', id);
        return true;
      }
      return false;
    }
    this.#_selectedHistory = null;
    this.emit('selectDataId', null);
    return true;
  }

  /**
   * Get the currently selected session history ID.
   *
   * @param {string} [id] - The session history ID to retrieve. If not provided, it uses the default selected ID.
   * @returns {string|null} The selected session history ID, or `null` if no history ID is selected.
   */
  getId(id) {
    const result = id && !this._isSingle ? id : this.#_selectedHistory;
    return typeof result === 'string' ? result : null;
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
        if (typeof history.tokens[item] === 'number') result += history.tokens[item];
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
    if (history && this.indexExists(msgIndex, id)) return history.tokens.data[msgIndex];
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
    if (history && this.indexExists(msgIndex, id)) return history.hash.data[msgIndex];
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
    if (history && history.data[index]) return history.ids[index];
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
      this.emit('deleteIndex', index, msgId, this.getId(id));
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
        hash = objHash(data);
        history.data[index] = data;
        history.hash.data[index] = hash;
      }

      if (tokens) history.tokens.data[index] = tokens;
      this.emit('replaceIndex', index, data, tokens, hash, this.getId(id));
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
    return history && history.data[0] ? true : false;
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
    if (!data || typeof data !== 'object')
      throw new TypeError('Invalid data parameter! Must be a valid object.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    if (typeof this.history[selectedId].nextId !== 'number') this.history[selectedId].nextId = 0;
    const newId = this.history[selectedId].nextId;
    this.history[selectedId].nextId++;
    const hash = objHash(data);

    const tokenContent = isJsonObject(tokenData)
      ? tokenData
      : { count: typeof tokenData === 'number' ? tokenData : null };

    this.history[selectedId].data.push(data);
    this.history[selectedId].tokens.data.push(tokenContent);
    this.history[selectedId].ids.push(newId);
    this.history[selectedId].hash.data.push(hash);

    this.emit('addData', newId, data, tokenContent, hash, selectedId);
    return newId;
  }

  /**
   * Sets a prompt for the selected session history.
   *
   * @param {string} promptData - The prompt to be set for the session.
   * @param {number} [tokenAmount] - The number of tokens associated with the prompt (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the provided session ID is invalid or the prompt data is not a string.
   */
  setPrompt(promptData, tokenAmount, id) {
    if (typeof promptData !== 'string')
      throw new TypeError('Invalid prompt data type! Must be a string.');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount data type! Must be a number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    const hash = objHash(promptData);
    this.history[selectedId].prompt = promptData;
    this.history[selectedId].hash.prompt = hash;

    if (typeof tokenAmount === 'number') this.history[selectedId].tokens.prompt = tokenAmount;
    this.emit('setPrompt', promptData, selectedId);
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
   * @param {string} dialogue - The dialogue to set as the first dialogue.
   * @param {number} [tokenAmount] - The number of tokens associated with the dialogue (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} Throws an error if the session ID is invalid or the dialogue is not a string.
   * @returns {void}
   */
  setFirstDialogue(dialogue, tokenAmount, id) {
    if (typeof dialogue !== 'string')
      throw new TypeError('Invalid dialogue data type! Must be a string.');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount data type! Must be a number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    const hash = objHash(dialogue);
    this.history[selectedId].firstDialogue = dialogue;
    this.history[selectedId].hash.firstDialogue = hash;

    if (typeof tokenAmount === 'number')
      this.history[selectedId].tokens.firstDialogue = tokenAmount;
    this.emit('setFirstDialogue', dialogue, selectedId);
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
   * Sets a system instruction for the selected session history.
   *
   * @param {string} data - The system instruction to set.
   * @param {number} [tokenAmount] - The token count associated with the system instruction (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @throws {Error} If the session history ID is invalid or the provided data is not a string.
   * @returns {void}
   */
  setSystemInstruction(data, tokenAmount, id) {
    if (typeof data !== 'string')
      throw new TypeError('Invalid system instruction data type! Must be a string.');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount data type! Must be a number.');

    const selectedId = this.getId(id);
    if (!selectedId || !this.history[selectedId]) throw new Error('Invalid history id data!');

    const hash = objHash(data);
    this.history[selectedId].systemInstruction = data;
    this.history[selectedId].hash.systemInstruction = hash;

    if (typeof tokenAmount === 'number')
      this.history[selectedId].tokens.systemInstruction = tokenAmount;
    this.emit('setSystemInstruction', data, selectedId);
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
   * @param {string} where - The category from which to retrieve the token count (e.g., 'prompt', 'systemInstruction').
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
   * @param {string} where - The key representing the item whose hash value is being retrieved (e.g., 'prompt', 'systemInstruction').
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
   * @returns {SessionData} The newly created session data.
   */
  startDataId(id, selected = false) {
    if (typeof id !== 'string' || id.trim() === '')
      throw new TypeError('Invalid session ID! Must be a non-empty string.');
    this.history[id] = {
      data: [],
      ids: [],
      tokens: { data: [] },
      hash: { data: [] },
      systemInstruction: null,
      model: null,
      stop: null,
      repeatPenalty: null,
      logitBias: null,
    };
    if (selected) this.selectDataId(id);
    this.emit('startDataId', this.history[id], id, selected ? true : false);
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
    if (typeof id !== 'string')
      throw new TypeError('Invalid session ID to stop! Must be a string.');
    if (this.history[id]) {
      delete this.history[id];
      if (this.getId() === id) this.selectDataId(null);
      this.emit('stopDataId', id);
      return true;
    }
    return false;
  }

  /**
   * Destroys the instance by clearing history and removing all event listeners.
   *
   * This method resets the internal `history` object, effectively discarding any stored
   * data or state associated with the instance's operations. It also removes all listeners
   * from events to ensure no further event handling occurs and to
   * prevent memory leaks.
   *
   * This method should be called when the instance is no longer needed.
   *
   * @returns {void}
   */
  destroy() {
    if (!this._isSingle) for (const id in this.history) this.stopDataId(id);
    else this.stopDataId('main');
    this.removeAllListeners();
  }
}

export default TinyAiInstance2;
