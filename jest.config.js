import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync(`./.swcrc`, 'utf-8'));

export default {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config }],
  },
  testEnvironment: 'node',
  testRegex: './src/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  roots: ['<rootDir>/src'],
};
