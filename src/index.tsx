import { hot } from 'react-hot-loader/root';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import useValidation, { ValidationError } from './useValidation';
import { isGreaterThan, requiredField } from './validators';

const Form: React.FC = () => {
  const { registerValidators, validate, errors } = useValidation();
  const numberRef = useRef<HTMLInputElement>(null);
  const checkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerValidators({
      numberGreaterThan: () =>
        Promise.all([
          requiredField<ValidationError>(numberRef, {
            ref: numberRef,
            message: 'Number is required',
            name: 'numberRequired'
          }),
          isGreaterThan<ValidationError>(
            numberRef,
            {
              ref: numberRef,
              message: 'Number must be greater than one',
              name: 'numberGreaterThan'
            },
            {
              value: 1
            }
          )
        ]),
      checkRequired: () =>
        requiredField<ValidationError>(checkRef, {
          ref: checkRef,
          message: 'Please recognize form validation',
          name: 'checkRequired'
        })
    });
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-4">
          <form
            className="mt-3"
            id="example"
            noValidate
            onSubmit={event => {
              event.preventDefault();
              validate({
                afterValidate: (errors: ValidationError[]) => {
                  if (errors.length > 0) {
                    // could be made into a utility
                    if (errors[0].ref && errors[0].ref.current) {
                      errors[0].ref.current.focus();
                    }
                    return;
                  }
                }
              });
              // do whatever else
            }}
          >
            <div className="form-group">
              <label htmlFor="number">
                Number greater than one <span className="text-danger">*</span>
              </label>
              <input
                ref={numberRef}
                name="number"
                className="form-control"
                id="number"
                placeholder="Enter number"
                required
              />
            </div>
            <div className="form-group form-check">
              <input
                ref={checkRef}
                type="checkbox"
                className="form-check-input"
                id="check"
                required
              />
              <label className="form-check-label" htmlFor="check">
                I understand there is form validation{' '}
                <span className="text-danger">*</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          {errors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              Please address the following issues:
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Root = hot(Form);

ReactDOM.render(<Root />, document.getElementById('root'));
