/**
 * Helper function to safely access localStorage.
 * @param key - The key of the item to retrieve from localStorage.
 * @returns The value associated with the key, or null if not found or if window is undefined.
 */
function getLocalStorage(key: string): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

/**
 * Helper function to safely set an item in localStorage.
 * @param key - The key of the item to set in localStorage.
 * @param value - The value to associate with the key.
 */
function setLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

/**
 * Helper function to safely remove an item from localStorage.
 * @param key - The key of the item to remove from localStorage.
 */
function removeLocalStorage(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}

export const localStorageService = {
  getItem: getLocalStorage,
  setItem: setLocalStorage,
  removeItem: removeLocalStorage,
}
