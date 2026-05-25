import TinyAiInstance2 from '../TinyAiInstance2.mjs';
import errorCodes from '../utils/errorCodes.mjs';

/** @typedef {import('../TinyAiInstance2.mjs').AIContentData} AIContentData */

/**
 * Configures the Tiny AI Api to use an OpenAI-compatible API (e.g., LM Studio, Ollama, OpenAI).
 *
 * This function seamlessly interfaces with TinyAiInstance2 since both operate on the
 * identical native 'role' and 'content' JSON architecture.
 *
 * @param {TinyAiInstance2} tinyOpenAI - The TinyAiApi instance to be configured.
 * @param {string} apiUrl - The base URL for the API (e.g., 'http://localhost:1234/v1').
 * @param {string} API_KEY - The API key (use 'lm-studio' or any dummy string for local instances).
 * @param {string} [MODEL_DATA='local-model'] - The default model identifier to use.
 */
export function setTinyOpenAiCompatible(
  tinyOpenAI,
  apiUrl,
  API_KEY = 'lm-studio',
  MODEL_DATA = 'local-model',
) {
  tinyOpenAI.setApiKey(API_KEY);
  tinyOpenAI.setModel(MODEL_DATA);

  /**
   * Registers a predefined set of error codes for interpreting OpenAI finish reasons.
   */
  tinyOpenAI._setErrorCodes({
    stop: { text: 'Natural stop point of the model or provided stop sequence.', hide: true },
    length: { text: 'The maximum number of tokens as specified in the request was reached.' },
    content_filter: { text: 'The response was flagged and stopped by the safety content filter.' },
    null: { text: 'API response is still in progress or no finish reason was provided.' },
  });

  /**
   * Standardizes the error data structure for API rejections.
   * @param {*} [result={ error: { code: null, message: null, status: null, details: null } }]
   * @param {*} [finalData={ error: { code: null, message: null, status: null, details: null } }]
   */
  const buildErrorData = (result = {}, finalData = {}) => {
    finalData.error = {
      code: result?.error?.code || null,
      message: result?.error?.message || 'Unknown Error',
      status: result?.error?.type || null,
    };
  };

  /**
   * @typedef {Object<any, any>} ObjectAny
   */

  /**
   * Directly assigns parameters and payload elements without deep translation,
   * since TinyAiInstance2 matches the OpenAI format perfectly.
   *
   * @param {AIContentData[]} data - The conversation history and instructions.
   * @param {ObjectAny} [config={}] - Configurations like model name.
   * @param {boolean} [cacheMode=false] - Flag indicating cache mode constraints.
   * @returns {ObjectAny} The formatted JSON body for the API request.
   */
  const requestBuilder = (data, config = {}, cacheMode = false) => {
    /** @type {{ messages: AIContentData[], model: string }} */
    const requestBody = { messages: [], model: '' };

    if (typeof config.model === 'string') requestBody.model = config.model;

    for (const item of data) {
      if (!item) continue;
      requestBody.messages.push({
        role: typeof item.role === 'string' ? item.role : 'user',
        content: item.content,
      });
    }

    // Assign generation parameters
    if (!cacheMode) {
      /**
       * @param {number|null} val
       * @param {string} key
       */
      const setIfNumber = (val, key) => {
        // @ts-ignore
        if (typeof val === 'number') requestBody[key] = val;
      };
      setIfNumber(tinyOpenAI.getMaxOutputTokens(), 'max_tokens');
      setIfNumber(tinyOpenAI.getTemperature(), 'temperature');
      setIfNumber(tinyOpenAI.getTopP(), 'top_p');
      setIfNumber(tinyOpenAI.getTopK(), 'top_k');
      setIfNumber(tinyOpenAI.getPresencePenalty(), 'presence_penalty');
      setIfNumber(tinyOpenAI.getFrequencyPenalty(), 'frequency_penalty');
    }

    return requestBody;
  };

  /**
   * Internal method integrating with OpenAI API (generateContent or stream).
   */
  tinyOpenAI._setGenContent(
    /**
     * @param {string} apiKey
     * @param {boolean} isStream
     * @param {any} data
     * @param {string} model
     * @param {function} streamingCallback
     * @param {AbortController} controller
     * @returns {any}
     */
    (apiKey, isStream, data, model, streamingCallback, controller) =>
      new Promise((resolve, reject) => {
        const requestBody = requestBuilder(data, { model });
        requestBody.stream = isStream;

        /**
         * Parses token usage metadata from the result.
         *
         * @param {*} result - The API response containing usageMetadata.
         * @returns {[{ count: { candidates: null|number; prompt: null|number; total: null|number; }; }, boolean]} Tuple of metadata object and whether an error occurred.
         */
        const buildUsageMetada = (result) => {
          const usageMetadata = { count: { candidates: null, prompt: null, total: null } };
          if (result.usage) {
            if (typeof result.usage.completion_tokens === 'number')
              usageMetadata.count.candidates = result.usage.completion_tokens;
            if (typeof result.usage.prompt_tokens === 'number')
              usageMetadata.count.prompt = result.usage.prompt_tokens;
            if (typeof result.usage.total_tokens === 'number')
              usageMetadata.count.total = result.usage.total_tokens;
            return [usageMetadata, false];
          }
          return [usageMetadata, true];
        };

        /**
         * Parses and appends content candidates to the final output object.
         *
         * @param {ObjectAny} result - API response chunk or full response.
         * @param {ObjectAny} finalData - Structure to map the content into.
         */
        const buildContent = (result, finalData) => {
          if (!Array.isArray(result.choices)) return;
          for (const item of result.choices) {
            const messageObj = item.message || item.delta || {};
            const text = messageObj.content || '';
            const role = messageObj.role || 'assistant';
            const finishReason =
              typeof item.finish_reason === 'string' ? item.finish_reason : undefined;

            if (text || finishReason) {
              finalData.contents.push({ role, content: text, finishReason });
            }
          }
        };

        /**
         * Finalizes the promise resolving standard JSON data.
         *
         * @param {ObjectAny} result - Parsed API response.
         * @returns {ObjectAny} Structured final object.
         */
        const finalPromise = (result) => {
          /** @type {ObjectAny} */
          const finalData = { _response: result, contents: [] };
          if (!result.error) {
            finalData.modelVersion = typeof result.model === 'string' ? result.model : null;
            finalData.tokenUsage = buildUsageMetada(result)[0];
            buildContent(result, finalData);
          } else {
            buildErrorData(result, finalData);
          }
          return finalData;
        };

        /**
         * Handles Server-Sent Events (SSE) streaming format.
         *
         * @async
         * @param {ReadableStream} stream - The fetch body stream.
         */
        const streamingResponse = async (stream) => {
          try {
            const reader = stream.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;
            let buffer = '';
            let streamResult = {};
            const streamCache = [];

            while (!done) {
              const { value, done: streamDone } = await reader.read();
              done = streamDone;
              if (value) {
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                // @ts-ignore
                buffer = lines.pop(); // Keep incomplete chunk in buffer

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith('data: ')) continue;

                  const jsonStr = trimmed.slice(6).trim();
                  if (jsonStr === '[DONE]') {
                    done = true;
                    break;
                  }

                  try {
                    const chunkData = JSON.parse(jsonStr);
                    streamResult = chunkData; // Store latest to grab model info

                    /** @type {{ contents: AIContentData[] }} */
                    const tinyData = { contents: [] };
                    buildContent(chunkData, tinyData);

                    for (let i = 0; i < tinyData.contents.length; i++) {
                      if (!streamCache[i])
                        streamCache[i] = { content: '', role: tinyData.contents[i].role };
                      streamCache[i].content += tinyData.contents[i].content || '';
                      tinyData.contents[i].content = streamCache[i].content;
                    }

                    streamingCallback({ contents: tinyData.contents, done: false });
                  } catch (err) {
                    console.warn('[OpenAI-Compatible] Stream parse error:', err);
                  }
                }
              }
            }

            streamingCallback({ done: true });

            // Construct the final resolved object replicating the non-stream format
            const finalData = finalPromise(streamResult);
            for (let i = 0; i < finalData.contents.length; i++) {
              if (streamCache[i]) finalData.contents[i].content = streamCache[i].content;
            }
            resolve(finalData);
          } catch (err) {
            reject(err);
          }
        };

        const fetchRequest = fetch(`${apiUrl}/chat/completions`, {
          signal: controller?.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        fetchRequest
          .then((res) => {
            if (!isStream) {
              res
                .json()
                .then((result) => resolve(finalPromise(result)))
                .catch(reject);
            } else {
              if (!res.body) reject(new Error('No AI streaming value found.'));
              else if (!res.ok)
                reject(
                  new Error(
                    `Error HTTP ${res.status}: ${res.statusText || errorCodes[res.status] || 'Unknown Error'}`,
                  ),
                );
              else streamingResponse(res.body);
            }
          })
          .catch(reject);
      }),
  );

  /**
   * Registers a function to fetch and organize available models.
   */
  tinyOpenAI._setGetModels(
    /**
     * @param {string} apiKey
     * @returns {any}
     */
    (apiKey) =>
      new Promise((resolve, reject) => {
        fetch(`${apiUrl}/models`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            const finalData = { _response: result, newData: [] };
            if (!result.error && Array.isArray(result.data)) {
              for (let i = 0; i < result.data.length; i++) {
                const modelInfo = result.data[i];
                const inserted = tinyOpenAI._insertNewModel({
                  _response: modelInfo,
                  index: i,
                  name: modelInfo.id,
                  id: modelInfo.id,
                  displayName: modelInfo.id,
                  version: undefined,
                  description: modelInfo.owned_by || 'Local Model',
                });
                // @ts-ignore
                if (inserted) finalData.newData.push(inserted);
              }
            } else {
              buildErrorData(result, finalData);
            }
            resolve(finalData);
          })
          .catch(reject);
      }),
  );

  /**
   * Mock for token counting, as standard OpenAI-compatible APIs usually lack a `/v1/tokens` endpoint.
   */
  tinyOpenAI._setCountTokens(
    () =>
      new Promise((resolve) => {
        resolve({
          _response: { note: 'Token counting not natively supported via /v1/models.' },
          totalTokens: null,
          cachedContentTokenCount: null,
        });
      }),
  );

  return tinyOpenAI;
}

/**
 * Creates and configures a new TinyAiInstance2 set up for OpenAI-compatible APIs.
 *
 * @class
 * @extends TinyAiInstance2
 */
class TinyOpenAiCompatible extends TinyAiInstance2 {
  /**
   * @param {string} apiUrl - The base API URL.
   * @param {string} [API_KEY='lm-studio'] - The API key.
   * @param {string} [MODEL_DATA='local-model'] - The default model.
   * @param {boolean} [isSingle=false] - Configure for a single session only.
   */
  constructor(apiUrl, API_KEY = 'lm-studio', MODEL_DATA = 'local-model', isSingle = false) {
    super(isSingle);
    setTinyOpenAiCompatible(this, apiUrl, API_KEY, MODEL_DATA);
  }
}

export { TinyOpenAiCompatible };
