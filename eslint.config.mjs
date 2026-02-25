// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    'public',
    'dist',
    'node_modules',
    '*.local',
    '*.log*',
    'README.md',
    'src/views/demos/**',
  ],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-alert': 'off',
    'vue/custom-event-name-casing': ['error', 'camelCase'],
  },
})
