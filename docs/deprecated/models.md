### `setModel(data, id?)`

Sets the model for the AI session. The model specifies which AI model should be used during the session, enabling different types of behavior or capabilities.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `data`   | `string`  | The model to be set. It must be a string representing the AI model. |
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- This function does not return any value.

#### Behavior

- The method checks if `data` is a valid string. If it is, it will be set as the model for the session.
- It stores the model in the session history using `#_insertIntoHistory`.
- An event is emitted (`setModel`) with the model name and the session ID.

---

### `getModel(id?)`

Retrieves the model set for the AI session. If no model is set, it returns `null`.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- **`string`**: The model set for the session if available.
- **`null`**: If no model is set for the session.

#### Behavior

- The method retrieves the session history data using the provided `id` or the currently selected session ID.
- It checks if a model is set and returns its value. If no model is found, it returns `null`.

---

Aqui está a documentação em **Markdown** para o método `getModels`, seguindo o mesmo estilo organizado e claro:

---

### `getModels(pageSize = 50, pageToken = null)`

Retrieves a list of available models for the AI session, optionally paginated.

#### Parameters

| Name         | Type              | Default | Description                                                                 |
|--------------|-------------------|---------|-----------------------------------------------------------------------------|
| `pageSize`   | `number`          | `50`    | The number of models to retrieve per page.                                 |
| `pageToken`  | `string \| null`  | `null`  | Token for retrieving the next page of models. If omitted, uses internal token. |

#### Returns

- **`Array`**: A list of models retrieved from the API.

#### Throws

- **`Error`**: If no model list API handler function (`#_getModels`) is defined.

#### Behavior

- Internally calls a user-defined private method `#_getModels` with the current API key, the page size, and a page token.
- If `pageToken` is `null`, it will fallback to the value in `this._nextModelsPageToken`.
- If the model-fetching logic is not configured (`#_getModels` is not a function), it throws an error.

#### Example

```js
const models = session.getModels(20);
// or
const nextPageModels = session.getModels(20, "eyJwYWdlIjoxfQ==");
```

> **Note:** This method assumes that an external function `#_getModels(apiKey, pageSize, pageToken)` is properly implemented to fetch model data.

---

### `getModelsList()`

Retrieves the list of models for the AI session.

#### Parameters

- **None** – This method does not take any parameters.

#### Returns

| Type  | Description                  |
|-------|------------------------------|
| `Array` | The list of models available for the AI session. |

#### Example

```js
const models = session.getModelsList();
console.log(models); // Outputs the list of models
```

---

### `getModelData(id)`

Retrieves model data from the list of models by searching for a specific model ID.

#### Parameters

| Name | Type   | Description                                  |
|------|--------|----------------------------------------------|
| `id` | `string` | The model data ID to search for in the models list. |

#### Returns

| Type    | Description                                 |
|---------|---------------------------------------------|
| `Object | null` | The model data if found, otherwise `null`. |

#### Example

```js
const modelData = session.getModelData('modelId123');
if (modelData) {
  console.log(modelData); // Outputs the model data if found
} else {
  console.log('Model not found');
}
```

---

### `existsModel(id)`

Checks if a model exists in the list of models by searching for a specific model ID.

#### Parameters

| Name | Type   | Description                                  |
|------|--------|----------------------------------------------|
| `id` | `string` | The model ID to check for in the models list. |

#### Returns

| Type    | Description                                 |
|---------|---------------------------------------------|
| `boolean` | `true` if the model exists, `false` otherwise. |

#### Example

```js
const isModelExists = session.existsModel('modelId123');
if (isModelExists) {
  console.log('Model exists!');
} else {
  console.log('Model not found.');
}
```

---

### `setMaxOutputTokens(value, id?)`

Sets the maximum number of output tokens for a given AI session. This method allows developers to control the maximum output length for the AI's responses.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `value` | `number` | The maximum number of output tokens to set. Must be a finite, valid number. |
| `id`    | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Throws

- `Error`: If the `value` is not a valid number (NaN or infinite values are invalid).

#### Returns

- `void`: This method does not return a value.

#### Behavior

- Validates the provided `value` to ensure it is a finite number.
- If valid, updates the session history with the new `maxOutputTokens` setting.
- Emits the `setMaxOutputTokens` event with the new token value and the session ID.

---

### `getMaxOutputTokens(id?)`

Gets the maximum number of output tokens for a given AI session. This method allows developers to retrieve the current token limit for the AI's responses.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `id`   | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: The maximum output tokens value if it is set. If not set, returns `null`.

#### Behavior

- Checks the session's history for the `maxOutputTokens` value.
- If the value exists and is a valid number, it returns the token limit.
- If the value is not set or is invalid, it returns `null`.

---

### `setTemperature(value, id?)`

Sets the temperature setting for a given AI session. The temperature value controls the randomness of the AI's responses, with higher values generating more random outputs and lower values making the responses more deterministic.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `value` | `number` | The temperature value to be set. Must be a finite, valid number. |
| `id`    | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Throws

- `Error`: If the `value` is not a valid number (NaN or infinite values are invalid).

#### Returns

- `void`: This method does not return a value.

#### Behavior

- Validates the provided `value` to ensure it is a finite number.
- If valid, updates the session history with the new `temperature` setting.
- Emits the `setTemperature` event with the new temperature value and the session ID.

---

### `getTemperature(id?)`

Retrieves the temperature setting for a given AI session. The temperature controls the randomness of the AI's responses. If not set, it returns `null`.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `id`    | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: The temperature value if set, otherwise `null`.

