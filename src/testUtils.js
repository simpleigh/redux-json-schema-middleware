export const createStore = state => ({ getState: () => state });

export const emptyStore = createStore({ });

export const noopNext = () => { };

export const testAction = { type: 'test' };
