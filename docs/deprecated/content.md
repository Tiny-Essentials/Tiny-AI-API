### `buildContents(contents, item, role, rmFinishReason = false)`

Builds a content object compatible with an AI session, optionally inserting it into an external array.

#### Parameters

| Name              | Type      | Default         | Description                                                                 |
|-------------------|-----------|------------------|-----------------------------------------------------------------------------|
| `contents`        | `Array`   | `undefined`      | An optional array to which the constructed content object will be pushed.  |
| `item`            | `Object`  | **(required)**   | An object that contains either `parts` (array of content) or a `content` object. |
| `role`            | `string`  | `undefined`      | Optional role to associate with the message (e.g., `"user"`, `"assistant"`). |
| `rmFinishReason`  | `boolean` | `false`          | If set to `true`, removes the `finishReason` field from the result.        |

#### Returns

- **`Object`**: The constructed content object, if `contents` is not an array.
- **`undefined`**: If the `contents` parameter is an array, the method pushes to the array and returns `undefined`.

#### Behavior

- Constructs a content object with validated parts using internal `#_partTypes`.
- Includes a `role` if provided.
- Includes a `finishReason` field unless `rmFinishReason` is explicitly `true`.
- Supports both `item.parts` as an array or a singular `item.content` object.

#### Example

```js
const message = session.buildContents(null, {
  parts: [{ text: "Hello!" }],
  finishReason: "stop"
}, "user");
```

> **Note:** This method is flexible for both single and batched usage. If `contents` is provided as an array, it's assumed you are accumulating multiple content objects for submission.

### `countTokens(data, model, controller)`

Counts tokens by sending a request to an external API, processing the response, and returning relevant token data. If the function isn't set or the request fails, an error is thrown.

#### Key Details

- **Request Logic:**  
  The method sends a POST request to an external API using the `fetch` function, passing the necessary `apiKey` and `model`. It also serializes the `dataContent` to be used in the request body.

- **Response Handling:**  
  The response from the API is processed to extract several pieces of token information, such as:
  - **Total Tokens:** The total number of tokens used.
  - **Cached Content Token Count:** The token count for any cached content.
  - **Prompt Token Details:** Information about tokens used in the prompt (e.g., modality and token count).

- **Error Handling:**  
  If the API returns an error, it uses the `buildErrorData` function to capture and handle the error appropriately.

- **Promise Usage:**  
  Since the request is asynchronous, the method returns a `Promise` which resolves with the token data once the response is successfully received. If any error occurs during the request, it rejects the promise.

#### Parameters

| Name        | Type        | Description                                                                        |
|-------------|-------------|------------------------------------------------------------------------------------|
| `data`      | `Object`    | The data that needs to be tokenized.                                               |
| `model`     | `string`    | The model to use for counting tokens.                                              |
| `controller`| `Object`    | The controller for managing cancellation signals and controlling the fetch request. |

#### Throws

| Error Type | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `Error`    | If no function is set to count tokens, or if the request fails.              |

#### Returns

| Type     | Description                                                                |
|----------|--------------------------------------------------------------------------|
| `Object` | The count of tokens, including `totalTokens`, `cachedContentTokenCount`, and `promptTokensDetails`. |

#### Example

```js
// Set the function to count tokens
tinyAi._setCountTokens(
  (apiKey, model, controller, data) => 
    new Promise((resolve, reject) => {
      const dataContent = requestBuilder(data);  // Prepares data for the request
      const modelInfo = tinyAi.getModelData(model);  // Retrieves model data
      dataContent.model = modelInfo?.name;  // Adds model name to request
      
      // Check if contents are available to process
      if (Array.isArray(dataContent.contents) && dataContent.contents.length > 0) {
        fetch(`${apiUrl}/models/${model}:countTokens?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ generateContentRequest: dataContent }),
          signal: controller ? controller.signal : undefined,
        })
          .then((res) => res.json())  // Parse JSON response
          .then((result) => {
            const finalData = { _response: result };
            
            // Handle the successful response
            if (!result.error) {
              finalData.totalTokens = result.totalTokens || null;
              finalData.cachedContentTokenCount = result.cachedContentTokenCount || null;
              finalData.promptTokensDetails = result.promptTokensDetails || {};
            } else {
              // Handle errors
              buildErrorData(result, finalData);
            }

            resolve(finalData);  // Resolve the promise with the final token data
          })
          .catch(reject);  // Reject promise on error
      } else {
        resolve({ _response: {}, totalTokens: null, cachedContentTokenCount: null });
      }
    })
);

