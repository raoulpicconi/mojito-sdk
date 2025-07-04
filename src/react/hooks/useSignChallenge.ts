import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { SignChallengeParams } from "../../types"

/**
 * Hook for signing arbitrary messages/challenges for authentication
 * @returns A mutation object for signing challenges that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useSignChallenge() {
  const client = useClient()

  return useMutation({
    mutationFn: async (params: SignChallengeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.signChallenge(params)
    },
  })
}
