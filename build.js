import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

// Common build options
const commonOptions = {
  bundle: true,
  target: ['es2018'],
  minify: false,
  sourcemap: true,
  // TypeScript is handled automatically by esbuild
  loader: { 
    '.ts': 'ts',
    '.tsx': 'tsx' 
  }
};

// Build all formats of the library
async function buildLibrary() {
  try {
    // ESM Build
    await build({
      ...commonOptions,
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.mjs',
      format: 'esm',
      platform: 'browser',
      plugins: [nodeExternalsPlugin()]
    });
    console.log('ESM build completed successfully.');

    // CJS Build
    await build({
      ...commonOptions,
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.cjs',
      format: 'cjs',
      platform: 'browser',
      plugins: [nodeExternalsPlugin()]
    });
    console.log('CJS build completed successfully.');

    // UMD/IIFE Build for browsers
    await build({
      ...commonOptions,
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.umd.js',
      format: 'iife',
      platform: 'browser',
      globalName: 'MojitoSDK'
    });
    console.log('UMD build completed successfully.');

    console.log('All builds completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildLibrary();