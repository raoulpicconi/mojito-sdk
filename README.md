# mojito-sdk

[![npm version](https://badge.fury.io/js/%40mintlayer%2Fmojito-sdk.svg)](https://badge.fury.io/js/%40mintlayer%2Fmojito-sdk)

> Mojito wallet SDK

This SDK provides functionalities to interact with the Mojito wallet, including React hooks for easy integration into React applications.

## Installation

Install the package using npm:

```bash
npm install @mintlayer/mojito-sdk @tanstack/react-query react react-dom
```

Or using yarn:

```bash
yarn add @mintlayer/mojito-sdk @tanstack/react-query react react-dom
```

**Note:** This package has peer dependencies on `@tanstack/react-query`, `react`, and `react-dom`. Ensure they are installed in your project.

## Usage

```javascript
// Example: Importing the SDK
import { someFunction } from "@mintlayer/mojito-sdk"

// Example: Using a React hook (if applicable)
import { useMojitoHook } from "@mintlayer/mojito-sdk/react"

// ... your code here
```

## Building

To build the project from source, clone the repository and run the following commands:

```bash
# Install dependencies
npm install

# Build the Javascript and Typescript definitions
npm run build
```

## Scripts

- `npm run build`: Builds the Javascript bundles (`.mjs`, `.cjs`) and TypeScript declaration files (`.d.ts`).
- `npm run build:js`: Runs the esbuild process via `build.js`.
- `npm run build:types`: Generates TypeScript declaration files using `tsc`.
- `npm run format`: Formats the code using Prettier.

## Documentation

This project uses [TypeDoc](https://typedoc.org/) to generate documentation from the TSDoc comments in the source code.

### Building Documentation Locally

To build the documentation locally, run the following command:

```bash
npm run docs
```

This will generate the static HTML documentation in the `docs/` directory at the root of the project. You can then open `docs/index.html` in your browser to view the documentation.

### Automated Deployment to GitHub Pages

The documentation is automatically built and deployed to GitHub Pages on every push to the `main` branch. This process is managed by the GitHub Actions workflow defined in `.github/workflows/gh-pages.yml`.

The live documentation can be found at the GitHub Pages URL for this repository, which is typically in the format: `https://<your-username>.github.io/<repository-name>/` (you'll find the exact URL in your repository's "Settings" > "Pages" section after a successful deployment).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Repository

- **Homepage:** [https://github.com/mintlayer/mojito-sdk#readme](https://github.com/mintlayer/mojito-sdk#readme)
- **Bugs:** [https://github.com/mintlayer/mojito-sdk/issues](https://github.com/mintlayer/mojito-sdk/issues)
- **Repository:** [https://github.com/mintlayer/mojito-sdk.git](https://github.com/mintlayer/mojito-sdk.git)

## License

[MIT](LICENSE)
