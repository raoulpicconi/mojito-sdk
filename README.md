# Mojito SDK

A JavaScript SDK for interacting with the Mojito Mintlayer Wallet browser extension.

## Installation
```bash
npm install mojito-sdk
```

## Usage

```javascript
import MojitoSDK from 'mojito-sdk';

// Check if extension is installed
const isInstalled = await MojitoSDK.isInstalled();
if (!isInstalled) {
    console.log('Please install the Mojito wallet extension');
    return;
}

// Initialize the SDK
await MojitoSDK.initialize();

// Connect to the wallet
const connected = await MojitoSDK.connect();

if (connected) {
    console.log('Connected to Mojito wallet!');
    // Get wallet addresses
    const addresses = await MojitoSDK.wallet.getAddresses();
    console.log('Wallet addresses:', addresses);
}
```

## Features

- Connect to Mojito wallet extension
- Get wallet addresses
- Send transactions
- Create delegations and stake tokens
- Manage NFTs
- Sign and verify messages

## API Reference

### Core Methods

- `MojitoSDK.initialize()` - Initialize the SDK
- `MojitoSDK.connect()` - Connect to the wallet
- `MojitoSDK.getVersion()` - Get extension version
- `MojitoSDK.isInstalled()` - Check if extension is installed

### Wallet Methods

- `MojitoSDK.wallet.getAddresses()` - Get wallet addresses
- `MojitoSDK.wallet.signMessage(message)` - Sign a message
- `MojitoSDK.wallet.sendTransaction({ to, amount, tokenId })` - Send a transaction

### Staking Methods

- `MojitoSDK.staking.createDelegation({ poolId, referralCode })` - Create a delegation
- `MojitoSDK.staking.addStake({ delegationId, amount })` - Add stake to a delegation
- `MojitoSDK.staking.getDelegations()` - Get delegations for the current wallet

### NFT Methods

- `MojitoSDK.nft.getNFTs()` - Get NFTs owned by the current wallet
- `MojitoSDK.nft.sendNFT({ tokenId, to })` - Send an NFT
- `MojitoSDK.nft.mintNFT({ metadata })` - Mint a new NFT

### Utility Methods

- `MojitoSDK.utils.formatAmount(amount, decimals)` - Format amount to display format
- `MojitoSDK.utils.parseAmount(amount, decimals)` - Parse amount to smallest unit

## License

MIT

