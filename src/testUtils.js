export const catchError = (fn) => {
  try {
    fn();
    fail();  // fn didn't throw
  } catch (e) {
    return e;
  }
};

export const createStore = state => ({ getState: () => state });

export const emptyStore = createStore({ });

export const noopNext = () => { };

export const testAction = { type: 'test' };
