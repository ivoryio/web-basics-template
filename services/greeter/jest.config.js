module.exports = {
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test/reports',
        filename: 'unit-tests-report.html',
        expand: true
      }
    ]
  ]
}
