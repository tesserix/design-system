import * as parserModule from 'postcss-value-parser/lib/index.js'

const parser = (parserModule as { default?: unknown }).default ?? parserModule

export default parser