#### Behavior

- Retrieves the `temperature` value from the session history. 
- If the `temperature` value is not set, it returns `null`.

---

### `setTopP(value, id?)`

Sets the top-p (nucleus sampling) value for a given AI session. The top-p value controls the diversity of the output by considering the smallest set of tokens whose cumulative probability is greater than the top-p value.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `value` | `number`  | The top-p value to be set. It must be a finite number. |
| `id`    | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Returns

- `void`: This function does not return a value.

#### Behavior

- Validates that `value` is a finite number.
- Sets the top-p value in the session's history.
- Emits an event named `setTopP` with the `value` and `selectedId`.

#### Throws

- Throws an error if the `value` is not a valid number.

---

### `getTopP(id?)`

Retrieves the top-p (nucleus sampling) value for a given AI session. The top-p value controls the diversity of the output by considering the smallest set of tokens whose cumulative probability is greater than the top-p value.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `id`    | `string?` | *(Optional)* The session ID to retrieve the top-p value for. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: The top-p value if it is set, or `null` if not set.

#### Behavior

- Retrieves the `topP` value from the session's history.
- If the value exists and is a valid number, it will return the value.
- If no valid value is found, it will return `null`.

---

### `setTopK(value, id?)`

Sets the top-k value for a given AI session. The top-k value determines how many of the highest probability tokens are considered when generating output.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `value` | `number`  | The top-k value to be set. Must be a valid number. |
| `id`    | `string?` | *(Optional)* The session ID to set the top-k value for. If omitted, the currently selected session will be used. |

#### Returns

- `void`: This method does not return a value.

#### Throws

- Throws an error if the provided `value` is not a valid number.

#### Behavior

- Sets the `topK` value in the session's history for the specified session.
- Emits a `setTopK` event with the provided value and the session ID.

---

### `getTopK(id?)`

Retrieves the top-k value for a given AI session. The top-k value represents the number of highest probability tokens considered during output generation.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `id`    | `string?` | *(Optional)* The session ID to retrieve the top-k value for. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: Returns the `topK` value if set for the session, or `null` if the top-k value is not set.

#### Behavior

- Retrieves the `topK` value from the session's history for the specified session.

---

### `setPresencePenalty(value, id?)`

Sets the presence penalty value for a given AI session. The presence penalty influences how much the model avoids generating tokens that have appeared in the context.

#### Parameters

| Name    | Type      | Description |
|---------|-----------|-------------|
| `value`  | `number`  | The presence penalty value to be set. Must be a valid number. |
| `id`     | `string?` | *(Optional)* The session ID for which to set the presence penalty. If omitted, the currently selected session will be used. |

#### Returns

- `void`: This function does not return a value.

#### Behavior

- Sets the `presencePenalty` in the session's history for the specified session.

---

### `getPresencePenalty(id?)`

Retrieves the presence penalty setting for a given AI session. The presence penalty helps control how much the model avoids repeating tokens already seen in the context.

#### Parameters

| Name    | Type      | Description |
|---------|-----------|-------------|
| `id`     | `string?` | *(Optional)* The session ID for which to retrieve the presence penalty. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: Returns the presence penalty value if set, or `null` if no value is set.

#### Behavior

- Retrieves the `presencePenalty` from the session's history for the specified session.

---

### `setFrequencyPenalty(value, id?)`

Sets the frequency penalty setting for an AI session. The frequency penalty helps to penalize models for repeating the same tokens or phrases, allowing for more diverse responses.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `value`  | `number`  | The frequency penalty value to be set. This value should be a number. |
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- `void`: This function does not return a value.

#### Behavior

- If the provided `value` is a valid number, the method sets the `frequencyPenalty` in the session's history.
- Emits the `setFrequencyPenalty` event with the value and selected session ID.
- Throws an error if the `value` is not a valid number.

---

### `getFrequencyPenalty(id?)`

Retrieves the frequency penalty setting for an AI session. The frequency penalty is used to penalize models for repeating the same tokens or phrases, helping to ensure more varied responses.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- `number | null`: The frequency penalty value, or `null` if the value is not set for the session.

#### Behavior

- If the `frequencyPenalty` is set in the session's history, the method returns its value.
- If the value is not set or not found, the method returns `null`.

---

### `setEnabledEnchancedCivicAnswers(value, id?)`

Sets the setting for enabling enhanced civic answers in an AI session. This setting determines whether the AI should provide enhanced civic answers, typically involving more detailed, accurate, and contextually relevant responses related to civic topics.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `value`  | `boolean` | A boolean value to enable or disable enhanced civic answers. Set to `true` to enable, or `false` to disable. |
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- This function does not return any value.

#### Behavior

- If the provided `value` is a boolean, the setting is updated for the specified session.
- If the `value` is not a boolean, an error is thrown with the message `'Invalid boolean value!'`.

---

### `isEnabledEnchancedCivicAnswers(id?)`

Gets the setting for whether enhanced civic answers are enabled in an AI session. This setting indicates whether the AI is configured to provide enhanced civic answers, which might involve more accurate or contextually relevant responses on civic topics.

#### Parameters

| Name     | Type      | Description |
|----------|-----------|-------------|
| `id`     | `string?` | *(Optional)* The session ID. If omitted, the currently selected session will be used. |

#### Returns

- `boolean` if the setting is enabled or disabled (`true` or `false`).
- `null` if the setting has not been set for the session.

#### Behavior

- If the setting for enhanced civic answers is available and is a boolean, it will be returned.
- If the setting is not available or not set, it returns `null`.
