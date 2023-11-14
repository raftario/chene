/** Case-insensitive dictionary of valid path segment characters */
const DICTIONARY = [
  "/",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "%",
  ".",
  "-",
  "_",
  "@",
  "~",
  "+",
  "=",
  "$",
  "&",
  ",",
  ";",
  "!",
  "'",
  "(",
  ")",
]
/** Empty literal segment map for copying */
const EMPTY_DICTIONARY = DICTIONARY.map(() => undefined)
/** Lookup dictionnary for the slot of every ASCII character */
const LOOKUP_DICTIONARY = [...Array(128).keys()].map((c) => {
  const idx = DICTIONARY.indexOf(String.fromCharCode(c).toLowerCase())
  return idx >= 0 ? idx : DICTIONARY.length
})

const SLASH = "/".charCodeAt(0)
const COLON = ":".charCodeAt(0)
const STAR = "*".charCodeAt(0)

interface Node<T> {
  /** Value for terminal nodes of a route */
  value: ((matched: Record<string, unknown>) => T) | undefined
  /** Generic matching and capturing function of all edge types */
  matcher: (path: string, matched: Record<string, unknown>) => number
  /** Verbatim segment of the inserted route including */
  verbatim: string

  /** Literal segments mapped by the slot of their first character in the dictionary */
  literal?: (Branch<T> | undefined)[]
  /** Named capture for one segment (:) */
  one?: Branch<T>
  /** Named capture for any number of segments (*) */
  any?: Node<T>
}
type Branch<T> = Node<T> & {
  literal: (Branch<T> | undefined)[]
}

type TrieSummary =
  | symbol
  | { [segment: string]: TrieSummary }
  | [symbol, { [segment: string]: TrieSummary }]

/**
 * Returns the slot of the given character codepoint in the dictionary,
 * assuming it is a valid path segment character.
 *
 * @param code - ASCII codepoint
 * @returns Slot of the given character in the dictionary
 */
function slot(code: number): number {
  return LOOKUP_DICTIONARY[code]!
}

function validate(route: string): void {
  if (route.length === 0 || route.charCodeAt(0) !== SLASH) {
    throw new Error("Route must start with a slash (/)")
  }

  for (let i = 0; i < route.length; i++) {
    const c = route.charCodeAt(i)
    const valid = slot(c) < DICTIONARY.length || c === COLON || c === STAR
    if (!valid) throw new Error(`Invalid character in route (${route[i]})`)
  }
}

/** Normalises a path before operating on it */
function normalise(path: string): string {
  if (path.length > 1 && path.charCodeAt(path.length - 1) === SLASH)
    path = path.slice(0, -1)
  return path
}

/** Checks if a path segment starts with a prefix case-insensitively */
function startsWith(prefix: string, s: string): boolean {
  for (let i = 0; i < prefix.length; i++) {
    if (slot(prefix.charCodeAt(i)) !== slot(s.charCodeAt(i))) return false
  }
  return true
}

/** Returns the path contents until the first forwards slash */
function nonSlash(path: string): string {
  let i = 0
  while (i < path.length && path.charCodeAt(i) !== SLASH) i++
  return path.slice(0, i)
}

/** Returns the path contents until the first colon or star */
function nonSpecial(path: string): string {
  let i = 0
  for (; i < path.length; i++) {
    const c = path.charCodeAt(i)
    if (c === COLON || c === STAR) break
  }
  return path.slice(0, i)
}

/** Returns the shared case-insensitive prefix of two string excluding colons and stars */
function nonSpecialLcs(l: string, r: string): string {
  let i = 0
  for (; i < l.length && i < r.length; i++) {
    const lc = l.charCodeAt(i)
    if (lc === COLON || lc === STAR) break

    const rc = r.charCodeAt(i)
    if (slot(lc) !== slot(rc)) break
  }

  return l.slice(0, i)
}

/** Returns a matcher function for the given literal */
function literalMatcher(literal: string): (path: string) => number {
  return (path) => (startsWith(literal, path) ? literal.length : 0)
}

function match<T>(
  path: string,
  node: Node<T>,
  matched: Record<string, unknown>,
  backtrack: { path: typeof path; node: typeof node; matched: typeof matched }[] = [],
): T | undefined {
  const b = () => {
    while (backtrack.length !== 0) {
      const { path, node, matched } = backtrack.pop()!
      const value = match(path, node, matched, [])
      if (value !== undefined) {
        return value
      }
    }
    return undefined
  }

  const consumed = node.matcher(path, matched)
  path = path.slice(consumed)

  if (path.length === 0 && node.value !== undefined) return node.value(matched)

  // didn't match or matched everything but no associated value
  if (consumed === 0 || path.length === 0) return b()

  if (node.one) backtrack.push({ path, node: node.one, matched: { ...matched } })
  if (node.any) backtrack.push({ path, node: node.any, matched: { ...matched } })

  const next = node.literal?.[slot(path.charCodeAt(0))]
  if (!next) return b()

  return match(path, next, matched, backtrack)
}

