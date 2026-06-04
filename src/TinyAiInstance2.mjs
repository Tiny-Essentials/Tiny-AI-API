import objHash from 'object-hash';
import { EventEmitter } from 'events';
import { encode as encodeBase64 } from 'js-base64';
import { isJsonObject, objType } from './tiny-modules/basics/objFilter.mjs';
import { cloneDeep } from 'lodash';

/**
 * @callback CustomValidatorFunction
 * @param {*} value - The value to validate.
 * @returns {boolean} True if valid, false otherwise.
 */

/**
 * @typedef {Object} CustomValueDefinition
 * @property {string} name - The name of the custom value.
 * @property {string} type - The expected data type for the custom value.
 * @property {CustomValidatorFunction} [validator] - An optional custom validation function.
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
 * @property {number} nextId - The next available unique ID for a new message in the sequence.
 * @property {AIContentData[]} data - Array of content data entries in the session.
 * @property {number[]} ids - Array of unique IDs corresponding to the content data.
 * @property {{ data: Array<TokenCount>; [key: string]: any }} tokens - Token usage data categorized by message/field.
 * @property {{ data: Array<string>; [key: string]: any }} hash - Hash values for content data entries.
 * @property {string|null} systemInstruction - The system instruction guiding the AI's behavior.
 * @property {CustomValueDefinition[]} customList - List of custom values and their expected types/validators.
 * @property {string|null} model - The currently selected AI model identifier.
 * @property {string|string[]|null} stop - Stop sequences for generation to halt text output.
 * @property {string|null} prompt - The primary prompt data of the session.
 * @property {string|null} firstDialogue - The first dialogue initialization data of the session.
 * @property {number|null} repeatPenalty - Penalty applied to repeated tokens to prevent looping.
 * @property {number|null} frequencyPenalty - Penalty applied to frequent tokens to encourage variety.
 * @property {number|null} presencePenalty - Penalty applied to tokens based on their presence in the context.
 * @property {number|null} topP - Nucleus sampling parameter controlling cumulative probability.
 * @property {number|null} topK - Top-K sampling parameter restricting token choices to the top K probable tokens.
 * @property {number|null} temperature - Randomness parameter for generation (higher means more creative).
 * @property {Record<string, number>|null} logitBias - Logit bias mapping to mathematically increase/decrease specific token probabilities.
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
 * Tiny AI Server Communication API Core (OpenAI Standard)
 * -----------------------------
 * This class manages AI session data natively using the OpenAI API structure.
 * It uses 'role', 'content', and supports 'tools'/'tool_calls' making it perfect
 * for local models via LM Studio, vLLM, or the official OpenAI API.
 *
 * **Note**: This script does not automatically track token count natively since
 * standard OpenAI-compatible APIs often lack a dedicated token-counting endpoint.
 *
 * @template {SessionData & Record<string, any>} T
 */
export class TinyAiInstanceCore2 extends EventEmitter {
  #destroyed = false;

  get destroyed() {
    return this.#destroyed;
  }

  /** @type {string|null} */ #selectedHistory = null;

  /** @type {Map<string, { value: any, type: string, tokenAmount?: number, validator?: CustomValidatorFunction }>} */
  #customValues = new Map();