// Example call:
const tokenData = tinyAi.countTokens(data, model, controller);
console.log(tokenData);
```

---

### `getErrorCode(code)`

This function retrieves error details based on the provided error code. It checks if there is any error data associated with the code and returns a structured object with the error message. If no error is found, it returns `null`.

#### Key Details

- **Error Lookup:**
  - The method first checks if the `_errorCode` object exists.
  - It looks for the provided error `code` within the `_errorCode` object.
  
- **Error Data Handling:**
  - If the error data exists and is a string, it returns an object with the `text` key containing the error message.
  - If the error data is an object and contains a `text` property, it returns that object.

- **Return Value:**
  - Returns an object containing the error message if found.
  - If no error is found for the provided code, it returns `null`.

#### Parameters

| Name  | Type          | Description                                          |
|-------|---------------|------------------------------------------------------|
| `code`| `string|number` | The error code to look up in the `_errorCode` object. |

#### Returns

| Type     | Description                                                    |
|----------|---------------------------------------------------------------|
| `Object` | An object containing the error message in the `text` property, or `null` if the error is not found. |

#### Example

```js
// Example error code lookup
const errorDetails = tinyAi.getErrorCode(404);
console.log(errorDetails);  // Output: { text: 'Not Found' }

// Example with a custom error object
const customErrorDetails = tinyAi.getErrorCode('SERVER_ERROR');
console.log(customErrorDetails);  // Output: { text: 'Internal Server Error' }
```

---

### `genContent(data, model, controller, streamCallback)`

This function is responsible for generating content through a content generation API. It checks whether the content generation function (`#_genContentApi`) has been defined and then calls it to handle the actual API interaction.

#### What Happens Inside:
1. **API Function Check:**
   - The function first checks if `#_genContentApi` is a defined function. If it is, it calls this function to generate content using the provided parameters.
   - If `#_genContentApi` is not defined, it throws an error, indicating that no content generation API script has been set up.

2. **Parameters:**
   - **`data`**: The content generation input data (this could be a prompt or specific details for the API).
   - **`model`**: Specifies which model to use for content generation (optional, defaults to a predefined model if not provided).
   - **`controller`**: A controller object that may be used to manage the content generation process (e.g., for cancellation or timeouts).
   - **`streamCallback`**: An optional callback function that handles streaming content if the API supports it.

3. **Calling the Internal API Function:**
   - If the API function exists, it is invoked with the following parameters:
     - API key (`this.#_apiKey`)
     - Streaming flag (`true/false`)
     - The data provided (`data`)
     - Model to use (either provided or default)
     - Stream callback function (if provided)
     - Controller (if provided)
   - If no API script is defined, an error is thrown.

### Setting the Content Generation Function:

The actual content generation function is set using `._setGenContent()`. This function defines how the API request will be made, handles both streaming and non-streaming responses, and processes the results.

1. **Request Handling:**
   - A `Promise` is returned to handle the asynchronous request.
   - The `requestBody` is created by calling `requestBuilder(data)`, which structures the provided data according to the API's expectations.

2. **Usage Metadata:**
   - The function defines a helper method `buildUsageMetada(result)` to process the token usage metadata returned by the API. This includes counting tokens for candidates, prompts, and totals.
   - If the metadata is missing, an error is logged.

3. **Content Construction:**
   - `buildContent(result, finalData)` processes the response to extract relevant content from the API response (typically from the `candidates` field), and adds it to the `finalData.contents` array.
   - It also adds a "finish reason" (if available) to the content items.

4. **Streaming Response:**
   - If the request is for streaming, the `streamingResponse` function is used to handle the streamed data in real-time.
   - The response is read in chunks using a `TextDecoder`, and each chunk is processed as JSON. Each chunk is passed to the `streamingCallback` for handling as it arrives.
   - Streaming continues until all data has been received.

