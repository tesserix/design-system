import { describe, expect, it } from "vitest"

import { generateMockProducts, generateMockUsers } from "./mock-data"

describe("mock data generators", () => {
  it("generates requested user count", () => {
    expect(generateMockUsers(3)).toHaveLength(3)
  })

  it("generates requested product count", () => {
    expect(generateMockProducts(4)).toHaveLength(4)
  })
})