  /** @returns {Record<string, { value: any, type: string, tokenAmount?: number, validator?: CustomValidatorFunction }>} */
  get customValues() {
    return Object.fromEntries(this.#customValues);
  }

  get customValuesSize() {
    return this.#customValues.size;
  }

  /** @type {Map<string, T>} */ #history = new Map();

  /** @returns {Record<string, T>} */
  get history() {
    return Object.fromEntries(this.#history);
  }

  get historySize() {
    return this.#history.size;
  }

  #isSingle = false;

  get isSingle() {
    return this.#isSingle;
  }

  get selectedHistory() {
    return this.#selectedHistory;
  }

  /**
   * Select a session history ID to set as the active session.
   * If `null` is passed, it deselects the current session ID.
   *
   * @param {string|null} id - The session history ID to select, or `null` to deselect the current session.
   */
  set selectedHistory(id) {
    if (id !== null) {
      if (typeof id !== 'string')
        throw new TypeError('Invalid select ID! Must be a string or null.');
      if (this.#history.has(id)) {
        this.#selectedHistory = id;
        this.emit('selectDataId', id);
      } else throw new Error('Invalid select ID! Must be a valid history id.');
    } else {
      this.#selectedHistory = null;
      this.emit('selectDataId', null);
    }
  }

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
   * Creates an instance of the TinyAiInstance2Core class.
   *
   * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
   * @param {T} [modData]
   * @param {Record<string, CustomValidatorFunction>} [modValidators]
   */
  constructor(isSingle = false, modData = undefined, modValidators = undefined) {
    super();
    this.#isSingle = isSingle;

    if (modData) {
      for (const name in modData) {
        const value = modData[name];
        const customValidator = modValidators ? modValidators[name] : undefined;
        this.setCustomValue(name, value, undefined, 'ROOT', customValidator);
      }
    }

    // Is single instance
    if (this.#isSingle) {
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

  /** @type {any} */
  #defaultSessionData = {
    data: [],
    ids: [],
    tokens: { data: [] },
    hash: { data: [] },
    systemInstruction: null,
    customList: [],
    model: null,
    stop: null,
    prompt: null,
    firstDialogue: null,
    repeatPenalty: null,
    frequencyPenalty: null,
    presencePenalty: null,
    topP: null,
    topK: null,
    temperature: null,
    logitBias: null,
    nextId: 0,
  };

  /**
   * Creates the default session data structure.
   * Uses deep cloning to prevent shared references in arrays and objects.
   *
   * @returns {T} The initialized session data.
   */
  _createDefaultSessionData() {
    return cloneDeep(this.#defaultSessionData);
  }

  /**
   * Strictly validates an AIContentData object to ensure it conforms to the OpenAI API standard.
   *
   * @param {AIContentData} data - The object to validate.
   * @throws {TypeError} If the object fails schema validation.
   */
  _validateAIContentData(data) {
    if (!isJsonObject(data)) throw new TypeError('Data must be a valid JSON object.');
    if (typeof data.role !== 'string')
      throw new TypeError('Property "role" is required and must be a string.');

    if ('content' in data && data.content !== undefined && data.content !== null) {
      if (typeof data.content !== 'string' && !Array.isArray(data.content)) {
        throw new TypeError(
          'Property "content" must be a string or an array of valid AIContentInput objects.',
        );
      }
      if (Array.isArray(data.content)) {
        for (const item of data.content) {
          if (!isJsonObject(item)) throw new TypeError('Content array items must be objects.');
          if (item.type === 'text') {
            if (typeof item.text !== 'string')
              throw new TypeError('AIContentTextInput must have a "text" string property.');
          } else if (item.type === 'image_url') {
            if (!isJsonObject(item.image_url))
              throw new TypeError('AIContentImageInput must have an "image_url" object.');
          } else {
            throw new TypeError(
              'Content array item must have a valid "type" ("text" or "image_url").',
            );
          }
        }
      }
    }

    if ('tool_calls' in data && data.tool_calls !== undefined) {
      if (!Array.isArray(data.tool_calls))
        throw new TypeError('Property "tool_calls" must be an array.');
      for (const tool of data.tool_calls) {
        if (!isJsonObject(tool)) throw new TypeError('Tool calls must be objects.');
        if (typeof tool.id !== 'string') throw new TypeError('Tool call must have a string "id".');
        if (typeof tool.type !== 'string')
          throw new TypeError('Tool call must have a string "type".');
        if ('function' in tool && tool.function !== undefined) {
          if (!isJsonObject(tool.function))
            throw new TypeError('Tool call "function" must be an object.');
          if (typeof tool.function.name !== 'string')
            throw new TypeError('Tool call function must have a "name" string.');
          if (typeof tool.function.arguments !== 'string')
            throw new TypeError('Tool call function must have "arguments" as a JSON string.');
        }
      }
    }

    if (
      'tool_call_id' in data &&
      data.tool_call_id !== undefined &&
      typeof data.tool_call_id !== 'string'
    ) {
      throw new TypeError('Property "tool_call_id" must be a string.');
    }
    if ('name' in data && data.name !== undefined && typeof data.name !== 'string') {
      throw new TypeError('Property "name" must be a string.');
    }
    if (
      'finishReason' in data &&
      data.finishReason !== undefined &&
      typeof data.finishReason !== 'string' &&
      typeof data.finishReason !== 'number'
    ) {
      throw new TypeError('Property "finishReason" must be a string or number.');
    }
  }

  /**
   * Updates an existing entry in the session history.
   * @param {string|null} id - The session identifier.
   * @param {HistoryUpdateData} data - Data fields to update within the session.
   * @returns {boolean} True if the update succeeded, false otherwise.
   */
  #insertIntoHistory(id, data) {
    const history = typeof id === 'string' ? this.#history.get(id) : undefined;
    if (history) {
      for (const where in data) {
        // @ts-ignore
        history[where] = data[where];
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
   * Sets a custom value in the selected session history or globally via ROOT.
   *
   * @param {string} name - The name of the custom value to set.
   * @param {*} value - The value to be assigned to the custom key.
   * @param {number} [tokenAmount] - The token amount associated with the custom value (optional).
   * @param {string} [id] - The session ID or 'ROOT'. If omitted, the currently selected session history ID will be used.
   * @param {CustomValidatorFunction} [customValidator] - An optional function to validate the value format.
   * @throws {Error} If the custom value name is invalid, fails validation, or data is corrupted.
   */
  setCustomValue(name, value, tokenAmount, id, customValidator) {
    if (typeof name !== 'string' || name.length === 0 || name === 'customList')
      throw new TypeError('Invalid custom value name!');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount! Must be a number.');
    if (customValidator !== undefined && typeof customValidator !== 'function')
      throw new TypeError('Invalid custom validator! Must be a function.');

    /** Inferred data type of the value to store */
    const type = value !== null ? (objType(value)?.toString() ?? '') : '';

    if (id === 'ROOT') {
      // Allows null in ROOT ONLY if a customValidator is provided to secure future assignments
      if (value === null && !customValidator)
        throw new Error(
          'ROOT custom values cannot be null unless a customValidator is provided! Use eraseCustomValue to remove them completely.',
        );

      // Only validate against the function if the value is not null during ROOT initialization
      if (value !== null && customValidator && !customValidator(value)) {
        throw new Error(`ROOT custom value validation failed for '${name}'.`);
      }

      this.#customValues.set(name, { value, type, tokenAmount, validator: customValidator });

      // Update the #defaultSessionData to persist this root value to future sessions
      this.#defaultSessionData[name] = value;

      if (value !== null) {
        this.#defaultSessionData.hash[name] = objHash(value);
      } else {
        delete this.#defaultSessionData.hash[name];
      }

      if (typeof tokenAmount === 'number') {
        this.#defaultSessionData.tokens[name] = tokenAmount;
      }

      /** @type {CustomValueDefinition|undefined} - Pointer to existing root custom list definition */
      // @ts-ignore
      const rootProps = this.#defaultSessionData.customList.find((item) => item.name === name);
      if (!rootProps) {
        this.#defaultSessionData.customList.push({ name, type, validator: customValidator });
      } else {
        rootProps.type = type;
        rootProps.validator = customValidator;
      }

      // Synchronize ROOT definition across all active sessions
      for (const [, history] of this.#history.entries()) {
        if (!Array.isArray(history.customList)) history.customList = [];

        let props = history.customList.find((item) => item.name === name);
        if (!props) {
          history.customList.push({ name, type, validator: customValidator });
        } else {
          props.type = type;
          props.validator = customValidator;
        }

        // Only apply the ROOT value to the session if it hasn't been overridden locally
        if (typeof history[name] === 'undefined' || history[name] === null) {
          // @ts-ignore
          history[name] = value;

          if (value !== null) {
            history.hash[name] = objHash(value);
          } else {
            delete history.hash[name];
          }

          if (typeof tokenAmount === 'number') history.tokens[name] = tokenAmount;
        }
      }
      this.emit(`set${this.#capitalizeFirstLetter(name)}`, value, 'ROOT');
      return;
    }

    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');
    if (!Array.isArray(history.customList)) history.customList = [];

    const rootDef = this.#customValues.get(name);

    // Run ROOT validator if it exists, otherwise run the local one
    const activeValidator = rootDef?.validator || customValidator;

    // If defined in ROOT, validate the local session strictly against ROOT rules
    if (rootDef && value !== null) {
      if (activeValidator) {
        if (!activeValidator(value)) {
          throw new Error(
            `Corrupted custom value! Fails ROOT custom validator for '${name}'. Use resetCustomValue to restore to a valid state.`,
          );
        }
      } else if (type !== rootDef.type) {
        throw new Error(
          `Corrupted custom value! Type conflict with ROOT definition. Expected ${rootDef.type}, got ${type}. Use resetCustomValue to restore to a valid state.`,
        );
      }
    }

    // Normal session validation
    if (value !== null) {
      if (!rootDef && activeValidator && !activeValidator(value)) {
        throw new Error(`Validation failed for local custom value '${name}'.`);
      }

      /** Configuration details of the value */
      const props = history.customList.find((item) => item.name === name);
      if (!props || typeof props.name !== 'string') {
        if (typeof history[name] === 'undefined') {
          history.customList.push({ name, type, validator: activeValidator });
        } else throw new Error('This value name is already being used!');
      } else if (!activeValidator && props.type !== type) {
        throw new Error(
          `Invalid custom value type! Expected ${props.type}, got ${type}. Use resetCustomValue to restore to a valid state.`,
        );
      }
    }

    // Add Tokens
    if (typeof tokenAmount === 'number') history.tokens[name] = tokenAmount;

    // Send custom value into the history
    if (value !== null) {
      this.#insertIntoHistory(selectedId, { [name]: value });
      history.hash[name] = objHash(value);
    }

    // Complete
    this.emit(`set${this.#capitalizeFirstLetter(name)}`, value, selectedId);
  }

  /**
   * Resets a custom value in the selected session history to null.
   *
   * @param {string} name - The name of the custom value to reset.
   * @param {string} [id] - The session ID.
   * @throws {Error} If the custom value name is invalid or does not match an existing entry.
   */
  resetCustomValue(name, id) {
    if (typeof name !== 'string' || name.length === 0 || name === 'customList')
      throw new TypeError('Invalid custom value name!');

    if (id === 'ROOT') {
      throw new Error(
        'You cannot reset a ROOT value directly. Use eraseCustomValue to delete it from ROOT or setCustomValue to overwrite it.',
      );
    }

    /** ID of the target session */
    const selectedId = this.getId(id);
    /** Memory representation of the chosen history */
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');
    if (!Array.isArray(history.customList)) history.customList = [];

    // Validate the custom value
    /** Properties bound to the value */
    const props = history.customList.find((item) => item.name === name);
    if (!isJsonObject(props) || typeof props.name !== 'string')
      throw new TypeError('Invalid custom value data type or custom value not found!');

    // Reset Tokens
    if (typeof history.tokens[name] !== 'undefined') delete history.tokens[name];

    // Reset custom value
    this.#insertIntoHistory(selectedId, { [name]: null });
    if (typeof history.hash[name] !== 'undefined') delete history.hash[name];

    // Complete
    this.emit(`set${this.#capitalizeFirstLetter(name)}`, null, selectedId);
  }

  /**
   * Completely removes a custom value from the selected session history or globally via ROOT.
   *
   * @param {string} name - The name of the custom value to erase.
   * @param {string} [id] - The session ID or 'ROOT'.
   * @throws {Error} If the custom value name is invalid or does not exist.
   */
  eraseCustomValue(name, id) {
    if (typeof name !== 'string' || name.length === 0 || name === 'customList')
      throw new TypeError('Invalid custom value name!');

    if (id === 'ROOT') {
      this.#customValues.delete(name);

      // Clean up default template to stop replication into future sessions
      delete this.#defaultSessionData[name];
      delete this.#defaultSessionData.hash[name];
      delete this.#defaultSessionData.tokens[name];
      /** Index location inside the root custom list */
      // @ts-ignore
      const rootIndex = this.#defaultSessionData.customList.findIndex((item) => item.name === name);
      if (rootIndex > -1) this.#defaultSessionData.customList.splice(rootIndex, 1);

      // Clean up active sessions
      for (const [, history] of this.#history.entries()) {
        if (history.customList) {
          /** Internal map index to erase */
          const index = history.customList.findIndex((item) => item.name === name);
          if (index > -1) history.customList.splice(index, 1);
        }
        delete history[name];
        delete history.hash[name];
        delete history.tokens[name];
      }
      this.emit(`erase${this.#capitalizeFirstLetter(name)}`, 'ROOT');
      return;
    }

    /** Local ID of the session */
    const selectedId = this.getId(id);
    /** Memory content mapped to local ID */
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Failed to erase custom value: History not found!');

    /** Data fallback mapping check */
    const rootDef = this.#customValues.get(name);

    // If ROOT defines this value, erasing the session override restores the ROOT default
    if (rootDef) {
      // @ts-ignore
      history[name] = rootDef.value;
      history.hash[name] = objHash(rootDef.value);
      if (typeof rootDef.tokenAmount === 'number') {
        history.tokens[name] = rootDef.tokenAmount;
      } else {
        delete history.tokens[name];
      }

      if (!Array.isArray(history.customList)) history.customList = [];
      /** Definition tracker for restore */
      let props = history.customList.find((item) => item.name === name);
      if (!props) {
        history.customList.push({ name, type: rootDef.type, validator: rootDef.validator });
      } else {
        props.type = rootDef.type;
        props.validator = rootDef.validator;
      }

      this.emit(`erase${this.#capitalizeFirstLetter(name)}RestoreRoot`, rootDef.value, selectedId);
      return;
    }

    // Normal full erase
    this.resetCustomValue(name, selectedId ?? undefined);
    if (history.customList) {
      /** Pointer position mapping for erase target */
      const index = history.customList.findIndex((item) => item.name === name);
      if (index > -1) history.customList.splice(index, 1);
    }
  }

  /**
   * Retrieves a custom value from the selected session history or falls back to ROOT.
   *
   * @param {string} name - The name of the custom value to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {*} The value associated with the specified name, or `null` if it does not exist.
   * @throws {Error} If a conflict/corruption is detected between the session and the ROOT definition.
   */
  getCustomValue(name, id) {
    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) return null;

    const rootDef = this.#customValues.get(name);
    /** Current custom localized value */
    const sessionVal = history[name];

    // Conflict detection
    if (rootDef && sessionVal !== undefined && sessionVal !== null) {
      if (rootDef.validator) {
        if (!rootDef.validator(sessionVal)) {
          throw new Error(
            `Conflict detected! The session custom value '${name}' fails the ROOT validation rules. Please use eraseCustomValue to clear the corruption.`,
          );
        }
      } else {
        /** Analyzed local data type format */
        const sessionType = objType(sessionVal)?.toString() ?? '';
        if (sessionType !== rootDef.type) {
          throw new Error(
            `Conflict detected! The session custom value '${name}' conflicts with the ROOT definition (Expected ${rootDef.type}, got ${sessionType}). Please use eraseCustomValue to clear the corruption.`,
          );
        }
      }
    }

    return typeof sessionVal !== 'undefined' && sessionVal !== null
      ? sessionVal
      : rootDef
        ? rootDef.value
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
    if (!history) throw new Error('Invalid history id data!');
    return [...history.customList];
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { temperature: value });
    this.emit('setTemperature', value, selectedId);
  }

  /**
   * Get the AI temperature setting for a session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The temperature value, or null if not set.
   */
  getTemperature(id) {
    return this.getData(id).temperature;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { topP: value });
    this.emit('setTopP', value, selectedId);
  }

  /**
   * Get the top-p (nucleus sampling) setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The top-p value, or null if not set.
   */
  getTopP(id) {
    return this.getData(id).topP;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { topK: value });
    this.emit('setTopK', value, selectedId);
  }

  /**
   * Get the top-k setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The top-k value, or null if not set.
   */
  getTopK(id) {
    return this.getData(id).topK;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { presencePenalty: value });
    this.emit('setPresencePenalty', value, selectedId);
  }

  /**
   * Get the presence penalty setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The presence penalty value, or null if not set.
   */
  getPresencePenalty(id) {
    return this.getData(id).presencePenalty;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { frequencyPenalty: value });
    this.emit('setFrequencyPenalty', value, selectedId);
  }

