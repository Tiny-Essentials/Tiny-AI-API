import TinyClassManager from '../tiny-modules/libs/TinyClassManager.mjs';
import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';
import AiFirstDialoguePlugin from './AiFirstDialoguePlugin.mjs';
import VanillaInstance from './VanillaInstance.mjs';

const aiManager = new TinyClassManager(TinyAiInstance2Core);
const buildReady = aiManager.insert(AiFirstDialoguePlugin).insert(VanillaInstance);

const TinyAiInstance2 = buildReady.build();

export default TinyAiInstance2;
