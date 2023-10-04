/**
 * 安装: npm install -D eslint @antfu/eslint-config
 * 设置: 在.vscode->settings.json设置自动格式化(其他设置package.json已添加)
 * 使用: hooks上自动触发
 */
import antfu from '@antfu/eslint-config'

export default antfu(
  // 插件的基础配置
  {
    typescript: false,
    ignores: [
      'dist',
    ],
  },
  // eslint的扁平化配置
  {
    rules: {
      // 在生产环境下警告不允许使用console
      'no-console': 'off',
    },
  },
)