  /**
   * Get the frequency penalty setting for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The frequency penalty value, or null if not set.
   */
  getFrequencyPenalty(id) {
    return this.getData(id).frequencyPenalty;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { stop: value });
    this.emit('setStop', value, selectedId);
  }

  /**
   * Get the stop sequences for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {string|string[]|null} The stop sequence(s), or null if not set.
   */
  getStop(id) {
    return this.getData(id).stop;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { logitBias: value });
    this.emit('setLogitBias', value, selectedId);
  }

  /**
   * Get the logit bias for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {Record<string, number>|null} The logit bias object, or null if not set.
   */
  getLogitBias(id) {
    return this.getData(id).logitBias;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { repeatPenalty: value });
    this.emit('setRepeatPenalty', value, selectedId);
  }

  /**
   * Get the repeat penalty for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {number | null} The repeat penalty value, or null if not set.
   */
  getRepeatPenalty(id) {
    return this.getData(id).repeatPenalty;
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
    if (!selectedId || !this.#history.has(selectedId)) throw new Error('Invalid history id data!');

    this.#insertIntoHistory(selectedId, { model: data });
    this.emit('setModel', data, selectedId);
  }

  /**
   * Get the model for an AI session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session will be used.
   * @returns {string | null} The model identifier, or null if not set.
   */
  getModel(id) {
    return this.getData(id).model;
  }

  /**
   * Get the currently selected session history ID.
   *
   * @param {string} [id] - The session history ID to retrieve. If not provided, it uses the default selected ID.
   * @returns {string|null} The selected session history ID, or `null` if no history ID is selected.
   */
  getId(id) {
    return id && !this.#isSingle ? id : this.#selectedHistory;
  }

  /**
   * Resets all stored data associated with a given session.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session ID will be used.
   * @returns {boolean} A status code indicating the reset result.
   */
  resetContentData(id) {
    let result = false;
    const history = this.getData(id);
    while (history.ids.length > 0) {
      result = true;
      this.deleteIndex(0);
    }
    return result;
  }

  /**
   * Get the data associated with a specific session history ID.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {T} The data associated with the session ID, or `null` if no data exists for that ID.
   */
  getData(id) {
    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');
    return history;
  }

  /**
   * Calculates the total number of tokens used for messages in the session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The total number of tokens used in the session history.
   */
  getTotalTokens(id) {
    const history = this.getData(id);
    if (!history) throw new Error('Invalid history id data!');
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

  /**
   * Retrieves the token data for a specific message in the session history by its index.
   *
   * @param {number} msgIndex - The index of the message in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {TokenCount} The token data associated with the message at the specified index.
   */
  getMsgTokensByIndex(msgIndex, id) {
    if (!this.indexExists(msgIndex, id))
      throw new Error('Invalid history token data index! Check if the index exists.');
    return this.getData(id).tokens.data[msgIndex];
  }

  /**
   * Retrieves the token data for a specific message in the session history by its message ID.
   *
   * @param {number} msgId - The unique ID of the message in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {TokenCount} The token data associated with the message with the given ID.
   */
  getMsgTokensById(msgId, id) {
    return this.getData(id).tokens.data[this.getIndexOfId(msgId)];
  }

  /**
   * Retrieves the hash of a message at a specified index in the selected session history.
   *
   * @param {number} msgIndex - The index of the message whose hash is being retrieved.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string} The hash value of the message at the specified index.
   */
  getMsgHashByIndex(msgIndex, id) {
    if (!this.indexExists(msgIndex, id))
      throw new Error('Invalid history hash data index! Check if the index exists.');
    return this.getData(id).hash.data[msgIndex];
  }

  /**
   * Retrieves the hash of a message based on its ID from the selected session history.
   *
   * @param {number} msgId - The ID of the message whose hash is being retrieved.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string} The hash value of the message with the specified ID.
   */
  getMsgHashById(msgId, id) {
    return this.getData(id).hash.data[this.getIndexOfId(msgId)];
  }

  /**
   * Checks if a specific index exists in the session history.
   *
   * @param {number} index - The index to check for existence in the session history.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the index exists, otherwise `false`.
   */
  indexExists(index, id) {
    return this.getData(id).data[index] ? true : false;
  }

  /**
   * Retrieve a specific data entry by its index from the session history.
   *
   * @param {number} index - The index of the data entry to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData} The data entry at the specified index.
   */
  getMsgByIndex(index, id) {
    if (!this.indexExists(index, id))
      throw new Error('Invalid history message data! The index does not exist.');
    return this.getData(id).data[index];
  }

  /**
   * Retrieves a specific message by its ID from the session history.
   *
   * @param {number} msgId - The ID of the message to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData} The message data associated with the given ID.
   */
  getMsgById(msgId, id) {
    return this.getData(id).data[this.getIndexOfId(msgId)];
  }

  /**
   * Retrieve the index of a specific message ID in the session history.
   *
   * @param {number} msgId - The message ID to search for.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The index of the message ID in the session history.
   */
  getIndexOfId(msgId, id) {
    const index = this.getData(id).ids.indexOf(msgId);
    if (index < 0) throw new Error('This history ID does not exist in the active memory list!');
    return index;
  }

  /**
   * Retrieve the message ID at a specific index in the session history.
   *
   * @param {number} index - The index of the data to retrieve.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The message ID at the specified index.
   */
  getIdByIndex(index, id) {
    const history = this.getData(id);
    if (!history.data[index])
      throw new Error('This history index does not exist to extract its ID!');
    return history.ids[index];
  }

  /**
   * Swaps the positions of two entries within the session history.
   *
   * @param {number} index1 - The first index to swap.
   * @param {number} index2 - The second index to swap.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the swap was successful.
   */
  swapIndex(index1, index2, id) {
    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;

    if (!history) throw new Error('Invalid history id data! Cannot execute the swap operation.');
    if (typeof index1 !== 'number' || typeof index2 !== 'number')
      throw new TypeError('Indexes must be properly formatted numbers.');
    if (!history.data[index1] || !history.data[index2])
      throw new Error('One or both indexes are out of bounds inside the list memory context.');

    // Swap data
    const tempContent = history.data[index1];
    history.data[index1] = history.data[index2];
    history.data[index2] = tempContent;

    // Swap IDs
    const tempId = history.ids[index1];
    history.ids[index1] = history.ids[index2];
    history.ids[index2] = tempId;

    // Swap Tokens
    const tempToken = history.tokens.data[index1];
    history.tokens.data[index1] = history.tokens.data[index2];
    history.tokens.data[index2] = tempToken;

    // Swap Hashes
    const tempHash = history.hash.data[index1];
    history.hash.data[index1] = history.hash.data[index2];
    history.hash.data[index2] = tempHash;

    this.emit('swapIndex', index1, index2, selectedId);
    return true;
  }

  /**
   * Delete a specific entry from the session history at the given index.
   *
   * @param {number} index - The index of the entry to delete.
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   */
  deleteIndex(index, id) {
    const history = this.getData(id);
    if (!history.data[index]) throw new Error('This history index does not exist for deletion!');
    const msgId = this.getIdByIndex(index);
    history.data.splice(index, 1);
    history.ids.splice(index, 1);
    history.hash.data.splice(index, 1);
    history.tokens.data.splice(index, 1);
    this.emit('deleteIndex', index, msgId, this.getId(id));
  }

  /**
   * Replaces an entry at the specified index in the session history with new data.
   *
   * @param {number} index - The index of the entry to replace.
   * @param {AIContentData} [data] - The new data to replace the existing entry (optional).
   * @param {TokenCount} [tokens] - The token count associated with the new entry (optional).
   * @param {string} [id] - The session ID (optional). If omitted, the currently selected session history ID will be used.
   * @returns {boolean} `true` if the entry was successfully replaced, `false` if the entry does not exist.
   */
  replaceIndex(index, data, tokens, id) {
    const history = this.getData(id);
    if (!history.data[index]) throw new Error('This history index does not exist to be replaced!');
    if (data || tokens) {
      /** @type {string|null} - Context mapped object map index element block pointer extraction string payload value target location reference point holding tag state element memory container context result item content marker output tag container marker reference result tag chunk chunk variable point placeholder map tracking placeholder data item chunk context mapping marker output value payload extraction container point output element data marker */
      let hash = null;
      if (data) {
        this._validateAIContentData(data); // Ensures perfect structure conformity
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
   * @returns {number} The index of the last entry in the session history.
   */
  getLastIndex(id) {
    if (!this.existsFirstIndex(id))
      throw new Error('Cannot retrieve the last index because the history is completely empty!');
    return this.getData(id).data.length - 1;
  }

  /**
   * Retrieve the data of the last entry in the session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {AIContentData} The data of the last entry in the session history.
   */
  getLastIndexData(id) {
    if (!this.existsFirstIndex(id))
      throw new Error('Cannot retrieve last index data because the history is completely empty!');
    const history = this.getData(id);
    return history.data[history.data.length - 1];
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
   * @returns {AIContentData} The first entry of the session history.
   */
  getFirstIndexData(id) {
    if (!this.existsFirstIndex(id))
      throw new Error('Cannot retrieve first index data because the history is completely empty!');
    return this.getData(id).data[0];
  }

  /**
   * Adds new data to the selected session history. Strict validation is applied to ensure data integrity.
   *
   * @param {AIContentData} data - The data to be added to the session history.
   * @param {TokenCount} [tokenData={count: null}] - Optional token-related data to be associated with the new entry.
   * @param {string} [id] - The session history ID. If omitted, the currently selected session ID will be used.
   * @returns {number} The new ID of the added data entry.
   */
  addData(data, tokenData = { count: null }, id = undefined) {
    this._validateAIContentData(data); // Ensures perfect structure conformity
    const selectedId = this.getId(id);
    const history = this.getData(id);

    const newId = history.nextId;
    history.nextId++;
    const hash = objHash(data);

    /** @type {TokenCount} - Token variable tracking output context structure mapped point variable item memory representation variable representation tracking payload context */
    const tokenContent = isJsonObject(tokenData)
      ? tokenData
      : { count: typeof tokenData === 'number' ? tokenData : null };

    history.data.push(data);
    history.tokens.data.push(tokenContent);
    history.ids.push(newId);
    history.hash.data.push(hash);

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
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');

    const hash = objHash(promptData);
    history.prompt = promptData;
    history.hash.prompt = hash;

    if (typeof tokenAmount === 'number') history.tokens.prompt = tokenAmount;
    this.emit('setPrompt', promptData, selectedId);
  }

  /**
   * Retrieves the prompt of the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The prompt for the session if available, otherwise null.
   */
  getPrompt(id) {
    return this.getData(id).prompt;
  }

  /**
   * Sets the first dialogue for the selected session history.
   *
   * @param {string} dialogue - The dialogue to set as the first dialogue.
   * @param {number} [tokenAmount] - The number of tokens associated with the dialogue (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   */
  setFirstDialogue(dialogue, tokenAmount, id) {
    if (typeof dialogue !== 'string')
      throw new TypeError('Invalid dialogue data type! Must be a string.');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount data type! Must be a number.');

    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');

    const hash = objHash(dialogue);
    history.firstDialogue = dialogue;
    history.hash.firstDialogue = hash;

    if (typeof tokenAmount === 'number') history.tokens.firstDialogue = tokenAmount;
    this.emit('setFirstDialogue', dialogue, selectedId);
  }

  /**
   * Retrieves the first dialogue from the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The first dialogue if it exists and is a non-empty string, or null if no first dialogue is set.
   */
  getFirstDialogue(id) {
    return this.getData(id).firstDialogue;
  }

  /**
   * Sets a system instruction for the selected session history.
   *
   * @param {string} data - The system instruction to set.
   * @param {number} [tokenAmount] - The token count associated with the system instruction (optional).
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   */
  setSystemInstruction(data, tokenAmount, id) {
    if (typeof data !== 'string')
      throw new TypeError('Invalid system instruction data type! Must be a string.');
    if (tokenAmount !== undefined && typeof tokenAmount !== 'number')
      throw new TypeError('Invalid token amount data type! Must be a number.');

    const selectedId = this.getId(id);
    const history = typeof selectedId === 'string' ? this.#history.get(selectedId) : undefined;
    if (!history) throw new Error('Invalid history id data!');

    const hash = objHash(data);
    history.systemInstruction = data;
    history.hash.systemInstruction = hash;

    if (typeof tokenAmount === 'number') history.tokens.systemInstruction = tokenAmount;
    this.emit('setSystemInstruction', data, selectedId);
  }

  /**
   * Retrieves the system instruction for the selected session history.
   *
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string|null} The system instruction for the selected session, or `null` if no instruction is set.
   */
  getSystemInstruction(id) {
    return this.getData(id).systemInstruction;
  }

  /**
   * Retrieves the token count for a specific category within the selected session history.
   *
   * @param {string} where - The category from which to retrieve the token count (e.g., 'prompt', 'systemInstruction').
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {number} The token count if available, otherwise null.
   */
  getTokens(where, id) {
    const history = this.getData(id);
    if (where === 'data')
      throw new Error(
        'Cannot retrieve tokens directly from the "data" array using this method. Use getMsgTokensByIndex or getMsgTokensById instead.',
      );
    if (typeof history.tokens[where] !== 'number')
      throw new Error(`Token count for '${where}' is undefined or not a valid number.`);
    return history.tokens[where];
  }

  /**
   * Retrieves the hash value for a specific item in the selected session history.
   *
   * @param {string} where - The key representing the item whose hash value is being retrieved (e.g., 'prompt', 'systemInstruction').
   * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
   * @returns {string} The hash value of the specified item, or null if the item does not exist.
   */
  getHash(where, id) {
    const history = this.getData(id);
    if (where === 'data')
      throw new Error(
        'Cannot retrieve hashes directly from the "data" array using this method. Use getMsgHashByIndex or getMsgHashById instead.',
      );
    if (typeof history.hash[where] !== 'string')
      throw new Error(`Hash for '${where}' is undefined or not a valid string.`);
    return history.hash[where];
  }

  /**
   * Starts a new data session with the given session ID.
   *
   * @param {string} id - The session ID for the new data session.
   * @param {boolean} [selected=false] - A flag to indicate whether this session should be selected as the active session.
   * @returns {T} The newly created session data.
   */
  startDataId(id, selected = false) {
    if (this.#destroyed)
      throw new Error('Cannot start a new session because the instance is already destroyed!');
    if (typeof id !== 'string' || id.trim() === '')
      throw new TypeError('Invalid session ID! Must be a non-empty string.');
    if (id === 'ROOT')
      throw new Error(
        'Invalid session ID! The "ROOT" ID is blocked from being initialized as a standard session.',
      );
    const result = this._createDefaultSessionData();
    this.#history.set(id, result);
    if (selected) this.selectedHistory = id;
    this.emit('startDataId', result, id, selected ? true : false);
    return result;
  }

  /**
   * Stop the data session associated with the provided ID.
   *
   * @param {string} id - The session history ID to stop and remove from history.
   * @returns {boolean} `true` if the session ID was found and successfully stopped, `false` otherwise.
   */
  stopDataId(id) {
    if (typeof id !== 'string')
      throw new TypeError('Invalid session ID to stop! Must be a string.');
    if (id === 'ROOT') throw new Error('Invalid session ID to stop! (ROOT BLOCKED!)');
    if (this.#history.has(id)) {
      this.#history.delete(id);
      if (this.getId() === id) this.selectedHistory = null;
      this.emit('stopDataId', id);
      return true;
    }
    return false;
  }

  /**
   * Destroys the instance by clearing history and removing all event listeners.
   *
   * @returns {void}
   */
  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true;
    if (!this.#isSingle) {
      for (const id of this.#history.keys()) this.stopDataId(id);
    } else this.stopDataId('main');
    this.#customValues.clear();
    this.removeAllListeners();
  }
}

/**
 * Tiny AI Server Communication API (OpenAI Standard)
 * -----------------------------
 * This class manages AI session data natively using the OpenAI API structure.
 * It uses 'role', 'content', and supports 'tools'/'tool_calls' making it perfect
 * for local models via LM Studio, vLLM, or the official OpenAI API.
 *
 * **Note**: This script does not automatically track token count natively since
 * standard OpenAI-compatible APIs often lack a dedicated token-counting endpoint.
 *
 * @extends {TinyAiInstanceCore2<SessionData>}
 */
export class TinyAiInstance2 extends TinyAiInstanceCore2 {
  /**
   * Creates an instance of the TinyAiInstance2 class.
   *
   * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
   */
  constructor(isSingle = false) {
    super(isSingle);
  }
}
