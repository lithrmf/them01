/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // prettier专注于代码的美观度，是格式化工具
    // 前置条件：
    // 1.禁用掉VSCode中的扩展 prettier(如果有的话)，关闭掉 format on save
    // 2.安装Eslint插件，并配置保存时自动修复(前面已经弄过了)
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 单引号
        semi: false, // 无分号
        printWidth: 80, // 每行宽度至多80字符
        trailingComma: 'none', // 不加对象|数组最后逗号
        endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
      }
    ],
    // Eslint关注于规范，如果不符合规范，报错
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
      }
    ],
    // 关闭 props 解构的校验 (props解构丢失响应式，但是我们可以自己解决，所以关闭这条校验)
    'vue/no-setup-props-destructure': ['off'],
    // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
    'no-undef': 'off'
  }
}
