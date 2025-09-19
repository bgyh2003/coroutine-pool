/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',            // 使用 ts-jest 处理 TypeScript
    testEnvironment: 'node',       // 测试环境
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',   // 所有 ts/tsx 文件用 ts-jest 转译
    },
    testMatch: ['**/tests/**/*.test.ts'], // 指定测试文件路径
    clearMocks: true,              // 自动清理 mock
};

export default config;
