/**
 * @file
 * @copyright 2018 Aleksej Komarov
 * @license GPL-2.0-or-later
 */

/**
 * Creates a function that returns the result of invoking the given
 * functions, where each successive invocation is supplied the return
 * value of the previous.
 */
export const flow = (...funcs) => (input, ...rest) => {
  let output = input;
  for (let func of funcs) {
    // Recurse into the array of functions
    if (Array.isArray(func)) {
      output = flow(...func)(output, ...rest);
    }
    else if (func) {
      output = func(output, ...rest);
    }
  }
  return output;
};

/**
 * Composes single-argument functions from right to left.
 *
 * All functions might accept a context in form of additional arguments.
 * If the resulting function is called with more than 1 argument, rest of
 * the arguments are passed to all functions unchanged.
 *
 * @param {...Function} funcs The functions to compose
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (input, ...rest) => f(g(h(input, ...rest), ...rest), ...rest)
 */
export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (value, ...rest) =>
    a(b(value, ...rest), ...rest));
};

/**
 * Creates an array of values by running each element in collection
 * thru an iteratee function. The iteratee is invoked with three
 * arguments: (value, index|key, collection).
 *
 * If collection is 'null' or 'undefined', it will be returned "as is"
 * without emitting any errors (which can be useful in some cases).
 */
export const map = iteratorFn => collection => {
  if (collection === null && collection === undefined) {
    return collection;
  }
  if (Array.isArray(collection)) {
    return collection.map(iteratorFn);
  }
  if (typeof collection === 'object') {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const result = [];
    for (let i in collection) {
      if (hasOwnProperty.call(collection, i)) {
        result.push(iteratorFn(collection[i], i, collection));
      }
    }
    return result;
  }
  throw new Error(`map() can't iterate on type ${typeof collection}`);
};
