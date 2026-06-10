import { encode as encodeBase64 } from 'js-base64';
import { isJsonObject } from '../tiny-modules/basics/objChecker.mjs';

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
 * Strictly validates an AIContentData object to ensure it conforms to the OpenAI API standard.
 *
 * @param {AIContentData} data - The object to validate.
 * @throws {TypeError} If the object fails schema validation.
 */
export const validateAIContentData = (data) => {
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
};

/**
 * Sets file data natively formatted for OpenAI Vision APIs.
 * Converts plain data into an image URI structure.
 *
 * @param {string} mime - The MIME type of the file (e.g., 'image/jpeg').
 * @param {string} data - The file content (base64 or string).
 * @param {boolean} [isBase64=false] - Whether data is already base64 encoded.
 * @returns {AIContentImageInput} The formatted image input object.
 */
export const imageToBase64 = (mime, data, isBase64 = false) => {
  if (typeof mime !== 'string' || typeof data !== 'string')
    throw new TypeError('Invalid input! Mime and data must be strings.');
  return {
    type: 'image_url',
    image_url: {
      url: `data:${mime};base64,${!isBase64 ? encodeBase64(data) : data}`,
    },
  };
};