5. **Final Data Processing:**
   - Once the streaming is complete (or if the request is non-streaming), the final data is processed:
     - `finalData` is populated with content and token usage metadata.
     - If an error occurred, error data is processed instead.

6. **Making the Request:**
   - The function makes a `fetch` request to the API endpoint, either for generating content normally or for streaming.
   - The request uses the `POST` method and includes the `requestBody` in the payload as JSON.
   - If the request is for streaming, it is processed through `streamingResponse`.

7. **Error Handling:**
   - There is comprehensive error handling throughout, including:
     - If the API response is invalid or contains errors.
     - If the request fails (either in streaming or non-streaming cases).
     - Specific messages are logged for debugging.

### Summary:

- The `genContent` function is a wrapper for generating content through an external API.
- The function checks if the necessary API function (`#_genContentApi`) is available, then calls it to initiate the content generation process.
- It handles both normal and streaming content generation, processing API responses and building the final data accordingly.
- The `streamingCallback` allows real-time handling of streamed content as it arrives.

---

### `getData(id)`

This method retrieves the stored data for a specific session ID. If no `id` is passed, it uses the currently selected session ID.

---

#### Purpose

To **access session-specific data** from the internal `history` store, either by a given ID or by the currently active session.

---

#### Parameters

| Name | Type     | Optional | Description                                                                 |
|------|----------|----------|-----------------------------------------------------------------------------|
| `id` | `string` | Yes      | A specific session ID to fetch data for. If omitted, defaults to the selected session. |

---

#### Behavior

- Calls `getId(id)` to resolve the correct session ID:
  - Returns the given `id` if valid and in multi-session mode.
  - Otherwise, falls back to `this.#_selectedHistory`.
- Returns the corresponding entry in `this.history` or `null` if not found.

---

#### Returns

| Type        | Description                                                         |
|-------------|---------------------------------------------------------------------|
| `Object|null` | The data associated with the resolved session ID, or `null` if it doesn't exist. |

---

#### Example Usage

```js
// Returns data for a specific ID
const sessionData = tinyAi.getData("session_abc");

// Returns data for currently selected session
const currentData = tinyAi.getData();
```

---

#### Note

This method is commonly used internally when accessing session content like messages, token counts, or metadata tied to a specific conversation. It ensures consistent session resolution by relying on `getId(id)`.

---

### `getTotalTokens(id)`

This method calculates the **total number of tokens** used in a specific or currently selected session.

---

#### Purpose

To **aggregate all token counts** stored in the `tokens` object of a session, including:
- Per-message tokens (`tokens.data`)
- Other numeric token values in `tokens` (e.g. summary, cached count)

---

#### Parameters

| Name | Type     | Optional | Description                                                                 |
|------|----------|----------|-----------------------------------------------------------------------------|
| `id` | `string` | Yes      | A specific session ID. If omitted, the method uses the currently selected session. |

---

#### Behavior

1. Calls `getData(id)` to resolve the session history.
2. If session exists:
   - Iterates over `history.tokens.data[]`, adding each `count` value.
   - Then checks every property in `history.tokens` (besides `.data`) and adds numeric values.
3. Returns the total count or `null` if no session was found.

---

#### Returns

| Type         | Description                                                 |
|--------------|-------------------------------------------------------------|
| `number|null` | The total token count for the session, or `null` if unavailable. |

---

#### Example Structure Assumed

```js
{
  tokens: {
    data: [
      { count: 56 },
      { count: 72 },
      ...
    ],
    cachedContentTokenCount: 12,
    summary: 8
  }
}
```

---

#### Example Usage

```js
const total = tinyAi.getTotalTokens("session_456");
// e.g., returns 148 (from data) + 12 + 8 = 168

const currentTotal = tinyAi.getTotalTokens();
// Returns total tokens of currently selected session
```

---

#### Notes

- It’s a hybrid aggregation — combines **array entries (`tokens.data`)** and **top-level numeric fields** inside the `tokens` object.
- Will gracefully return `null` if the session doesn’t exist or lacks token data.

