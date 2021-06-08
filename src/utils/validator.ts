import _ from 'lodash';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const pipe = (...fns: any[]) => (x: unknown) =>
  fns.reduce((v, f) => f(v), x);

type ValidationStruct = {
  errors: { [x: string]: string };
  values: { [x: string]: unknown };
};

/**
 * Validation function
 * @param key Key of object struct
 * @param errorText Error text
 * @param fns
 */
export const validate = (
  key: string,
  errorText = 'Error field',
  ...fns: WithValidatorFuncType[]
) => (formValueObject: ValidationStruct): ValidationStruct => {
  const res = {
    errors: { ...(formValueObject.errors || {}) },
    values: formValueObject.values,
  };
  const value = formValueObject.values[key] || undefined;
  if (!value) {
    return res;
  }
  fns.forEach((f: WithValidatorFuncType) => {
    if (!f(value)) _.set(res.errors, key, errorText);
  });

  return res;
};

declare type WithValidatorFuncType = (x: unknown) => boolean;

/**
 * field validation using a custom function
 * @param {WithValidatorFuncType} f Custom validator func
 */
function withCustom(f: WithValidatorFuncType): WithValidatorFuncType {
  return (x: unknown) => f(x);
}

/**
 * field validation is field is not null|undefinde
 * @param {WithValidatorFuncType} f Custom validator func
 */
function withRequired(): WithValidatorFuncType {
  return (x: unknown) => x !== undefined;
}

/**
 * field validation by string type and parameters
 * @param {String} minlen
 * @param {String} maxlen
 * @returns {WithValidatorFuncType}
 */
function withString(
  minlen: number = Number.MIN_SAFE_INTEGER,
  maxlen: number = Number.MAX_SAFE_INTEGER,
): WithValidatorFuncType {
  return (x: unknown) =>
    typeof x === 'string' && x.length > minlen && x.length < maxlen;
}

/**
 * field validation by number type and parameters
 * @param  {Number} min
 * @param  {Number} max
 * @returns {WithValidatorFuncType}
 */
function withNumber(
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER,
): WithValidatorFuncType {
  return (x: unknown) => typeof x === 'number' && x > min && x < max;
}

export default {
  withCustom,
  withString,
  withRequired,
  withNumber,
  pipe,
  validate,
};
