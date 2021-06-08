// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import SetupRoot from './SetupRoot';
import { render as rtlRender } from '@testing-library/react';

const render = (ui: any, { ...renderOptions } = {}) =>
  rtlRender(ui, { wrapper: SetupRoot, ...renderOptions });

const rndText = (length: number): string =>
  Math.random().toString(36).substring(length);

export * from '@testing-library/react';
export * from '@testing-library/jest-dom';

export { render, rndText };