---

### `getMsgTokensByIndex(msgIndex, id)`

This method retrieves **token data for a specific message** in a session history based on its index.

---

#### Purpose

To return a single entry from the `tokens.data[]` array of a session, which typically contains token analysis per message.

---

#### Parameters

| Name        | Type     | Required | Description                                                                 |
|-------------|----------|----------|-----------------------------------------------------------------------------|
| `msgIndex`  | `number` | Yes      | The index of the message whose token data you want to retrieve.            |
| `id`        | `string` | No       | Optional session ID. Uses the currently selected session if omitted.       |

---

#### Behavior

1. Calls `getData(id)` to access session history.
2. Verifies that the message index exists using `indexExists(msgIndex, id)`.
3. If it exists, returns the token data at `tokens.data[msgIndex]`.

---

#### Returns

| Type         | Description                                                           |
|--------------|-----------------------------------------------------------------------|
| `Object|null` | The token data for the message at the given index, or `null` if not found. |

---

#### Example Token Data

```js
{
  count: 87
}
```

---

#### Example Usage

```js
const tokenInfo = tinyAi.getMsgTokensByIndex(3, "session_123");
// Might return: { count: 87 }

const currentTokenInfo = tinyAi.getMsgTokensByIndex(2);
// Uses currently selected session
```

---

#### Notes

- Assumes that token data **was previously added** using `addData(...)` or another internal method.
- This method **does not compute or update token counts**, only retrieves what was stored.

---

### `getMsgTokensById(msgId, id)`

This method retrieves **token data for a specific message**, identified by its unique `msgId`, within a given or currently selected session.

---

#### Purpose

To provide access to token analysis (like token count, type, modality) for a specific message in the history, based on its message ID rather than its index.

---

#### Parameters

| Name      | Type     | Required | Description                                                                      |
|-----------|----------|----------|----------------------------------------------------------------------------------|
| `msgId`   | `string` | Yes      | The unique message ID you want to fetch token data for.                         |
| `id`      | `string` | No       | Optional session ID. Uses the currently selected session if not provided.       |

---

#### Core Logic

```js
const history = this.getData(id);
if (history) {
  const msgIndex = this.getIndexOfId(msgId);
  if (msgIndex > -1)
    return history.tokens.data[msgIndex];
}
return null;
```

- `getData(id)` retrieves the session history object.
- `getIndexOfId(msgId)` returns the index of the message with that ID.
- Returns token data at that index if valid.

---

#### Returns

| Type         | Description                                                             |
|--------------|-------------------------------------------------------------------------|
| `Object|null` | Token data of the message with the given ID, or `null` if not found.   |

---

#### Example Token Object

```js
{
  count: 64
}
```

---

#### Example Usage

```js
const tokens = tinyAi.getMsgTokensById("msg_890", "session_001");
// Might return: { count: 64 }
```

---

#### Notes

- It **does not calculate token counts**, just accesses the token metadata already stored.
- Useful for internal features like detailed analytics, audits, or debugging specific message performance.

---

### `getMsgHashByIndex(msgIndex, id)`

This method retrieves the **hash value of a specific message** from the session history using its **index**.

---

#### Purpose

To fetch the hash of a message at a given index in the session history. Hash values are typically used for integrity checks, verification, or ensuring that message data has not been altered.

---

#### Parameters

| Name      | Type     | Required | Description                                                                      |
|-----------|----------|----------|----------------------------------------------------------------------------------|
| `msgIndex`| `number` | Yes      | The index of the message in the session history whose hash is to be retrieved.   |
| `id`      | `string` | No       | Optional session ID. If not provided, the currently selected session is used.    |

---

#### Core Logic

```js
const history = this.getData(id);
if (history) {
  const existsIndex = this.indexExists(msgIndex, id);
  if (existsIndex) return history.hash.data[msgIndex];
}
return null;
```

- `getData(id)` retrieves the session history.
- `indexExists(msgIndex, id)` checks if the provided index exists within the history.
- If the index is valid, the corresponding hash value is returned from the `history.hash.data` array.

---

#### Returns

