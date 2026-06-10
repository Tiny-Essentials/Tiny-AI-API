## Constructor: `new TinyAiInstance(isSingle = false)`

Creates an instance of the **TinyAiInstance** class.

Initializes internal variables and sets up the base configuration for handling AI models, session history, and content generation. This class can operate in **single-session** mode or support **multiple sessions**.

### Parameters

| Name      | Type    | Description                                                      |
|-----------|---------|------------------------------------------------------------------|
| `isSingle` | `boolean` | If `true`, configures the instance to manage only a single session. Default is `false`. |

### Behavior

- Sets up:
  - API key and error handling state
  - Empty history object
  - Placeholder for AI models and pagination token
  - Internal generator and model fetcher function references
- Defines a method `#_insertIntoHistory(id, data)` to update history entries by ID
- Defines `_partTypes` with handlers for:
  - `text`: Accepts valid strings
  - `inlineData`: Accepts objects with `mime_type` and `data` as strings
- In **single-session mode** (`isSingle === true`):
  - Automatically calls `startDataId('main', true)`
  - Disables methods `startDataId`, `stopDataId`, and `selectDataId` after initialization

---

### `selectDataId(id)`

This method sets a session history ID as the active session. It can also clear the current selection by passing `null`.

#### Purpose

To **select or deselect** a session ID from the session history for further operations, such as continuing a conversation or displaying previous interactions.

---

#### Parameters

| Name | Type             | Description                                                  |
|------|------------------|--------------------------------------------------------------|
| `id` | `string \| null` | The session history ID to select, or `null` to deselect it. |

---

#### Behavior

- If an `id` is provided:
  - Checks if `this.history[id]` exists.
  - If it exists, assigns it to `this.#_selectedHistory` and emits the `'selectDataId'` event.
  - Returns `true` on success, `false` if the ID is invalid or not found.

- If `id` is `null`:
  - Clears the currently selected session by setting `this.#_selectedHistory` to `null`.
  - Emits `'selectDataId'` with `null`.
  - Returns `true`.

---

#### Returns

| Type    | Description                                                                 |
|---------|-----------------------------------------------------------------------------|
| `boolean` | `true` if the selection or deselection succeeded, `false` if the ID was invalid. |

---

#### Example Usage

```js
// Select an existing session
tinyAi.selectDataId("session_123"); // true

// Try selecting a non-existing session
tinyAi.selectDataId("invalid_id");  // false

// Deselect the current session
tinyAi.selectDataId(null);          // true
```

This method helps manage session state within the history, allowing components to react to session changes through the emitted event.

---

### `getId(id)`

This method returns the session history ID to be used in operations. It can either return the provided `id` (if valid) or the currently selected one.

---

#### Purpose

To **retrieve the appropriate session ID**, especially when working in multi-session mode. It checks if the passed `id` is usable or if it should fall back to the currently selected session.

---

#### Parameters

| Name | Type     | Optional | Description                                                                 |
|------|----------|----------|-----------------------------------------------------------------------------|
| `id` | `string` | Yes      | An optional session ID. If omitted or ignored, the default selected ID is returned. |

---

#### Behavior

- If an `id` is provided **and** the instance is **not in single-session mode** (`!this._isSingle`), it returns the provided `id`.
- Otherwise, it returns the current selected session ID (`this.#_selectedHistory`).

---

#### Returns

| Type           | Description                                                    |
|----------------|----------------------------------------------------------------|
| `string \| null` | The chosen session ID or `null` if none is currently selected. |

---

#### Example Usage

```js
// In multi-session mode:
tinyAi.getId("session_123"); // returns "session_123"

// In single-session mode or if no ID provided:
tinyAi.getId();              // returns currently selected session ID or null
```

---

#### Note

This function simplifies conditional logic elsewhere in the code by abstracting how the correct session ID should be determined, particularly useful when toggling between **single** and **multi-session** behavior.
