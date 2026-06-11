import TinyClassManager from '../tiny-modules/libs/TinyClassManager.mjs';
import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';
import AiFirstDialoguePlugin from './AiFirstDialoguePlugin.mjs';
import VanillaInstance from './VanillaInstance.mjs';

const aiManager = new TinyClassManager(TinyAiInstance2Core);

const TinyAiInstance2 = aiManager.insert(AiFirstDialoguePlugin).insert(VanillaInstance).build();

const test = new TinyAiInstance2();
const data = test.getLastIndexData();