| Type         | Description                                                             |
|--------------|-------------------------------------------------------------------------|
| `string|null` | The hash of the message at the specified index, or `null` if invalid.  |

---

#### Example Usage

```js
const hash = tinyAi.getMsgHashByIndex(2, "session_001");
// Might return: "ab123c456d789fgh1234567890abcdef"
```

---

#### Notes

- The method does not generate a hash; it **retrieves** it from pre-existing data stored during previous sessions.
- Useful for verifying the integrity or identity of a message during debugging or data synchronization tasks.

---

### `getMsgHashById(msgId, id)`

This method retrieves the **hash value of a specific message** from the session history using its **message ID**.

---

#### Purpose

To fetch the **hash of a message** by its unique **message ID** from the session history. The hash can be used for verifying message integrity, checksums, or ensuring consistency in data.

---

#### Parameters

| Name      | Type     | Required | Description                                                                 |
|-----------|----------|----------|-----------------------------------------------------------------------------|
| `msgId`   | `string` | Yes      | The unique identifier of the message whose hash is to be retrieved.         |
| `id`      | `string` | No       | Optional session ID. If not provided, the currently selected session is used. |

---

#### Core Logic

```js
const history = this.getData(id);
if (history) {
  const msgIndex = this.getIndexOfId(msgId);
  if (msgIndex > -1) return history.hash.data[msgIndex];
}
return null;
```

- `getData(id)` retrieves the session history data.
- `getIndexOfId(msgId)` finds the index of the message with the given ID in the session's data.
- If the message ID is valid (i.e., it exists in the session), it returns the corresponding hash from `history.hash.data`.

---

#### Returns

| Type         | Description                                                              |
|--------------|--------------------------------------------------------------------------|
| `string|null` | The hash value of the message with the specified ID, or `null` if not found. |

---

#### Example Usage

```js
const hash = tinyAi.getMsgHashById("msg123", "session_001");
// Might return: "ab123c456d789fgh1234567890abcdef"
```

---

#### Notes

- This method relies on the existence of the message ID in the session history.
- It is useful for identifying or validating specific messages based on their IDs, especially in scenarios like debugging, data validation, or ensuring message integrity across sessions.

---

### `indexExists(index, id)`

This method checks if a **specific index** exists in the session history.

---

#### Purpose

To determine whether a **message exists** at a given **index** in the session history. It ensures that the requested index is valid and points to an existing message.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `index`  | `number` | Yes      | The index to check for existence in the session history.                    |
| `id`     | `string` | No       | Optional session ID. If not provided, the currently selected session is used. |

---

#### Core Logic

```js
return this.getMsgByIndex(index, id) ? true : false;
```

- `getMsgByIndex(index, id)` is called to retrieve the message at the specified `index` for the session with the given `id`.
- If the message is found, it returns `true`. If the message is not found (i.e., the index is invalid or does not exist), it returns `false`.

---

#### Returns

| Type     | Description                                 |
|----------|---------------------------------------------|
| `boolean` | `true` if the index exists, otherwise `false`. |

---

#### Example Usage

```js
const exists = tinyAi.indexExists(3, "session_001");
// Returns: true if there's a message at index 3 in the session "session_001", otherwise false.
```

---

#### Notes

- This method acts as a helper to validate that the given index corresponds to an actual message in the session history.
- It relies on the `getMsgByIndex` method, so if the index doesn't exist, that method will return `null` or an invalid result, which will cause `indexExists` to return `false`.

---

### `getMsgByIndex(index, id)`

Retrieves a specific message object from the session history by its index.

---

#### Purpose

This method is used to access a single message stored in a session’s history using its numerical index. The message objects are previously constructed using the `buildContent` method and stored in a structured format under the `data` property of the session history.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `index`  | `number` | Yes      | The index of the message to retrieve.                                       |
| `id`     | `string` | No       | The session ID. If omitted, the currently selected session will be used.   |

---

#### Behavior

- `getData(id)` is used to retrieve the session history object.
- If a valid `history` is found and there is an entry at `data[index]`, it returns that message.
- If the index is invalid or the session doesn’t exist, it returns `null`.

---

#### Returns

