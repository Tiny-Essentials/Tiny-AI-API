
### `_setNextModelsPageToken(nextModelsPageToken)`

Sets the token used to fetch the next page of models in the AI session.

#### Parameters

| Name                  | Type     | Description                                           |
|-----------------------|----------|-------------------------------------------------------|
| `nextModelsPageToken` | `string` | The token representing the next page of model results. |

#### Returns

- **`void`** – This method does not return a value.

#### Behavior

- Updates the internal `_nextModelsPageToken` property with the provided token if it is a string.
- If the value is not a string, it sets `_nextModelsPageToken` to `null`.

#### Example

```js
session._setNextModelsPageToken("eyJwYWdlIjoxfQ==");
```

> **Note:** This token is used automatically in `getModels()` if no token is explicitly passed.

---

### `_setGetModels(getModels)`

This method sets a custom function to fetch the list of models from an API. The function you provide will handle the process of fetching models and returning the necessary data.

#### Parameters

| Name       | Type        | Description                                                       |
|------------|-------------|-------------------------------------------------------------------|
| `getModels`| `Function`  | The function that will fetch model data. It should return a promise with model information. |

#### Example of Implementation

```js
// Example of how to use _setGetModels
aiSession._setGetModels(
  (apiKey, pageSize, pageToken) => {
    return new Promise((resolve, reject) => {
      // Simulate an API request to fetch model data
      fetch(`https://api.example.com/models?key=${apiKey}&pageSize=${pageSize}&pageToken=${pageToken}`)
        .then(response => response.json())
        .then(result => {
          if (result.error) {
            reject("Error fetching models");
          } else {
            // Simulate filtering and categorizing models
            const models = result.models.map(model => ({
              id: model.id,
              name: model.name,
              category: model.category,
              version: model.version,
            }));
            resolve(models);
          }
        })
        .catch(reject);
    });
  }
);
```

#### Explanation:

- **`getModels` function**: This function you define will handle fetching model data from an external source (like an API). It should accept parameters such as `apiKey`, `pageSize`, and `pageToken`, and return a promise with the result.

- **Promise**: The `getModels` function uses a promise (`new Promise()`) to handle the asynchronous nature of an API call. It resolves with the model data or rejects with an error.

#### What the function does:

1. **Sets the `getModels` function**: This lets you define the custom logic for retrieving the list of available models. You can fetch this data from an API and format it as needed.
  
2. **Simulate fetching model data**: The example shows how the `fetch` function can be used to get model data from an API and process it into a simpler format.

3. **Returns model data**: After fetching and processing the models, the function returns the formatted data, including details like `id`, `name`, `category`, and `version`.

#### Returns

| Type      | Description                                                       |
|-----------|-------------------------------------------------------------------|
| `void`    | This method does not return a value directly. It sets the function for fetching models. |

---

### `_insertNewModel(model)`

Inserts a new model into the AI session's models list. If the model already exists, it will not be inserted again.

#### Parameters

| Name                               | Type          | Description                                                                          |
|------------------------------------|---------------|--------------------------------------------------------------------------------------|
| `model`                            | `Object`      | The model to insert.                                                                  |
| `model.id`                         | `string`      | The unique identifier for the model.                                                 |
| `model.name`                       | `string`      | The name of the model (optional).                                                    |
| `model.displayName`                | `string`      | The display name of the model (optional).                                             |
| `model.version`                    | `string`      | The version of the model (optional).                                                 |
| `model.description`                | `string`      | A description of the model (optional).                                               |
| `model.inputTokenLimit`            | `number`      | The input token limit for the model (optional).                                       |
| `model.outputTokenLimit`           | `number`      | The output token limit for the model (optional).                                      |
| `model.temperature`                | `number`      | The temperature setting for the model (optional).                                     |
| `model.topP`                       | `number`      | The top P setting for the model (optional).                                          |
| `model.topK`                       | `number`      | The top K setting for the model (optional).                                          |
| `model.supportedGenerationMethods` | `Array<string>`| The generation methods supported by the model (optional).                           |
| `model.category`                   | `Object`      | The category of the model (optional).                                                |
| `model.category.id`                | `string`      | The unique identifier for the category.                                              |
| `model.category.displayName`       | `string`      | The display name of the category.                                                    |
| `model.category.index`             | `number`      | The index of the category.                                                           |

#### Returns

| Type     | Description                                                               |
|----------|---------------------------------------------------------------------------|
| `Object` | The inserted model data if the model was successfully added, or `null` if the model already exists. |

#### Example

```js
const newModel = {
  id: 'modelId123',
  name: 'AI Model 1',
  displayName: 'AI Model One',
  version: 'v1.0',
  description: 'An AI model designed for specific tasks.',
  inputTokenLimit: 1000,
  outputTokenLimit: 500,
  temperature: 0.7,
  topP: 0.9,
  topK: 50,
  supportedGenerationMethods: ['text', 'image'],
  category: {
    id: 'categoryId1',
    displayName: 'Category One',
    index: 0,
  },
};

