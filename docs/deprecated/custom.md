### `setCustomValue(name, value, tokenAmount?, id?)`

Sets a custom value in the selected session's history.

This method is used to store user-defined values into the session history, allowing the addition of metadata, flags, or other relevant data. It ensures type consistency and prevents conflicts with existing keys.

#### Parameters

| Name          | Type        | Description |
|---------------|-------------|-------------|
| `name`        | `string`    | The name of the custom value to set. Must be a non-empty string and not `"customList"`. |
| `value`       | `*`         | The value to be stored. Can be any data type. |
| `tokenAmount` | `number?`   | *(Optional)* The number of tokens associated with this value. |
| `id`          | `string?`   | *(Optional)* The session ID to apply the value to. If omitted, the currently selected session is used. |

#### Throws

- `Error`: If the `name` is invalid (e.g., empty string, reserved key) or if there's a type conflict with an existing custom value.

#### Returns

- `void`: This method does not return a value.

#### Behavior

- Validates the custom value name.
- Ensures the `customList` is initialized and consistent.
- Adds the value type to `customList` if new.
- Ensures values of the same name have consistent types.
- Optionally tracks associated token usage.
- Computes and stores a hash of the value.
- Emits an event with the format `set<Name>`, where `<Name>` is the capitalized custom value key.

---

### `resetCustomValue(name, id?)`

Resets (clears) a previously set custom value in the selected session's history.

This method removes the value, token tracking, and hash for the specified key. It's primarily used to undo or clear user-defined session data, while keeping a reference in the `customList` for import/export consistency.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `name` | `string`  | The name of the custom value to reset. Must be a non-empty string. |
| `id`   | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Throws

- `Error`: If the name is invalid or if the custom value does not match a valid entry in the `customList`.

#### Returns

- `void`: This method does not return a value.

#### Behavior

- Validates the custom value and ensures it exists in the session's `customList`.
- Clears the associated token count and hash (if any).
- Emits an event with the format `set<Name>` with `null` as the new value.

---

### `eraseCustomValue(name, id?)`

Completely removes a custom value from the selected session history, including its value, token tracking, hash, and the associated metadata entry from the `customList`.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `name` | `string`  | The name of the custom value to erase. Must be a valid key already present in the `customList`. |
| `id`   | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Throws

- `Error`: If the name is invalid or if the session data is not available.

#### Returns

- `void`: This method does not return a value.

#### Behavior

- Internally calls `resetCustomValue(name, id)` to clear the value and its related data.
- Removes the metadata entry for the value from `customList`, effectively making it unavailable for future reference or import/export operations.

---

### `getCustomValue(name, id?)`

Retrieves a custom value from the selected session's history.

This method is used to fetch the value associated with a specific key from the session's stored custom values. If the value does not exist, it returns `null`.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `name` | `string`  | The name of the custom value to retrieve. |
| `id`   | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Returns

- `*`: The value associated with the specified name. If the value does not exist, `null` is returned.

#### Behavior

- Checks the session data for the custom value.
- If found, returns the stored value.
- If the value does not exist or is `null`, returns `null`.

---

### `getCustomValueList(id?)`

Retrieves the list of custom values from the selected session's history.

This method returns all custom values stored in the session's `customList`. If no custom values are found, it returns an empty array.

#### Parameters

| Name   | Type      | Description |
|--------|-----------|-------------|
| `id`   | `string?` | *(Optional)* The session ID to operate on. If omitted, the currently selected session will be used. |

#### Returns

- `Array`: An array of custom values if available. If no custom values exist, an empty array is returned.

#### Behavior

- Checks the session's `customList` for available custom values.
- If custom values are found, returns the list.
- If no values are present, returns an empty array.
