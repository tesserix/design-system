import styleqModule from 'styleq/styleq.js'

type StyleqModule = {
  styleq?: unknown
  default?: unknown
}

const mod = styleqModule as StyleqModule
export const styleq = (mod.styleq ?? mod.default ?? mod) as (...args: unknown[]) => unknown

export default { styleq }