function update<T, R>(
  path: string,
  node: Branch<T>,
  f: (node: Node<T>, prefix?: string) => R,
  prefix?: string,
): R {
  prefix ??= nonSpecialLcs(path, node.verbatim)
  path = path.slice(prefix.length)

  // we only matched part of the current node so we need to split it
  if (prefix.length !== 0 && prefix.length !== node.verbatim.length) {
    const newVerbatim = node.verbatim.slice(prefix.length)
    const newNode: Branch<T> = {
      ...node,
      matcher: literalMatcher(newVerbatim),
      verbatim: newVerbatim,
    }

    node.literal = [...EMPTY_DICTIONARY]
    node.literal[slot(newVerbatim.charCodeAt(0))] = newNode

    node.value = undefined
    node.matcher = literalMatcher(prefix)
    node.verbatim = prefix
    node.one = undefined
    node.any = undefined
  }

  // we matched the entire path so we update the current node
  if (path.length === 0) return f(node)

  let next: Branch<T> | undefined = undefined
  let nextPrefix: string | undefined = undefined

  const c = path.charCodeAt(0)
  // capture one segment
  if (c === COLON) {
    const verbatim = nonSlash(path)

    if (node.one && node.one.verbatim !== verbatim) {
      throw new Error(
        `Cannot assign different names to same :named segment (${node.one.verbatim} vs ${verbatim})`,
      )
    } else if (!node.one) {
      const name = verbatim.slice(1)

      node.one = {
        value: undefined,
        matcher: (path, matched) => {
          const segment = nonSlash(path)
          matched[name] = decodeURIComponent(segment)
          return segment.length
        },
        verbatim,
        literal: [...EMPTY_DICTIONARY],
      }
    }

    next = node.one
    nextPrefix = verbatim
  }
  // capture any segments
  else if (c === STAR) {
    if (node.any && node.any.verbatim !== path) {
      throw new Error(
        `Cannot assign different names to same *named segment (${node.any.verbatim} vs ${path})`,
      )
    } else if (!node.any) {
      const name = path.slice(1)

      node.any = {
        value: undefined,
        matcher: (path, matched) => {
          matched[name] = decodeURIComponent(path)
          return path.length
        },
        verbatim: path,
      }
    }

    return f(node.any)
  }
  // literal
  else {
    const s = slot(c)
    next = node.literal[s]

    // next literal node needs to be created
    if (!next) {
      const verbatim = nonSpecial(path)

      next = {
        value: undefined,
        matcher: literalMatcher(verbatim),
        verbatim,
        literal: [...EMPTY_DICTIONARY],
      }
      nextPrefix = verbatim

      node.literal[s] = next
    }
  }

  return update(path, next, f, nextPrefix)
}

export type Match<Path extends string> =
  Path extends `${infer Prefix}/` ? Match<Prefix>
  : Path extends `${infer Prefix}*${infer Any}` ? Match<Prefix> & { [K in Any]: string }
  : Path extends `${infer Prefix}:${infer One}/${infer Suffix}` ?
    Match<Prefix> & { [K in One]: string } & Match<Suffix>
  : Path extends `${infer Prefix}:${infer One}` ? Match<Prefix> & { [K in One]: string }
  : Record<string, never>

export class Trie<T> {
  readonly #root: Branch<T> = {
    value: undefined,
    verbatim: "/",
    matcher: () => 1,
    literal: [...EMPTY_DICTIONARY],
  }

  public match(path: string): T | undefined {
    return match(normalise(path), this.#root, {}, [])
  }

  public insert<const Route extends string>(
    route: Route,
    value: (matched: Match<Route>) => T,
  ): void {
    validate(route)
    update(
      normalise(route),
      this.#root,
      (node) => {
        if (node.value !== undefined) throw new Error(`Conflicting route (${route}))`)
        node.value = value as Node<T>["value"]
      },
      this.#root.verbatim,
    )
  }

  public summary(): TrieSummary {
    const s = (node: Node<T>): TrieSummary => {
      const summary: TrieSummary = {}
      const leaf = Symbol.for("leaf")

      const children: (Node<T> | undefined)[] = node.literal ?? []
      if (node.one) children.push(node.one)
      if (node.any) children.push(node.any)

      for (const child of children) {
        if (!child) continue
        const childSummary = s(child)
        summary[child.verbatim] = childSummary
      }

      if (node.value !== undefined && Object.keys(summary).length === 0) {
        return leaf
      } else if (node.value === undefined) {
        return summary
      } else {
        return [leaf, summary]
      }
    }

    return s(this.#root)
  }
}
