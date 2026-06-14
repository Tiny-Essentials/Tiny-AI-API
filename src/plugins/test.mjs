import TinyClassManager from '../tiny-modules/libs/TinyClassManager.mjs';
import TinyAiInstance2Core from '../TinyAiInstance2Core.mjs';
import AiFirstDialoguePlugin from './AiFirstDialoguePlugin.mjs';
import VanillaInstance from './VanillaInstance.mjs';

const aiManager = new TinyClassManager(TinyAiInstance2Core);
const buildReady = aiManager
  .insert((Base) => {
    const Result = AiFirstDialoguePlugin(Base);
    return Result;
  })
  .insert((Base) => {
    const Result = VanillaInstance(Base);
    return Result;
  });

const tinyClass = buildReady.appliedPluginClasses[1];

const TinyAiInstance2 = buildReady.build();

const test = new TinyAiInstance2();
const contentData = test.getLastIndexData();
const data = test.getData();
test.getFirstDialogue();
data.firstDialogue;
