import { AddressData } from "./types"

/**
 * Performs a deep equality comparison between two values
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if the values are deeply equal, false otherwise
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  const typeA = typeof a
  const typeB = typeof b

  if (typeA !== typeB) return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  if (typeA === "object") {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      return deepEqual(a[key], b[key])
    })
  }

  return a === b
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Normalizes a URL by ensuring it has a protocol and no trailing slash
 * @param url - The URL to normalize
 * @returns The normalized URL
 * @throws Error if the URL is invalid
 */
export function normalizeUrl(url: string): string {
  if (!isValidUrl(url)) {
    throw new Error("Invalid URL provided")
  }

  const normalized = url.endsWith("/") ? url.slice(0, -1) : url
  return normalized
}

/**
 * Generates a hash of the addresses in the AccountAddresses object
 * @param address - The AccountAddresses object to hash
 * @returns A promise that resolves to the hash of the addresses
 */
export async function getAddressesHash(address: AddressData | null): Promise<string> {
  if (!address) return ""
  const data = new TextEncoder().encode(JSON.stringify(Object.values(address).flat()))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}
