import { Trie } from "./trie.js"

describe("Trie", () => {
  const trie = new Trie<string>()
  trie.insert("/hello/:name", ({ name }) => `Hello, ${name} !`)
  trie.insert("/hello/there", () => "Anakin")
  trie.insert("/h", () => "ijklmnop")
  trie.insert("/hell*ish", ({ ish }) => `Hell${ish} !`)
  trie.insert(
    "/help/:name/find/their/*thing",
    ({ name, thing }) => `Found ${name}'s ${thing} !`,
  )

  it("matches literals", () => {
    expect(trie.match("/hello/there")).toBe("Anakin")
    expect(trie.match("/h")).toBe("ijklmnop")
  })

  it("matches named segments", () => {
    expect(trie.match("/hello/Alex")).toBe("Hello, Alex !")
    expect(trie.match("/hellevator")).toBe("Hellevator !")
    expect(trie.match("/help/Ahsoka/find/their/two%20lightsabers")).toBe(
      "Found Ahsoka's two lightsabers !",
    )
  })

  it("matches literals case-insensitively", () => {
    expect(trie.match("/HELLo/therE")).toBe("Anakin")
  })

  it("matches only as many segments as were defined", () => {
    expect(trie.match("/hello/darkness/my/old/friend")).toBe(
      "Hello/darkness/my/old/friend !",
    )
  })

  it("returns undefined if no match is found", () => {
    expect(trie.match("/goodbye")).toBeUndefined()
  })

  it("throws when defining a duplicate route", () => {
    expect(() => trie.insert("/hello/there", () => "General Grievous")).toThrow()
    expect(() => trie.insert("/hello/:name", () => "Hello !")).toThrow()
    expect(() => trie.insert("/hell*ish", () => "Hell !")).toThrow()
  })

  it("throws when defining conflicting named segments", () => {
    expect(() =>
      trie.insert("/hello/:id/profile", ({ id }) => `${id}'s profile`),
    ).toThrow()
    expect(() =>
      trie.insert("/hell*spawn", () => "The Slayer has entered the facility"),
    ).toThrow()
  })

  it("has the expected structure", () => {
    const leaf = Symbol.for("leaf")
    const summary = trie.summary()
    expect(summary).toEqual({
      h: [
        leaf,
        {
          el: {
            l: {
              "o/": {
                there: leaf,
                ":name": leaf,
              },
              "*ish": leaf,
            },
            "p/": {
              ":name": {
                "/find/their/": {
                  "*thing": leaf,
                },
              },
            },
          },
        },
      ],
    })
  })
})
