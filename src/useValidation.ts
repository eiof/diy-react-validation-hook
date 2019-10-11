import { useState } from 'react';
import produce from 'immer';
import Promise from 'bluebird';

export type Validator = () => Promise<any>;

export type ValidatorMap = { [any: string]: Validator };

export type BeforeValidate = () => void;

export type AfterValidate = (errors: {}[]) => void;

export interface ValidationError extends TypeError {
  ref?: React.RefObject<HTMLInputElement> | null;
}

const useValidation = () => {
  const [validatorsState, setValidators] = useState<ValidatorMap>({});
  const [errorsState, setErrors] = useState<ValidationError[]>([]);

  const registerValidators = (validators: ValidatorMap) => {
    setValidators(
      produce(draft => {
        Object.keys(validators).forEach(key => {
          draft[key] = validators[key];
        });
      })
    );
  };

  const unregisterValidators = (validatorKeys: string[]) => {
    setValidators(
      produce(draft => {
        validatorKeys.forEach(key => {
          delete draft[key];
        });
      })
    );
  };

  const validate = (options: {
    beforeValidate?: BeforeValidate;
    afterValidate?: AfterValidate;
  }) => {
    if (options.beforeValidate) options.beforeValidate();

    const promiseCallbacks = Object.values(validatorsState);
    Promise.all(
      promiseCallbacks.map(promiseCallback => {
        return Promise.resolve(promiseCallback()).reflect();
      })
    ).then((inspections: Promise.Inspection<TypeError>[]) => {
      const errors: ValidationError[] = [];
      inspections.forEach(inspection => {
        if (inspection.isRejected()) {
          errors.push(inspection.reason());
        }
      });

      setErrors(errors);

      if (options.afterValidate) options.afterValidate(errors);
    });
  };

  const reset = () => {
    setErrors([]);
  };

  return {
    registerValidators,
    unregisterValidators,
    validate,
    reset,
    errors: errorsState
  };
};

export default useValidation;
