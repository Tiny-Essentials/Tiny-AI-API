import TinyPluginInliner from '../tiny-modules/libs/TinyClassManager/TinyPluginInliner.mjs';

// ==========================================
// Usage Execution
// ==========================================

const builder = new TinyPluginInliner({
  entryPoint: 'src/plugins/test.mjs',
  outDir: 'dist',
  outFileName: 'test.bundle.mjs',
  // Optional: Automatically redirects all original 'src' paths to point to 'dist'
  rootReplacement: {
    from: 'src',
    to: 'dist',
  },
});

builder.build();
