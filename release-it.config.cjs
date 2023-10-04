/**
 * 安装: npm install -D release-it @release-it/conventional-changelog
 * 设置: npx release-it --config release-it.config.js
 * 使用: npx release-it
 */
module.exports = {
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      preset: {
        name: 'conventionalcommits',
        header: '# Changelog',
        types: [
          { type: 'feat', section: '✨ Features' },
          { type: 'fix', section: '🐞 Bug Fixes' },
          { type: 'docs', hidden: true },
          { type: 'chore', hidden: true },
          { type: 'style', hidden: true },
          { type: 'refactor', hidden: true },
          { type: 'perf', hidden: true },
          { type: 'test', hidden: true },
        ],
      },
    },
  },
  hooks: {
    'after:bump': 'echo 更新 version 成功',
  },
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: 'chore: release v${version}',
    commit: true,
    tag: true,
    push: true,
  },
  github: {
    release: true,
  },
  npm: {
    publish: false,
  },
}
