import TinyClassManager from '../../src/tiny-modules/libs/TinyClassManager.mjs';
import TinyAiInstance2Core from '../../src/TinyAiInstance2Core.mjs';
import AiFirstDialoguePlugin from '../../src/plugins/AiFirstDialoguePlugin.mjs';
import VanillaInstance from '../../src/plugins/VanillaInstance.mjs';

const aiManager = new TinyClassManager(TinyAiInstance2Core);
const buildReady = aiManager.insert(AiFirstDialoguePlugin).insert(VanillaInstance);

const TinyAiInstance2 = buildReady.build();

export default TinyAiInstance2;
