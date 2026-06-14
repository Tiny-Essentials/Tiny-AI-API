import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';
import { imageToBase64, validateAIContentData } from '../services/VanillaAiContentData.mjs';

/**
 * @typedef {import('../services/VanillaAiContentData.mjs').AIContentData} AIContentData
 */

/**
 * @typedef {import('../TinyAiInstance2Core.mjs').SessionData<AIContentData>} SessionData
 */

const VanillaInstance =
  /**
   * @template {typeof TinyAiInstance2Core|unknown} TBase
   * @param {TBase} Base
   */
  (Base) =>
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
     * @extends {TinyAiInstance2Core<AIContentData, SessionData>}
     */
    class TinyAiInstance2 extends Base {
      static _tinyDepName = 'VanillaInstance';

      /**
       * Creates an instance of the TinyAiInstance2 class.
       *
       * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
       */
      constructor(isSingle = false) {
        super(isSingle);
      }

      /**
       * Sets file data natively formatted for OpenAI Vision APIs.
       * Converts plain data into an image URI structure.
       *
       * @param {string} mime - The MIME type of the file (e.g., 'image/jpeg').
       * @param {string} data - The file content (base64 or string).
       * @param {boolean} [isBase64=false] - Whether data is already base64 encoded.
       * @returns {import('../services/VanillaAiContentData.mjs').AIContentImageInput} The formatted image input object.
       */
      static imageToBase64(mime, data, isBase64 = false) {
        return imageToBase64(mime, data, isBase64);
      }

      /**
       * Strictly validates an AIContentData object to ensure it conforms to the OpenAI API standard.
       *
       * @param {AIContentData} data - The object to validate.
       * @throws {TypeError} If the object fails schema validation.
       */
      _validateAIContentData(data) {
        return validateAIContentData(data);
      }
    };

export default VanillaInstance;