const insertedModel = session._insertNewModel(newModel);
console.log(insertedModel);
```

---

### `_setCountTokens(countTokens)`

Sets a function to handle the count of tokens in the AI session. If a valid function is provided, it will be used to count tokens.

#### Parameters

| Name         | Type        | Description                                                                            |
|--------------|-------------|----------------------------------------------------------------------------------------|
| `countTokens`| `Function`  | The function that will handle the token count. This function will be called to count tokens. |

#### Throws

| Error Type | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `Error`    | Throws an error if the provided value is not a function.                    |

#### Returns

| Type     | Description                                                             |
|----------|-------------------------------------------------------------------------|
| `void`   | This function does not return a value.                                  |

#### Example

```js
// Example of a token counting function
const countTokens = (text) => {
  return text.split(' ').length;  // Simple token count based on spaces
};

// Set the function to count tokens
session._setCountTokens(countTokens);

// Now you can use the function to count tokens
const tokens = session.#_countTokens("This is a sample sentence.");
console.log(tokens);  // Output: 5
```

---

### `_setCountTokens(countTokens)`

This method sets a custom function to handle token counting for an AI session. The function you provide will be responsible for counting tokens, and it must return a promise that resolves with the token count data.

#### Parameters

| Name         | Type        | Description                                                            |
|--------------|-------------|------------------------------------------------------------------------|
| `countTokens`| `Function`  | The function that will count the tokens. It should return a promise resolving with token count information. |

#### Example of Implementation

```js
// Example of how to use _setCountTokens
aiSession._setCountTokens(
  (apiKey, model, requestData) => {
    return new Promise((resolve, reject) => {
      // Simulate an API request to count tokens
      const tokenData = { totalTokens: 1000, promptTokens: 500 }; // Example response data

      // If the API call is successful, resolve the data
      resolve(tokenData);
      
      // If something goes wrong, reject the promise with an error
      // reject("Error counting tokens");
    });
  }
);
```

#### Explanation:

- **`countTokens` function**: This is a function that you define. It will count the tokens used in an AI session. It should take necessary parameters like `apiKey`, `model`, and `requestData` (or any other data needed) and return a promise. The promise should resolve with an object containing token count information.

- **Promise**: The function you provide will use a promise (`new Promise()`) to simulate asynchronous behavior. This allows the AI session to wait for the token count result before continuing.

#### What the function does:

1. **Sets the `countTokens` function**: It allows you to define how the token count is performed for the AI session.
2. **Asynchronous behavior**: The `countTokens` function can perform tasks such as making API calls to get token data, and it needs to return a promise that resolves with the result.
3. **Token Count Data**: The returned data can include things like the total number of tokens, prompt tokens, and any other token-related information.

#### Returns

| Type     | Description                                                            |
|----------|------------------------------------------------------------------------|
| `void`   | This method does not return any value directly. It just sets the function for token counting. |

---

### `_setErrorCodes(errors)`

This method allows you to define custom error codes for a session. Error codes help in identifying the reasons behind specific failures or issues during the session. You can set a list of predefined error codes with descriptions, so the program knows how to handle or display them when needed.

#### Parameters

| Name   | Type     | Description                                                                 |
|--------|----------|-----------------------------------------------------------------------------|
| `errors`| `Object` | An object containing key-value pairs where keys are error codes and values are error descriptions. |

#### Example of Execution

```js
// Set custom error codes for the session
tinyAi._setErrorCodes({
  FINISH_REASON_UNSPECIFIED: { text: 'Default value. This value is unused.' },
  STOP: { text: 'Natural stop point of the model or provided stop sequence.', hide: true },
  MAX_TOKENS: { text: 'The maximum number of tokens as specified in the request was reached.' },
  SAFETY: { text: 'The response candidate content was flagged for safety reasons.' },
  RECITATION: { text: 'The response candidate content was flagged for recitation reasons.' },
  LANGUAGE: { text: 'The response candidate content was flagged for using an unsupported language.' },
  OTHER: { text: 'Unknown reason.' },
  BLOCKLIST: { text: 'Token generation stopped because the content contains forbidden terms.' },
  PROHIBITED_CONTENT: { text: 'Token generation stopped for potentially containing prohibited content.' },
  SPII: { text: 'Token generation stopped because the content potentially contains Sensitive Personally Identifiable Information (SPII).' },
  MALFORMED_FUNCTION_CALL: { text: 'The function call generated by the model is invalid.' },
  IMAGE_SAFETY: { text: 'Token generation stopped because generated images contain safety violations.' },
});
```

#### Explanation:

- **Error Codes Object**: This object contains multiple error codes (e.g., `STOP`, `MAX_TOKENS`, etc.) and their associated descriptions. These descriptions help explain the reason for the error.
  
- **Setting Error Codes**: When you call `_setErrorCodes`, you're telling the system how to handle specific errors by defining them in a structured way.

- **Error Details**: Each error code has a `text` field, which explains the reason for the error. Some error codes might also include other attributes, like `hide`, which can control whether the error is shown or not.

#### Example Scenario:

- If the model hits the maximum token limit, the error code `MAX_TOKENS` will be set, and the corresponding message `The maximum number of tokens as specified in the request was reached.` will be used to explain the issue.
  
- The `STOP` error might be triggered when the model naturally reaches the end of its generation, or a stop sequence is provided.

#### Returns

| Type      | Description                                                       |
|-----------|-------------------------------------------------------------------|
| `void`    | This method does not return anything. It simply sets the error codes for use in the session. |

---

### Why It’s Useful:

- **Clear Error Management**: This method ensures that all possible errors have clear definitions, so the program knows how to respond or display appropriate error messages.
  
- **Easier Debugging**: By defining error codes with descriptions, developers can easily understand why an error occurred and how to handle it.

---

### `_setGenContent(callback)`

This method allows you to define a custom callback function that will handle content generation. It's used to set up how the AI should generate or stream content when requested. 

#### Parameters

| Name      | Type       | Description |
|-----------|------------|-------------|
| `callback`| `Function` | A function that will handle the content generation process. It will be passed several parameters and should return a `Promise`. |

#### Simplified Explanation

- This method accepts a function (callback) that takes care of generating content for the AI. 
- The function will be called during the AI session whenever content needs to be generated, and it should handle the logic for making a request to the API, processing the response, and sending the result back.

#### Example of Usage:

Here's a simplified example that shows how you can use `_setGenContent`:

```js
tinyAi._setGenContent(
  (apiKey, isStream, data, model, streamingCallback, controller) =>
    new Promise((resolve, reject) => {
      // Build the request body using the provided data
      const requestBody = requestBuilder(data);

      // Handle the response from the API
      const handleResponse = (result) => {
        const finalData = { _response: result };

        if (!result.error) {
          finalData.contents = [];
          finalData.modelVersion = result.modelVersion || null;
          
          // Token Usage metadata
          const [tokenUsage] = buildUsageMetadata(result);
          finalData.tokenUsage = tokenUsage;

          // Process the content
          if (result.candidates) {
            for (const item of result.candidates) {
              if (item.content) {
                tinyAi.buildContents(finalData.contents, item.content, item.content.role);
              }
            }
          }
        }

        return finalData;
      };

      // Handle streaming responses
      const streamingResponse = async (stream) => {
        try {
          const reader = stream.getReader();
          const decoder = new TextDecoder('utf-8');
          let done = false;
          
          while (!done) {
            const readerData = await reader.read();
            const { value, done: streamDone } = readerData;
            done = streamDone;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const cleanedJson = jsonrepair(chunk.trim());
              const jsonChunk = JSON.parse(cleanedJson);

              for (const result of jsonChunk) {
                const tinyData = { contents: [] };
                buildContent(result, tinyData);
                streamingCallback({ contents: tinyData.contents, done: false });
              }
            }
          }
          
          // Complete the streaming
          streamingCallback({ done: true });
          resolve(handleResponse(streamResult));
        } catch (err) {
          reject(err);
        }
      };

      // Make the API request
      fetch(
        `${apiUrl}/models/${model}:${!isStream ? 'generateContent' : 'streamGenerateContent'}?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller ? controller.signal : undefined,
        }
      )
      .then((res) => {
        if (!isStream) {
          res.json().then((result) => resolve(handleResponse(result))).catch(reject);
        } else {
          if (!res.body) reject(new Error('No AI streaming value found.'));
          else streamingResponse(res.body);
        }
      })
      .catch(reject);
    })
);
```

#### Key Parts of the Example:

1. **Request Body**: 
   - The function begins by creating the request body using the provided `data` with a helper function (`requestBuilder`).

2. **Handling API Response**: 
   - The `handleResponse` function processes the result from the API, building content and collecting metadata.

3. **Streaming**: 
   - If the content is being streamed (e.g., large responses), the function handles the streaming process and sends data chunks to `streamingCallback` as they arrive.

4. **Error Handling**: 
   - If something goes wrong (like a network error), it gets caught and handled in the `.catch()` block.

#### What Happens After `_setGenContent` Is Called?

- The AI system will use the custom callback you provided whenever it needs to generate or stream content.
- Your callback is in charge of making the request to the AI API, processing the response, and passing the result back.

---

### Simplified Overview

- **What It Does**: This method lets you define how the AI will generate or stream content. You set up a function (`callback`) to handle that process, from requesting data to processing the result.
  
- **When to Use**: Use this method when you need to define the content generation behavior for your AI system, especially if you're dealing with custom API calls or need to handle streaming data.
