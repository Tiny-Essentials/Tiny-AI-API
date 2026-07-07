import TinyAiInstance2Core from './TinyAiInstance2Core.mjs';
// import VanillaInstance from './plugins/VanillaInstance.mjs';

import {
  checkObj as checkAiObj,
  cloneObjTypeOrder as cloneAiObjTypeOrder,
  extendObjType as extendAiObjType,
  getCheckObj as getCheckAiObj,
  objType as aiObjType,
  reorderObjTypeOrder as reorderAiObjTypeOrder,
} from './tiny-modules/basics/objFilter.mjs';
import TinyEvents from './tiny-modules/libs/TinyEvents.mjs';

export {
  TinyAiInstance2Core,
  // VanillaInstance,
  checkAiObj,
  cloneAiObjTypeOrder,
  extendAiObjType,
  getCheckAiObj,
  aiObjType,
  reorderAiObjTypeOrder,
  TinyEvents,
};
