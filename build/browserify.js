import { TinyGoogleAi, setTinyGoogleAi } from '../src/services/Google.mjs';
import {
  TinyOpenAiCompatible,
  setTinyOpenAiCompatible,
} from '../src/services/OpenAiCompatible.mjs';
import TinyAiInstance from '../src/TinyAiInstance.mjs';
import TinyAiInstance2 from '../src/TinyAiInstance2.mjs';

global.window.TinyAiApi = {
  TinyAiInstance,
  TinyAiInstance2,
  TinyOpenAiCompatible,
  setTinyOpenAiCompatible,
  TinyGoogleAi,
  setTinyGoogleAi,
};
