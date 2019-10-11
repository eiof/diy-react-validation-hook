import { RefObject } from 'react';
import Promise from 'bluebird';

export const OK = 'ok';

export type BasicValidator<R> = <T extends any>(
  ref: RefObject<R> | null,
  error: T,
  options?: any
) => Promise<any>;

// Basic Validators
export const requiredField: BasicValidator<HTMLInputElement> = (ref, error) => {
  if (ref && ref.current && !ref.current.required)
    console.warn('Input must have the required attribute');
  const meetsRequiredAndType =
    ref &&
    ref.current &&
    !ref.current.validity.typeMismatch &&
    ref.current.validity.valid;
  const valueIsPresent = ref && ref.current && !ref.current.validity.valueMissing;
  return meetsRequiredAndType || valueIsPresent
    ? Promise.resolve(OK)
    : Promise.reject(error);
};

export const isGreaterThan: BasicValidator<HTMLInputElement> = (
  ref,
  error,
  { value }
) => {
  return ref && ref.current && Math.ceil(parseFloat(ref.current.value)) > value
    ? Promise.resolve(OK)
    : Promise.reject(error);
};

export const maxLengthField = <T extends any>(
  ref: RefObject<HTMLInputElement>,
  maxLength: number,
  error: T
): Promise<any> => {
  return ref && ref.current && ref.current.value.length <= maxLength
    ? Promise.resolve(OK)
    : Promise.reject(error);
};