| Type     | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| `Object` | The message object at the specified index, created by `buildContent`.       |
| `null`   | If no message exists at the given index or the session history is invalid.  |

---

#### Example

```js
const msg = sessionManager.getMsgByIndex(3);
// → Returns the message object at index 3 in the currently selected session, or null if not found.
```

---

#### Note

The message object is expected to be the result of a call to `buildContent(...)`, so it may include structured properties like `role`, `content`, `timestamp`, `meta`, etc., depending on your implementation.

---

### `getMsgById(msgId, id)`

Retrieves a specific message object from the session history using its unique message ID.

---

#### Purpose

This method allows you to access a specific message stored in a session by referencing its unique `msgId`. The messages are objects previously created via `buildContent` and stored inside the `data` structure of the session.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `msgId`  | `string` | Yes      | The unique message ID to search for.                                       |
| `id`     | `string` | No       | The session ID. If omitted, the currently selected session will be used.   |

---

#### Behavior

- Uses `getData(id)` to fetch the session history.
- Resolves the message's index with `getIndexOfId(msgId)`.
- If valid data exists at that index, the message object is returned.
- Returns `null` if the session doesn't exist, the ID is not found, or the data is missing at the resolved index.

---

#### Returns

| Type     | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| `Object` | The message object generated by `buildContent`, corresponding to `msgId`.   |
| `null`   | If the message is not found or the session is invalid.                      |

---

#### Example

```js
const message = sessionManager.getMsgById("msg-abc123");
// → Returns the full message object, or null if not found.
```

---

### `getIndexOfId(msgId, id)`

Retrieves the index position of a message within the session history using its unique message ID.

---

#### Purpose

This method searches for a specific message ID inside the session's `ids` array and returns its index. This index is typically used to retrieve related data (e.g., message content, tokens, or hashes) stored in parallel arrays like `data`, `tokens`, or `hash`.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `msgId`  | `string` | Yes      | The unique message ID to look for.                                          |
| `id`     | `string` | No       | The session ID. If omitted, the currently selected session will be used.   |

---

#### Behavior

- Accesses the current or specified session via `getData(id)`.
- Searches for the `msgId` in the `ids` array using `indexOf`.
- Returns the corresponding index if found.
- If not found or if the session is invalid, returns `-1`.

---

#### Returns

| Type     | Description                                            |
|----------|--------------------------------------------------------|
| `number` | Index of the message in the `ids` array, or `-1` if not found. |

---

#### Example

```js
const index = sessionManager.getIndexOfId("msg-abc123");
// → Might return 5, or -1 if the message ID isn't in the session.
```

---

### `getIdByIndex(index, id)`

Retrieves the message ID located at a specific index within the session history.

---

#### Purpose

This method is used to fetch the message ID that corresponds to a given index in the session’s history. The index is validated based on the existence of a message entry in `history.data`. If the index is invalid or data is missing, `-1` is returned.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `index`  | `number` | Yes      | The index position of the message ID to retrieve.                           |
| `id`     | `string` | No       | The session ID. If omitted, the currently selected session will be used.   |

---

#### Behavior

- Retrieves session data using `getData(id)`.
- Checks if a message exists at the specified index inside `history.data`.
- If valid, returns the corresponding ID from `history.ids`.
- If the index is invalid or data is missing, returns `-1`.

---

#### Returns

| Type             | Description                                                |
|------------------|------------------------------------------------------------|
| `string \| number` | The message ID if found, or `-1` if not found or index is out of bounds. |

---

#### Example

```js
const msgId = sessionManager.getIdByIndex(3);
// → Might return "msg-xyz789" or -1 if the index doesn't exist.
```

---

### `deleteIndex(index, id)`

Deletes a specific message entry at a given index within the session history.

---

#### Purpose

This method removes all data related to a message from the session history arrays (data, ids, hashes, and tokens) based on a specific index. It also emits a `deleteIndex` event to notify subscribers of the deletion.

---

#### Parameters

| Name     | Type     | Required | Description                                                                 |
|----------|----------|----------|-----------------------------------------------------------------------------|
| `index`  | `number` | Yes      | The index of the entry to delete.                                           |
| `id`     | `string` | No       | The session ID. If omitted, the currently selected session will be used.   |

