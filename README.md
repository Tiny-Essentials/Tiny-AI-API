
<div align="center">
<img src="./md-assets/tiny-ai-api.jpg" alt="banner" />
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/tiny-ai-api"><img src="https://img.shields.io/npm/v/tiny-ai-api.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/tiny-ai-api"><img src="https://img.shields.io/npm/dt/tiny-ai-api.svg?maxAge=3600" alt="NPM downloads" /></a>
</p>
<p>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg?logo=patreon" alt="Patreon" /></a>
    <a href="https://ko-fi.com/jasmindreasond"><img src="https://img.shields.io/badge/donate-ko%20fi-29ABE0.svg?logo=ko-fi" alt="Ko-Fi" /></a>
    <a href="https://chain.so/address/BTC/bc1qnk7upe44xrsll2tjhy5msg32zpnqxvyysyje2g"><img src="https://img.shields.io/badge/donate-bitcoin-F7931A.svg?logo=bitcoin" alt="Bitcoin" /></a>
    <a href="https://chain.so/address/LTC/ltc1qchk520v4u8334n5dntmgeja55gc5g5rrkgpd4f"><img src="https://img.shields.io/badge/donate-litecoin-345D9D.svg?logo=litecoin" alt="Litecoin" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/tiny-ai-api/"><img src="https://nodei.co/npm/tiny-ai-api.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>
</div>

# Tiny AI Server Communication API

This class is responsible for managing AI session data, including models, history, and content generation.

The script is designed to interact with the AI API, providing a complete structure for building user interfaces (UI) or AI-powered chatbots.

It implements a session management system to help handle multiple different bots, allowing you to manage various aspects of interactions such as system instructions, file handling, tokens, and more.

> **Note**: This documentation was written by [ChatGPT](https://openai.com/chatgpt), an AI assistant developed by OpenAI, based on the project structure and descriptions provided by the repository author.  
> If you find any inaccuracies or need improvements, feel free to contribute or open an issue!

---

## Inspiration

This project was initially a simple AI application from Pony Driland repository. The AI project eventually evolved both during the development that resulted in this project that is now published by the same creator of the Pony Driland repository.

## Build

To get started, please install the project dependencies. It is **mandatory** to run the build command afterward to ensure the module works correctly:
```bash
npm install
npm run build:essentials
```

---

## 🛠️ Tiny-Essentials Fork Notice

Just a quick heads-up! 🚨 The object type imports from **Tiny-Essentials** have their own dedicated storage in this project. This happens because the `tiny-essentials-fork` extracts these scripts directly into our module to keep everything standalone.

To keep things organized and avoid naming conflicts, we renamed the core filter functions when exporting them. Here is a handy table showing the original Tiny-Essentials function names and how they are represented here:

| Original `tiny-essentials` Function | Exported Function in this Suite |
| :--- | :--- |
| `checkObj` | `checkAiObj` |
| `cloneObjTypeOrder` | `cloneAiObjTypeOrder` |
| `extendObjType` | `extendAiObjType` |
| `getCheckObj` | `getCheckAiObj` |
| `objType` | `aiObjType` |
| `reorderObjTypeOrder` | `reorderAiObjTypeOrder` |

📦 **Direct Access:** Good news! Our `package.json` is fully adapted with `exports`, meaning you can access these functions directly from the native file if you need to, like this:

```javascript
import { checkAiObj } from 'tiny-ai-api/tiny-modules/basics/objFilter';
```

---

## Limitations

> ⚠️ **Not optimized for high-load scenarios**  
This script is **not optimized** for efficiently handling multiple AI instances simultaneously.  
It may not be suitable for environments that require running several AI instances at once.

> ⚠️ **Token tracking not included**  
This script **does not automatically manage or track token counts** for messages.  
Developers must implement their own logic to monitor and manage token usage if necessary.

---

## 📦 Installation

To install the package, use the following command:

```bash
npm install tiny-ai-api
```

---

## 🔧 Usage Example

You can interact with the AI using two methods, both of which are valid.

```js
import { TinyAiInstance, setTinyGoogleAi } from 'tiny-ai-api';

const ai = new TinyAiInstance();
setTinyGoogleAi(ai, 'GEMINI_API_KEY', 'gemini-2.0-flash');
```

Alternatively, you can use the following shorthand method:

```js
import { TinyGoogleAi } from 'tiny-ai-api';

const ai = new TinyGoogleAi('GEMINI_API_KEY', 'gemini-2.0-flash');
```

---

## 📂 File Structure (After Build)

After building the project, the following files will be available:

```
dist/
├── index.mjs       → For ESM users (`import`)
├── index.cjs       → For CommonJS users (`require`)
└── index.d.mts     → TypeScript `.d.ts` declaration files
```

---

## 📚 API Reference

### [Introduction](./docs/introduction.md) - Getting Started

Learn the basics of initializing a session, setting up models, and understanding the general structure of the API.

### [Configs](./docs/configs.md) - Session Configuration

Learn how to configure session data, including setting up system instructions, models, and file handling.

### [Content](./docs/content.md) - Content Management

Understand how to manage content like prompts, dialogues, file data, and how to retrieve and modify this content.

### [Custom](./docs/custom.md) - Working with Custom Values

Understand how to implement custom values, including session-specific data and any user-defined parameters.

### [Dev](./docs/dev.md) - Development Tools

For developers looking to extend or debug the API, this section provides tools and guidelines for working with the internal workings of the library.

### [Models](./docs/models.md) - Model Configuration

Set up models and manage their configurations to interact with the API correctly. This includes handling different types of models and adjusting their parameters.

---

## 💡 Features

- **Session Management**: Keep track of multiple AI instances with full session history.
- **Content Handling**: Easily manage data like user inputs, AI-generated responses, and file handling.
- **Token and Hash Tracking**: Monitor token usage for each session and track hash values for specific items.
- **Customizable**: Fully configurable session data and model setups for different environments.
- **Error Handling**: Built-in error management to ensure robust session handling and prevent crashes.
- **Event-driven**: Supports event-driven architecture to handle real-time updates and triggers.

---

## 🛠 Development Tools

For advanced users, you can access several development tools to help with debugging and extending the API:

- **Token Tracking**: Manually track token usage for specific message categories like prompt, system instruction, or file.
- **Custom Session IDs**: Create and manage custom session IDs to differentiate between different AI sessions.
- **File Data Management**: Set, get, and remove file data associated with specific sessions, ideal for sending or receiving large data files.

---

## 📄 Terms of Use

Please make sure to read the [Terms of Use](./TERMS.md) before using this project.  
By using this project, you agree to follow the terms described in that document.

---

## 📄 License

This project is licensed under the LGPL-3.0 License - see the [LICENSE](./LICENSE) file for details.

---

## 🔙 Back to Tiny Essentials

Did you like this module? It’s part of the **Tiny Essentials** collection — a set of minimal yet powerful tools to make development easier.
👉 [Click here to explore more Tiny Essentials modules](https://github.com/Tiny-Essentials/Tiny-Essentials)

---

<div align="center">
<a href="./img/"><img src="./md-assets/img/66a177ed-8dbb-4e4b-a9e2-d7b2311e62b6.png" height="300" /></a>
<br/>
Made with tiny love!
</div>