# mojito-sdk

[![npm version](https://badge.fury.io/js/%40raoul-picconi%2Fmojito-sdk.svg)](https://badge.fury.io/js/%40raoul-picconi%2Fmojito-sdk)

> Mojito wallet SDK

This SDK provides functionalities to interact with the Mojito wallet, including React hooks for easy integration into React applications.

## Installation

Install the package using npm:

```bash
npm install @raoul-picconi/mojito-sdk @tanstack/react-query react react-dom
```

Or using yarn:

```bash
yarn add @raoul-picconi/mojito-sdk @tanstack/react-query react react-dom
```

**Note:** This package has peer dependencies on `@tanstack/react-query`, `react`, and `react-dom`. Ensure they are installed in your project.

## Usage

Here are a couple of examples to get you started:

### 1. Using a React Hook to query data (e.g., to display wallet balance)

This example assumes you have a `MintlayerProvider` set up in your React application.

```jsx
import React from "react"
import { useWalletBalance } from "@raoul-picconi/mojito-sdk"

function WalletDisplay() {
  const { data: balance, isLoading, error } = useBalance()

  if (isLoading) return <p>Loading balance...</p>
  if (error) return <p>Error fetching balance: {error.message}</p>

  return (
    <div>
      <h2>Your Wallet Balance</h2>
      <p>{balance ? `${balance.amount} ML` : "N/A"}</p>
    </div>
  )
}

export default WalletDisplay
```

### 2. Using a React Hook to perform a mutation (e.g., to send coins)

This example assumes you have a `MintlayerProvider` set up in your React application.

```jsx
import React from "react"
import { useTransfer } from "@raoul-picconi/mojito-sdk

function Transfer() {
  const { mutate: transfer, isPending, error } = useTransfer()

  const [to, setTo] = useState(0)
  const [amount, setAmount] = useState(0)

  const handleToChange = (e) => {
    setTo(e.target.value)
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  const handleSubmit = (e) => {
    mutate({to, amount})
  }

  return (
    <div>
      <h2>Transfer</h2>

      <form onSubmit={handleSubmit}>
        <input type="string" value={to} onChange={handleToChange} />
        <input type="number" value={amount} onChange={handleAmountChange} />
        <button type="submit">Transfer</button>
      </form>
      {error && <p>An error occurred, please try again</p>}
      {isPending && <p>Transferring {amount} ML to {to}...</p>}
      {isSuccess && <p>Transfer complete!</p>}
    </div>
  )
}

export default Transfer
```

### 3. Using the Core Module

This example demonstrates how you might use the core SDK, perhaps in a Node.js environment or a non-React part of your application.

```javascript
import { MintlayerAPIClient } from "@raoul-picconi/mojito-sdk/core"

async function getLatestBlockNumber() {
  try {
    const sdk = new MintlayerAPIClient(process.env.MINTLAYER_API_SERVER)
    const { block_height, block_id } = await sdk.getChainTip()

    return block_height
  } catch (e) {
    console.error(e)
  }
}
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
- `npm run docs`: Generates documentation in `docs` folder.

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

The live documentation can be found at: **[raoulpicconi.github.io/mojito-sdk](https://raoulpicconi.github.io/mojito-sdk/)**

### Documentation Structure Overview

The documentation is organized into several key areas to help you find the information you need:

- **Modules**:
  - [**Core Module**](https://raoulpicconi.github.io/mojito-sdk/modules/core.html): Detailed information about the core SDK functionalities, classes, and utility functions.
  - [**React Hooks**](https://raoulpicconi.github.io/mojito-sdk/modules/react_hooks.html): Documentation for all available React hooks for easy integration with your UI.

Please explore these sections to get a comprehensive understanding of the SDK's capabilities. The exact paths and section names might vary slightly based on the TypeDoc generation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Repository

- **Homepage:** [https://github.com/raoulpicconi/mojito-sdk#readme](https://github.com/raoulpicconi/mojito-sdk#readme)
- **Bugs:** [https://github.com/raoulpicconi/mojito-sdk/issues](https://github.com/raoulpicconi/mojito-sdk/issues)
- **Repository:** [https://github.com/raoulpicconi/mojito-sdk.git](https://github.com/raoulpicconi/mojito-sdk.git)

## License

[MIT](LICENSE)
