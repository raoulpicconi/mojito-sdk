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
    // ESM Build
    await build({
      ...commonOptions,
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.mjs",
      format: "esm",
      platform: "browser",
      plugins: [nodeExternalsPlugin()],
    })
    console.log("ESM build completed successfully.")

    // CJS Build
    await build({
      ...commonOptions,
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.cjs",
      format: "cjs",
      platform: "browser",
      plugins: [nodeExternalsPlugin()],
    })
    console.log("CJS build completed successfully.")

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
