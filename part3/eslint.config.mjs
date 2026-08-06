import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs, // 注册插件命名空间
    },
    rules: {
      // 1. 强制使用 2 个空格缩进
      '@stylistic/js/indent': ['error', 2],
      
      // 2. 强制换行符使用 Unix 格式 (\n / LF)
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      
      // 3. 强制在代码中使用单引号
      '@stylistic/js/quotes': ['error', 'single'],
      
      // 4. 强制不在语句末尾加分号
      '@stylistic/js/semi': ['error', 'never'],
    },
  },
	{
		ignores: ['dist/**'],
	}
]
