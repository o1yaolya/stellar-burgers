/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Настройка алиасов для модулей
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types'
  },

  // Сбор информации о покрытии кода
  collectCoverage: true,

  // Директория для отчётов о покрытии
  coverageDirectory: 'coverage',

  // Поставщик для сбора покрытия
  coverageProvider: 'v8',

  // Дополнительные настройки для TypeScript
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Паттерны для поиска тестовых файлов
  testMatch: ['**/**/*.test.[jt]s?(x)', '**/**/*_test.[jt]s?(x)'],

  // Игнорируемые директории
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$']
};

export default config;
