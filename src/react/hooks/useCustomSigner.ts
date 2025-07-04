import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { CustomSignerParams, AccountProvider } from "../../types"

/**
 * Hook for using a custom signer with a custom account provider
 * @returns A mutation object for creating and using custom signers
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useCustomSigner() {
  const client = useClient()

  return useMutation({
    mutationFn: async (params: CustomSignerParams) => {
      if (!client) throw new MintlayerClientNotFoundError()

      // This is a placeholder for custom signer functionality
      // The actual implementation would depend on the underlying SDK's custom signer support
      throw new Error("Custom signer functionality is not yet implemented in this SDK wrapper")
    },
  })
}

/**
 * Hook for creating a custom account provider
 * @returns A utility function for creating custom account providers
 */
export function useCreateAccountProvider() {
  return (provider: AccountProvider) => {
    return provider
  }
}