---

#### Returns

| Type      | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `boolean` | Returns `true` if the entry was successfully deleted; otherwise `false`.    |

---

#### Behavior

- Retrieves the session history using `getData(id)`.
- Validates the existence of data at the specified index.
- If valid:
  - Removes entries from all relevant arrays: `data`, `ids`, `hash.data`, and `tokens.data`.
  - Emits a `deleteIndex` event with the index, message ID, and session ID.
  - Returns `true`.
- If invalid:
  - Returns `false`.

---

#### Example

```js
const success = sessionManager.deleteIndex(2);
if (success) {
  console.log("Entry deleted.");
} else {
  console.log("Entry not found or index invalid.");
}
```

---

### `replaceIndex(index, data, tokens, id)`

Replaces an existing message entry in the session history at the specified index with new data and/or token count.

---

#### Parameters

| Name     | Type      | Required | Description                                                                 |
|----------|-----------|----------|-----------------------------------------------------------------------------|
| `index`  | `number`  | Yes      | The index of the entry to replace.                                          |
| `data`   | `Object`  | No       | The new message data to replace the current entry.                          |
| `tokens` | `number`  | No       | The new token count associated with the entry.                              |
| `id`     | `string`  | No       | The session ID. If omitted, the currently selected session will be used.    |

---

#### Returns

| Type      | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `boolean` | Returns `true` if the entry was successfully replaced; otherwise `false`.   |

---

#### Behavior

- Retrieves the session history using `getData(id)`.
- Verifies if the specified index exists.
- If either `data` or `tokens` is provided and the index is valid:
  - Replaces `history.data[index]` with the new `data`, if provided.
  - Updates the hash at `history.hash.data[index]` using `objHash(data)`.
  - Updates the token count at `history.tokens.data[index]`, if `tokens` is provided.
  - Emits a `replaceIndex` event with the updated information.
  - Returns `true`.
- If no valid `data` or `tokens` is passed, or the index is invalid, returns `false`.

---

#### Example Usage

```js
sessionManager.replaceIndex(3, { role: "user", content: "Updated message." }, 40);
```

---

### `getLastIndex(id)`

Retrieves the index of the last entry in the session history.

---

#### Parameters

| Name  | Type     | Required | Description                                                                 |
|-------|----------|----------|-----------------------------------------------------------------------------|
| `id`  | `string` | No       | The session ID. If omitted, the currently selected session will be used.    |

---

#### Returns

| Type     | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| `number` | The index of the last entry in the session history, or `-1` if none exists. |

---

#### Behavior

- Uses `getData(id)` to retrieve the session history.
- Checks if the last item in `history.data` exists.
- If valid, returns the index of the last item (`length - 1`).
- If the history is invalid or empty, returns `-1`.

---

#### Example Usage

```js
const last = sessionManager.getLastIndex(); // returns the last message index
```

---

### `getLastIndexData(id)`

Retrieves the data of the last entry in the session history.

---

#### Parameters

| Name  | Type     | Required | Description                                                              |
|-------|----------|----------|--------------------------------------------------------------------------|
| `id`  | `string` | No       | The session ID. If omitted, the currently selected session will be used. |

---

#### Returns

| Type     | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| `Object` | The data of the last entry in the session history, or `null` if not found.  |

---

#### Behavior

- Uses `getData(id)` to retrieve the session history.
- Checks if the last entry exists in `history.data`.
- Returns the last item if valid; otherwise returns `null`.

---

#### Example Usage

```js
const lastData = sessionManager.getLastIndexData();
if (lastData) {
  console.log("Last message content:", lastData.content);
}
```

### `existsFirstIndex(id)`

Checks if the session history has at least one valid entry.

---

#### Parameters

| Name  | Type     | Required | Description                                                              |
|-------|----------|----------|--------------------------------------------------------------------------|
| `id`  | `string` | No       | The session ID. If omitted, the currently selected session will be used. |

---

#### Returns

