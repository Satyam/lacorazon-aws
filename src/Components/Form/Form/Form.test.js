import React from 'react';
import * as Yup from 'yup';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  queries as stdQueries,
} from '@testing-library/react';

import Form from '.';
import TextField from '../TextField';
import SubmitButton from '../SubmitButton';
import { FormContext, getContextById } from '../index.test';

const queries = { ...stdQueries, getContextById };
afterEach(cleanup);
const nullSubmit = () => undefined;
function TestForm(props) {
  return (
    <Form
      defaultValues={{ one: 1 }}
      shouldFocusError={false}
      onSubmit={nullSubmit}
      {...props}
    >
      <TextField label="one" name="one" />
      <SubmitButton>Submit</SubmitButton>
      <FormContext id="context" />
    </Form>
  );
}
describe('Form / Form', () => {
  const contextBefore = {
    errors: {},
    values: { one: '1' },
    isDirty: false,
    dirtyFields: {},
    isSubmitted: false,
    touched: {},
    isSubmitting: false,
    submitCount: 0,
    isValid: true,
  };
  const contextAfterInput = {
    ...contextBefore,
    values: { one: '2' },
    isDirty: true,
    dirtyFields: { one: true },
  };

  const contextAfterSubmit = {
    ...contextAfterInput,
    isSubmitted: true,
    submitCount: 1,
  };

  describe('with no validationSchema', () => {
    it('should submit form', async () => {
      const submitHandler = jest.fn();
      const validate = jest.fn((values) =>
        Promise.resolve({
          values,
          errors: {},
        })
      );

      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} resolver={validate} />,
        { queries }
      );

      await waitFor(() => expect(getByText('Submit')).toBeDisabled());
      expect(getContextById('context')).toEqual(contextBefore);

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => expect(getByText('Submit')).not.toBeDisabled());
      expect(getContextById('context')).toEqual(contextAfterInput);

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      await waitFor(() => expect(validate).toBeCalled());
      expect(validate).toBeCalledWith({ one: '2' }, undefined, false);
      expect(validate).toBeCalledTimes(1);
      expect(getContextById('context')).toEqual({
        ...contextAfterSubmit,
        isValid: true,
      });
      expect(submitHandler).toBeCalled();
      expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
    });

    it('should not submit form on validation error', async () => {
      const submitHandler = jest.fn();
      const validate = jest.fn((values) =>
        Promise.resolve({
          values,
          errors: { one: 'some error' },
        })
      );
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} resolver={validate} />,
        { queries }
      );

      await waitFor(() => expect(getByText('Submit')).toBeDisabled());

      // Something funny happening here
      // The code this far is exactly the same as in the previous test
      // however, this one fails.
      expect(getContextById('context')).toEqual(contextBefore);

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => expect(getByText('Submit')).not.toBeDisabled());
      expect(getContextById('context')).toEqual(contextAfterInput);

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      await waitFor(() => expect(validate).toBeCalled());

      expect(validate).toBeCalledWith({ one: '2' }, undefined, false);
      expect(validate).toBeCalledTimes(1);
      expect(getContextById('context')).toEqual({
        ...contextAfterSubmit,
        errors: { one: 'some error' },
      });
      expect(getByText('Submit')).toBeDisabled();
      expect(submitHandler).not.toBeCalled();
    });

    it('should submit form asynchronously (with Promise)', async () => {
      const submitHandler = jest.fn(() => Promise.resolve());
      const validate = jest.fn((values) =>
        Promise.resolve({
          values,
          errors: {},
        })
      );
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} resolver={validate} />,
        { queries }
      );

      await waitFor(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(getContextById('context')).toEqual(contextBefore);
      });

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => expect(getByText('Submit')).not.toBeDisabled());
      expect(getContextById('context')).toEqual(contextAfterInput);

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      await waitFor(() => expect(validate).toBeCalled());
      expect(validate).toBeCalledWith({ one: '2' }, undefined, false);
      expect(validate).toBeCalledTimes(1);

      expect(submitHandler).toBeCalled();
      expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
    });
  });
  describe('with validation schema', () => {
    const schema = Yup.object().shape({
      one: Yup.number().integer().truncate().default(99),
    });
    it('should submit form', async () => {
      const submitHandler = jest.fn();
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} schema={schema} />,
        { queries }
      );
      // await waitFor(() => {
      expect(getByText('Submit')).toBeDisabled();

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2.5' },
      });
      await waitFor(() => expect(getByText('Submit')).not.toBeDisabled());
      expect(getContextById('context')).toEqual({
        ...contextAfterInput,
        values: { one: '2.5' },
      });

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      // validation is always async, so we have to waitFor for it
      return waitFor(() => {
        expect(getContextById('context')).toEqual({
          ...contextAfterSubmit,
          values: { one: '2.5' },
          isValid: true,
        });
        expect(submitHandler).toBeCalled();
        // Notice value '2.5' is cast to number and truncated to an integer: 2
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: 2 });
      });
    });
    it('should take default values from schema', () => {
      const { getByText, getByLabelText } = render(
        <Form schema={schema} onSubmit={nullSubmit}>
          <TextField label="one" name="one" />
          <SubmitButton>Submit</SubmitButton>
        </Form>
      );
      expect(Number(getByLabelText('one').value)).toBe(99);

      expect(getByText('Submit')).toBeDisabled();
    });
  });
});
