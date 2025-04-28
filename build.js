import { build } from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"

// Common build options
const commonOptions = {
  bundle: true,
  target: ["es2018"],
  minify: false,
  sourcemap: true,
  loader: {
    ".ts": "ts",
    ".tsx": "tsx",
  },
  // Explicitly mark React as external
  external: ["react", "react-dom"],
  // Important: Define React as a global for UMD builds
  define: {
    "process.env.NODE_ENV": '"production"',
  },
}

// Build all formats of the library
async function buildLibrary() {
  try {
    // ESM Build - Main
    await build({
      ...commonOptions,
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.mjs",
      format: "esm",
      platform: "browser", // Keep as browser for potential isomorphic use, externals handle Node/React
      plugins: [nodeExternalsPlugin()],
    })
    console.log("ESM build (main) completed successfully.")

    // ESM Build - Core
    await build({
      ...commonOptions,
      entryPoints: ["./src/core.ts"],
      outfile: "dist/core.mjs",
      format: "esm",
      platform: "browser", // Keep as browser for potential isomorphic use, externals handle Node/React
      plugins: [nodeExternalsPlugin()],
    })
    console.log("ESM build (core) completed successfully.")

    // CJS Build - Main
    await build({
      ...commonOptions,
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.cjs",
      format: "cjs",
      platform: "browser", // Keep as browser for potential isomorphic use, externals handle Node/React
      plugins: [nodeExternalsPlugin()],
    })
    console.log("CJS build (main) completed successfully.")

    // CJS Build - Core
    await build({
      ...commonOptions,
      entryPoints: ["./src/core.ts"],
      outfile: "dist/core.cjs",
      format: "cjs",
      platform: "browser", // Keep as browser for potential isomorphic use, externals handle Node/React
      plugins: [nodeExternalsPlugin()],
    })
    console.log("CJS build (core) completed successfully.")

    // UMD/IIFE Build for browsers
    await build({
      ...commonOptions,
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.umd.js",
      format: "iife",
      platform: "browser",
      globalName: "MojitoSDK",
      // For UMD builds, specify how to access React globally
      banner: {
        js: `
          const process = {env: {NODE_ENV: 'production'}};
          const React = window.React;
        `,
      },
    })
    console.log("UMD build completed successfully.")

    console.log("All builds completed successfully!")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

buildLibrary()
