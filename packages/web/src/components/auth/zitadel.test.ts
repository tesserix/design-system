import { describe, expect, it } from "vitest"

import { describeLoginName, evaluatePasswordRules } from "./auth-policy"
import { fromZitadel, zitadelBranding, zitadelMethodPolicy, zitadelPasswordPolicy } from "./zitadel"

describe("zitadelBranding", () => {
  it("splits the flat light/dark colour fields into the two surfaces", () => {
    const branding = zitadelBranding({
      primaryColor: "#111111",
      backgroundColor: "#FFFFFF",
      primaryColorDark: "#AAAAAA",
    })

    expect(branding?.light).toMatchObject({ primary: "#111111", background: "#FFFFFF" })
    expect(branding?.dark?.primary).toBe("#AAAAAA")
  })

  it("maps disableWatermark onto the neutral hideWatermark", () => {
    expect(zitadelBranding({ disableWatermark: true })?.hideWatermark).toBe(true)
  })

  it("returns undefined for an absent policy so the caller stays on defaults", () => {
    expect(zitadelBranding(undefined)).toBeUndefined()
  })
})

describe("zitadelMethodPolicy", () => {
  it("translates Zitadel's negative flags into positive ones", () => {
    const methods = zitadelMethodPolicy({ disableLoginWithEmail: true, disableLoginWithPhone: false })

    expect(methods?.allowEmailLogin).toBe(false)
    expect(methods?.allowPhoneLogin).toBe(true)
    expect(describeLoginName(methods)).toBe("Username or phone number")
  })

  it("leaves an unset flag undefined so the permissive default survives", () => {
    const methods = zitadelMethodPolicy({ allowRegister: true })

    expect(methods?.allowEmailLogin).toBeUndefined()
    expect(describeLoginName(methods)).toBe("Username, email or phone number")
  })

  it("maps passwordlessType onto allowPasskeys", () => {
    expect(zitadelMethodPolicy({ passwordlessType: "allowed" })?.allowPasskeys).toBe(true)
    expect(zitadelMethodPolicy({ passwordlessType: "notAllowed" })?.allowPasskeys).toBe(false)
  })

  it("renames every second factor", () => {
    expect(zitadelMethodPolicy({ secondFactors: ["otp", "u2f", "otpEmail", "otpSms"] })?.secondFactors).toEqual([
      "totp",
      "securityKey",
      "emailCode",
      "smsCode",
    ])
  })
})

describe("zitadelPasswordPolicy", () => {
  it("renames the has* flags to require*", () => {
    const policy = zitadelPasswordPolicy({ minLength: 12, hasUppercase: true, hasSymbol: true })

    expect(policy).toMatchObject({ minLength: 12, requireUppercase: true, requireSymbol: true })
    expect(evaluatePasswordRules("abc", policy).map((rule) => rule.id)).toEqual([
      "minLength",
      "uppercase",
      "symbol",
    ])
  })
})

describe("fromZitadel", () => {
  it("maps a whole bundle in one call", () => {
    const policies = fromZitadel({
      label: { primaryColor: "#111111", disableWatermark: true },
      login: { allowUsernamePassword: true, passwordlessType: "allowed", secondFactors: ["otp"] },
      passwordComplexity: { minLength: 10, hasNumber: true },
      lockout: { maxPasswordAttempts: 5 },
      privacy: { tosLink: "https://example.test/tos", privacyLink: "https://example.test/privacy" },
    })

    expect(policies.branding?.light?.primary).toBe("#111111")
    expect(policies.methods?.allowPasskeys).toBe(true)
    expect(policies.methods?.secondFactors).toEqual(["totp"])
    expect(policies.password?.requireNumber).toBe(true)
    expect(policies.lockout?.maxPasswordAttempts).toBe(5)
    expect(policies.legal?.termsUrl).toBe("https://example.test/tos")
  })

  it("yields an all-undefined bundle for an empty input, which is plain auth", () => {
    expect(fromZitadel({})).toEqual({
      branding: undefined,
      methods: undefined,
      password: undefined,
      lockout: undefined,
      legal: undefined,
    })
  })
})
