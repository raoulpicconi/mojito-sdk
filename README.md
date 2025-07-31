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

### New Features (v3.1.0+)

This SDK now includes support for the latest @mintlayer/sdk features:

#### HTLC (Hash Time-Locked Contract) Support

```javascript
import { useCreateHtlc, useExtractHtlcSecret, useRefundHtlc } from "@raoul-picconi/mojito-sdk"

function HTLCExample() {
  const { mutate: createHtlc } = useCreateHtlc()
  const { mutate: extractSecret } = useExtractHtlcSecret()
  const { mutate: refundHtlc } = useRefundHtlc()

  // Create an HTLC transaction
  const handleCreateHtlc = () => {
    createHtlc({
      destination: "address",
      value: "1000000",
      hash_lock: "hash",
      timelock: { block_height: 1000 },
    })
  }

  // Extract secret from HTLC
  const handleExtractSecret = () => {
    extractSecret({
      htlc_output: htlcOutput,
      secret: "secret",
    })
  }

  // Refund HTLC
  const handleRefund = () => {
    refundHtlc({
      htlc_output: htlcOutput,
    })
  }
}
```

#### Challenge Signing for Authentication

```javascript
import { useSignChallenge } from "@raoul-picconi/mojito-sdk"

function AuthenticationExample() {
  const { mutate: signChallenge } = useSignChallenge()

  const handleSignMessage = () => {
    signChallenge({
      message: "Sign this message to authenticate",
      encoding: "utf8",
    })
  }
}
```

#### UTXO Preview Helpers

```javascript
import { usePreviewUtxoChange, useDecorateWithUtxoFetch } from "@raoul-picconi/mojito-sdk"

function UTXOPreviewExample() {
  const { mutate: previewUtxo } = usePreviewUtxoChange()
  const { mutate: decorateUtxo } = useDecorateWithUtxoFetch()

  // Preview UTXO changes before transaction
  const handlePreview = () => {
    previewUtxo({
      transaction: "transaction_hex",
      addresses: ["address1", "address2"],
    })
  }

  // Decorate transaction with UTXO fetch
  const handleDecorate = () => {
    decorateUtxo({
      transaction: "transaction_hex",
      addresses: ["address1", "address2"],
    })
  }
}
```

#### Bitcoin Wallet Support (v3.1.0+)

This SDK now includes comprehensive Bitcoin wallet support for atomic swaps and HTLC operations:

```javascript
import { useBTCCredentials, useCreateBTCHTLC, useSpendBTCHTLC, useRefundBTCHTLC } from "@raoul-picconi/mojito-sdk"

function BitcoinWalletExample() {
  // Get BTC credentials (address and public key)
  const { data: btcCredentials, isLoading, error } = useBTCCredentials()

  // HTLC operations
  const createHTLC = useCreateBTCHTLC()
  const spendHTLC = useSpendBTCHTLC()
  const refundHTLC = useRefundBTCHTLC()

  // Create Bitcoin HTLC
  const handleCreateHTLC = async () => {
    const request = {
      amount: "1000000", // 0.01 BTC in satoshis
      secretHash: "a1b2c3d4e5f6...",
      recipientPublicKey: "recipient_public_key",
      refundPublicKey: btcCredentials.btcPublicKey,
      timeoutBlocks: 144, // ~24 hours
    }

    const result = await createHTLC.mutateAsync({ request, isTestnet: true })
    console.log("HTLC created:", result.txId)
  }

  // Claim Bitcoin HTLC
  const handleSpendHTLC = async () => {
    const request = {
      type: "spendHtlc",
      utxo: {
        /* HTLC UTXO data */
      },
      redeemScriptHex: "redeem_script_hex",
      to: btcCredentials.btcAddress,
      secret: "revealed_secret_hex",
    }

    const result = await spendHTLC.mutateAsync({ request, isTestnet: true })
    console.log("HTLC claimed:", result.txId)
  }

  // Refund Bitcoin HTLC
  const handleRefundHTLC = async () => {
    const request = {
      type: "refundHtlc",
      utxo: {
        /* HTLC UTXO data */
      },
      redeemScriptHex: "redeem_script_hex",
      to: btcCredentials.btcAddress,
    }

    const result = await refundHTLC.mutateAsync({ request, isTestnet: true })
    console.log("HTLC refunded:", result.txId)
  }

  return (
    <div>
      {btcCredentials && (
        <div>
          <p>BTC Address: {btcCredentials.btcAddress}</p>
          <p>BTC Public Key: {btcCredentials.btcPublicKey}</p>
        </div>
      )}
      <button onClick={handleCreateHTLC}>Create HTLC</button>
      <button onClick={handleSpendHTLC}>Claim HTLC</button>
      <button onClick={handleRefundHTLC}>Refund HTLC</button>
    </div>
  )
}
```

**Note:** Bitcoin wallet functionality requires a wallet that supports Bitcoin operations. Test thoroughly on testnet before using mainnet.

### 1. Using a React Hook to query data (e.g., to display wallet balance)

This example assumes you have a `MintlayerProvider` set up in your React application.

```javascript
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

```javascript
import React from "react"
import { useTransfer } from "@raoul-picconi/mojito-sdk"

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
    mutate({ to, amount })
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
      {isPending && (
        <p>
          Transferring {amount} ML to {to}...
        </p>
      )}
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
