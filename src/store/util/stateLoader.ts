import { APP_VERSION } from 'config';

export const loadState = (): any => {
  try {
    const serializedState = localStorage.getItem('amp_think_state');
    if (serializedState === null) {
      return {};
    }
    const parsed = JSON.parse(serializedState);

    if (parsed.settings && parsed.settings.app_version !== APP_VERSION) {
      return {};
    }

    return parsed;
  } catch (err) {
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const saveState = (state: any): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('amp_think_state', serializedState);
  } catch (err) {
    // TODO: Logging
  }
};
