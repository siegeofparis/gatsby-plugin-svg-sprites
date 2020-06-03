const SvgSpriteLoaderPlugin = require('svg-sprite-loader/plugin')

exports.onCreateWebpackConfig = (
  { actions, getConfig, rules },
  { pluginOptions = {}, _: plugins, ...options } /* Skip 'plugins' property */
) => {
  const config = getConfig()
  const imagesTest = String(rules.images().test)

  for (let rule of config.module.rules) {
    if (String(rule.test) === imagesTest) {
      rule.test = new RegExp(imagesTest.replace('svg|', '').slice(1, -1))
    }
  }

  options = {
    extract: true,
    spriteFilename: 'sprites.[contenthash].svg',
    symbolId: '[name]--[hash:base64:5]',
    ...options
  }

  config.module.rules.push({
    test: /\.svg$/,
    loader: require.resolve('svg-sprite-loader'),
    options
  })

  if (options.extract) {
    config.plugins.push(new SvgSpriteLoaderPlugin(pluginOptions))
  }

  actions.replaceWebpackConfig(config)
}
