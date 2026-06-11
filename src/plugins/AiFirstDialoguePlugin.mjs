import objectHash from 'object-hash';
import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';

/**
 * @typedef {Object} SessionFirstDialogueCore
 * @property {string|null} firstDialogue - The first dialogue initialization data of the session.
 */

const AiFirstDialoguePlugin =
  /**
   * @template {typeof TinyAiInstance2Core|unknown} Base
   * @param {Base} Base
   */
  (Base) =>
    /**
     * @template {Record<any,any>} AICData
     * @extends {TinyAiInstance2Core<AICData, SessionFirstDialogue>}
     */
    class TinyAiInstance2FirstDialogue extends Base {
      static _tinyDepName = 'FirstDialogue';
      /**
       * @typedef {import('../TinyAiInstance2Core.mjs').SessionData<AICData>} SessionData
       * @typedef {SessionData & SessionFirstDialogueCore} SessionFirstDialogue
       */

      /**
       * Creates an instance of the TinyAiInstance2FirstDialogue class.
       *
       * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
       * @param {Partial<SessionFirstDialogue>} [modData] - The initial modification data for the session.
       * @param {Record<string, import("../TinyAiInstance2Core.mjs").CustomValidatorFunction>} [modValidators] - Custom validation functions.
       */
      constructor(isSingle = false, modData = undefined, modValidators = undefined) {
        super(
          isSingle,
          {
            firstDialogue: null,
            ...modData,
          },
          {
            firstDialogue: (dialogue) => typeof dialogue !== 'string',
          },
        );
      }

      /**
       * Sets the first dialogue for the selected session history.
       *
       * @param {string} dialogue - The dialogue to set as the first dialogue.
       * @param {number} [tokenAmount] - The number of tokens associated with the dialogue (optional).
       * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
       */
      setFirstDialogue(dialogue, tokenAmount, id) {
        this.setCustomValue('firstDialogue', dialogue, tokenAmount, id);
      }

      /**
       * Retrieves the first dialogue from the selected session history.
       *
       * @param {string} [id] - The session ID. If omitted, the currently selected session history ID will be used.
       * @returns {string|null} The first dialogue if it exists and is a non-empty string, or null if no first dialogue is set.
       */
      getFirstDialogue(id) {
        return this.getCustomValue('firstDialogue', id);
      }
    };

export default AiFirstDialoguePlugin;
