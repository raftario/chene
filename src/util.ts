export function merge<Into, From>(into: Into, from: From): Into & From {
  if (!isSimpleObject(into) || !isSimpleObject(from)) {
    return from as Into & From
  }

  const merged: Record<string | symbol, unknown> = {}
  for (const key of Reflect.ownKeys(into)) {
    if (!(key in from)) {
      merged[key] = into[key]
    } else {
      merged[key] = merge(into[key], from[key])
    }
  }
  for (const key of Reflect.ownKeys(from)) {
    if (!(key in merged)) {
      merged[key] = from[key]
    }
  }

  return merged as Into & From
}

function isSimpleObject(value: unknown): value is Record<string | symbol, unknown> {
  if (typeof value !== "object" || value === null) return false

  const proto = Reflect.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}
