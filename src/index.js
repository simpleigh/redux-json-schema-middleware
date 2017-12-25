const middlewareConfig = { };

export default (config = { }) => {
  return store => next => action => {
    return next(action);
  };
};
