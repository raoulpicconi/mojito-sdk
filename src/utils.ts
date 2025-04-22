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
