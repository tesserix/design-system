const path = require('path')
const fs = require('fs')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)
config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

const resolveFile = (basePath) => {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.jsx'),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate))
}

const workspacePackages = {
  '@tesserix/native': path.join(workspaceRoot, 'packages/native/src'),
  '@tesserix/tokens': path.join(workspaceRoot, 'packages/tokens/src'),
  '@tesserix/hooks': path.join(workspaceRoot, 'packages/hooks/src'),
  '@tesserix/utils': path.join(workspaceRoot, 'packages/utils/src'),
  '@tesserix/icons': path.join(workspaceRoot, 'packages/icons/src'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const direct = workspacePackages[moduleName]
  if (direct) {
    const target = resolveFile(path.join(direct, 'index'))
    if (target) return context.resolveRequest(context, target, platform)
  }

  for (const [pkgName, pkgSrcRoot] of Object.entries(workspacePackages)) {
    const prefix = `${pkgName}/`
    if (moduleName.startsWith(prefix)) {
      const subPath = moduleName.slice(prefix.length)
      const target = resolveFile(path.join(pkgSrcRoot, subPath))
      if (target) return context.resolveRequest(context, target, platform)
    }
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
