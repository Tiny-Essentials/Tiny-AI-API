import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @typedef {Object} InlinerConfig
 * @property {string} entryPoint - The absolute or relative path to the entry file.
 * @property {string} outDir - The absolute or relative path to the output directory.
 * @property {string} outFileName - The name of the generated bundle file.
 */

class PluginInliner {
  /**
   * Creates an instance of the PluginInliner.
   *
   * @param {InlinerConfig} config - The configuration object for the build process.
   */
  constructor(config) {
    this.entryFile = path.resolve(config.entryPoint);
    this.outDir = path.resolve(config.outDir);
    this.outFile = path.join(this.outDir, config.outFileName);
    this.entryDir = path.dirname(this.entryFile);

    this.hoistedImports = new Set();
    this.hoistedTypedefs = new Set();
  }

  /**
   * Corrects relative import paths to match the new output directory depth.
   *
   * @private
   * @param {string} importLine - The raw import string.
   * @returns {string} The corrected import string.
   */
  _correctImportPath(importLine) {
    return importLine.replace(
      /(from\s+['"])([^'"]+)(['"])/,
      (match, prefix, importPath, suffix) => {
        // Ignore absolute imports or node modules (e.g., 'node:fs' or 'discord.js')
        if (!importPath.startsWith('.')) return match;

        // 1. Find the exact absolute path of the original target file
        const absoluteTarget = path.resolve(this.entryDir, importPath);

        // 2. Calculate the new relative path from the new output directory
        let newRelativePath = path.relative(this.outDir, absoluteTarget);

        // 3. Force POSIX slashes (/) for JavaScript imports, even on Windows
        newRelativePath = newRelativePath.split(path.sep).join(path.posix.sep);

        // Ensure it starts with './' if it's in the same directory
        if (!newRelativePath.startsWith('.')) {
          newRelativePath = `./${newRelativePath}`;
        }

        return `${prefix}${newRelativePath}${suffix}`;
      },
    );
  }

  /**
   * Extracts and hoists imports and typedefs from a given code string.
   *
   * @private
   * @param {string} code - The source code to parse.
   * @returns {string} The code with imports and typedefs removed.
   */
  _extractAndHoist(code) {
    let processedCode = code;

    // Hoist imports
    const importRegex = /^import\s+[^;]+;/gm;
    const imports = processedCode.match(importRegex) || [];
    for (const imp of imports) {
      this.hoistedImports.add(imp.trim());
    }
    processedCode = processedCode.replace(importRegex, '').trim();

    // Hoist typedefs
    const typedefRegex = /\/\*\*[\s\S]*?@typedef[\s\S]*?\*\//g;
    const typedefs = processedCode.match(typedefRegex) || [];
    for (const def of typedefs) {
      this.hoistedTypedefs.add(def.trim());
    }
    processedCode = processedCode.replace(typedefRegex, '').trim();

    return processedCode;
  }

  /**
   * Cleans up the plugin code to be safely injected into the .insert() method.
   *
   * @private
   * @param {string} code - The raw plugin code.
   * @param {string} pluginName - The name of the plugin class/variable.
   * @returns {string} The formatted plugin code.
   */
  _formatPluginCode(code, pluginName) {
    let cleanCode = code;

    // Remove exports and declarations
    cleanCode = cleanCode.replace(new RegExp(`export\\s+default\\s+${pluginName};`), '');
    cleanCode = cleanCode.replace(new RegExp(`const\\s+${pluginName}\\s*=\\s*`), '');

    // Remove the JSDoc block specifically targeting the (Base) => wrapper
    cleanCode = cleanCode.replace(/\/\*\*[\s\S]*?\*\/\s*(\(Base\)\s*=>)/, '$1');

    // Remove trailing semicolon
    cleanCode = cleanCode.trim();
    if (cleanCode.endsWith(';')) cleanCode = cleanCode.slice(0, -1);

    // Fix the @extends JSDoc
    cleanCode = cleanCode.replace(/@extends\s+\{[A-Za-z0-9_]+</g, '@extends {Base<');

    return cleanCode;
  }

  /**
   * Executes the build process.
   *
   * @returns {Promise<void>}
   */
  async build() {
    try {
      let entryContent = await fs.readFile(this.entryFile, 'utf8');

      // Find all plugins being inserted
      const insertRegex = /\.insert\(\s*([a-zA-Z0-9_]+)\s*\)/g;
      const pluginsToInline = [...entryContent.matchAll(insertRegex)].map((m) => m[1]);

      if (pluginsToInline.length === 0) {
        console.log('No plugins found to inline.');
        return;
      }

      // Initial extraction from the main file
      entryContent = this._extractAndHoist(entryContent);

      // Process each plugin
      for (const pluginName of pluginsToInline) {
        // Find where this plugin was imported
        const importLine = [...this.hoistedImports].find((imp) => imp.includes(` ${pluginName} `));
        if (!importLine) continue;

        const pathMatch = importLine.match(/from\s+['"]([^'"]+)['"]/);
        if (!pathMatch) continue;

        const pluginFullPath = path.resolve(this.entryDir, pathMatch[1]);
        let pluginCode = await fs.readFile(pluginFullPath, 'utf8');

        // Extract internal dependencies of the plugin
        pluginCode = this._extractAndHoist(pluginCode);

        // Clean and format the class
        pluginCode = this._formatPluginCode(pluginCode, pluginName);

        // Inject the code into the entry file
        const insertTarget = new RegExp(`\\.insert\\(\\s*${pluginName}\\s*\\)`, 'g');
        entryContent = entryContent.replace(insertTarget, `.insert(\n${pluginCode}\n)`);

        // Remove the plugin's original import line (since it is now inlined)
        this.hoistedImports.delete(importLine);
      }

      // Correct all gathered import paths for the new directory
      const finalImports = [...this.hoistedImports]
        .map((imp) => this._correctImportPath(imp))
        .join('\n');

      const finalTypedefs = [...this.hoistedTypedefs].join('\n\n');

      const finalOutput = `${finalImports}\n\n${finalTypedefs}\n\n${entryContent}`;

      await fs.mkdir(this.outDir, { recursive: true });
      await fs.writeFile(this.outFile, finalOutput, 'utf8');

      console.log(
        'Build successful! Plugins inlined, JSDocs preserved, and paths automatically corrected.',
      );
    } catch (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
  }
}

// ==========================================
// Usage Execution
// ==========================================

const builder = new PluginInliner({
  entryPoint: 'src/plugins/test.mjs',
  outDir: 'dist',
  outFileName: 'test.bundle.mjs',
});

builder.build();
