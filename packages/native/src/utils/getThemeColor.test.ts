import { hslToRgba } from '@tesserix/tokens'
import { getThemeColor } from './getThemeColor'

describe('getThemeColor', () => {
  const testGlobal = globalThis as any
  const originalWindow = testGlobal.window
  const originalDocument = testGlobal.document
  const originalGetComputedStyle = testGlobal.getComputedStyle

  afterEach(() => {
    testGlobal.window = originalWindow
    testGlobal.document = originalDocument
    testGlobal.getComputedStyle = originalGetComputedStyle
    jest.restoreAllMocks()
  })

  it('returns fallback when DOM is unavailable', () => {
    testGlobal.window = undefined
    testGlobal.document = undefined

    expect(getThemeColor('--primary', '#3b82f6')).toBe('#3b82f6')
  })

  it('converts HSL triplet CSS variable values to rgba', () => {
    testGlobal.window = {} as Window
    testGlobal.document = { documentElement: {} as HTMLElement } as Document
    testGlobal.getComputedStyle = jest.fn(() => ({
      getPropertyValue: jest.fn(() => '215 16% 47%'),
    })) as unknown as typeof getComputedStyle

    expect(getThemeColor('--primary', '#3b82f6')).toBe(hslToRgba('215 16% 47%'))
  })

  it('returns non-HSL values as-is', () => {
    testGlobal.window = {} as Window
    testGlobal.document = { documentElement: {} as HTMLElement } as Document
    testGlobal.getComputedStyle = jest.fn(() => ({
      getPropertyValue: jest.fn(() => '#10b981'),
    })) as unknown as typeof getComputedStyle

    expect(getThemeColor('--accent', '#3b82f6')).toBe('#10b981')
  })

  it('prefers Storybook globals and token map when available', () => {
    testGlobal.document = {
      documentElement: {
        getAttribute: jest.fn(() => 'default'),
        classList: { contains: jest.fn(() => true) },
      },
    } as unknown as Document
    testGlobal.window = {
      __TESSERIX_STORYBOOK_THEME__: 'default',
      __TESSERIX_STORYBOOK_MODE__: 'dark',
    } as unknown as Window

    expect(getThemeColor('--primary', '#3b82f6')).toBe(hslToRgba('239 84% 76%'))
  })
})
