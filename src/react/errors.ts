export class MintlayerProviderNotFoundError extends Error {
  constructor() {
    super("`useConfig` must be used within a `MintlayerProvider`.")
  }
}

export class MintlayerClientNotFoundError extends Error {
  constructor() {
    super("`useClient` must be used within a `MintlayerProvider`.")
  }
}
