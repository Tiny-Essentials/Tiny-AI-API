import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';

const AiFileDataPlugin =
  /** @param {typeof TinyAiInstance2Core} Base */
  (Base) =>
    /**
     * @template {Record<any,any>} AICData
     * @extends {TinyAiInstance2Core<AICData, SessionData>}
     */
    class TinyAiInstance2FileData extends Base {
      static _tinyDepName = 'FileData';
      /** @typedef {import('../TinyAiInstance2Core.mjs').SessionData<AICData>} SessionData */
      /**
       * Creates an instance of the TinyAiInstance2FileData class.
       *
       * @param {boolean} [isSingle=false] - If true, configures the instance to handle a single session only.
       * @param {SessionData} [modData] - The initial modification data for the session.
       * @param {Record<string, import("../TinyAiInstance2Core.mjs").CustomValidatorFunction>} [modValidators] - Custom validation functions.
       */
      constructor(isSingle = false, modData = undefined, modValidators = undefined) {
        super(isSingle, modData, modValidators);
      }
    };

export default AiFileDataPlugin;