| Type      | Description                                                           |
|-----------|-----------------------------------------------------------------------|
| `boolean` | `true` if the session history contains at least one valid entry, `false` otherwise. |

---

#### Behavior

- Retrieves session history using `getData(id)`.
- Returns `true` if the first entry in `history.data` exists and is truthy.
- Otherwise, returns `false`.

---

#### Example Usage

```js
if (sessionManager.existsFirstIndex()) {
  console.log("The session contains at least one message.");
}
```

---

### `getFirstIndexData(id)`

Retrieves the first entry from the session history.

---

#### Parameters

| Name  | Type     | Required | Description                                                              |
|-------|----------|----------|--------------------------------------------------------------------------|
| `id`  | `string` | No       | The session ID. If omitted, the currently selected session will be used. |

---

#### Returns

| Type       | Description                                                |
|------------|------------------------------------------------------------|
| `Object`   | The first entry of the session history, if it exists.      |
| `null`     | Returned if the session history is invalid or empty.       |

---

#### Behavior

- Uses `getData(id)` to retrieve the current session's history object.
- Returns the first element in the `history.data` array if present.
- Returns `null` if the session history is invalid or empty.

---

#### Example Usage

```js
const firstEntry = sessionManager.getFirstIndexData();
if (firstEntry) {
  console.log("First message:", firstEntry);
}
```

---

### `addData(data, tokenData = { count: null }, id = undefined)`

Adds new data to the selected session history.

---

#### Parameters

| Name         | Type       | Required | Description                                                                 |
|--------------|------------|----------|-----------------------------------------------------------------------------|
| `data`       | `Object`   | Yes      | The data to be added to the session history.                                |
| `tokenData`  | `Object`   | No       | Optional token-related data to be associated with the new entry. Defaults to `{ count: null }`. |
| `id`         | `string`   | No       | The session ID. If omitted, the currently selected session will be used.    |

---

#### Returns

| Type      | Description                              |
|-----------|------------------------------------------|
| `number`  | The new ID of the added data entry.      |

---

#### Throws

| Type      | Description                              |
|-----------|------------------------------------------|
| `Error`   | Thrown if the provided session ID is invalid or does not exist in history. |

---

#### Behavior

- Uses `this.getId(id)` to retrieve the selected session ID.
- If the session history exists for the selected session, it increments the `nextId` and adds the new data entry to the `data`, `tokens.data`, `ids`, and `hash.data` arrays.
- Emits the `addData` event with the new ID, data, token content, hash, and session ID.

---

#### Example Usage

```js
try {
  const newData = { content: "New message data" };
  const tokenInfo = { count: 5 };
  const newId = sessionManager.addData(newData, tokenInfo);
  console.log(`New data added with ID: ${newId}`);
} catch (error) {
  console.error(error.message);
}
```

This method is responsible for adding new entries into the session history while tracking token-related data. The `tokenData` can be passed to associate additional information, like a count, with the new data entry.

---

### `resetContentData(id)`

Resets all stored data associated with a given session.

---

#### Parameters

| Name | Type     | Required | Description                                                                 |
| ---- | -------- | -------- | --------------------------------------------------------------------------- |
| `id` | `string` | No       | The session ID. If omitted, the currently selected session ID will be used. |

---

#### Returns

| Type     | Description                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `number` | A status code indicating the result of the reset operation.<br><br>**Return codes:**<br>- `0`: No valid session was found.<br>- `1`: A valid session was found but contained no items to delete.<br>- `2`: Items were successfully deleted. |

---

#### Behavior

* Retrieves the target session ID using `this.getId(id)`.
* Validates whether the selected session ID exists in the session history.
* If the session contains stored items, it repeatedly deletes the first index (`deleteIndex(0)`) until the session becomes empty.
* Returns a numeric status code representing the outcome.

---

#### Example Usage

```js
const status = sessionManager.resetContentData();

switch (status) {
  case 0:
    console.log("No valid session found.");
    break;
  case 1:
    console.log("Session found but already empty.");
    break;
  case 2:
    console.log("Session data successfully cleared.");
    break;
}
```

This method ensures that a session's stored data is fully cleared, providing clear return codes to help you handle different outcomes in your application logic.
