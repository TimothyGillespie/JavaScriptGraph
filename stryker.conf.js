/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress', 'json'],
    testRunner: 'jest',
    coverageAnalysis: 'perTest',
    ignorePatterns: ['lib'],
};
