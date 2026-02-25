import localizeModule from 'styleq/transform-localize-style.js'

type LocalizeModule = {
  localizeStyle?: unknown
  default?: unknown
}

const mod = localizeModule as LocalizeModule
export const localizeStyle = (mod.localizeStyle ?? mod.default ?? mod) as (
  style: Record<string, unknown>,
  isRTL: boolean
) => Record<string, unknown>

export default { localizeStyle }
