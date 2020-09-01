import React from 'react';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';

import Form from '../Form';
import TextField from '../TextField';
import SubmitButton from '.';

afterEach(cleanup);

const nullSubmit = () => undefined;

function TestForm(props) {
  return (
    <Form defaultValues={{ one: 1 }} onSubmit={nullSubmit} {...props}>
      <TextField label="one" name="one" />
      <SubmitButton>Submit</SubmitButton>
    </Form>
  );
}

describe('Form / SubmitButton', () => {
  it('on a pristine form, it should be disabled', () => {
    const { getByText } = render(<TestForm />);
    expect(getByText('Submit')).toBeDisabled();
  });
  it('when a field is changed, it should be enabled', () => {
    const { getByText, getByLabelText } = render(<TestForm />);
    expect(getByText('Submit')).toBeDisabled();
    fireEvent.input(getByLabelText('one'), {
      target: { name: 'one', value: '2' },
    });
    expect(getByText('Submit')).not.toBeDisabled();
  });
  it('when a field is changed to an invalid value, it should be disabled', async () => {
    const errMsg = 'some error';
    const validate = jest.fn((values) =>
      Promise.resolve({
        values,
        errors: { one: errMsg },
      })
    );
    const { getByText, getByLabelText } = render(
      <Form
        defaultValues={{ one: 1 }}
        resolver={validate}
        onSubmit={nullSubmit}
      >
        <TextField label="one" name="one" />
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );

    expect(getByText('Submit')).toBeDisabled();

    fireEvent.input(getByLabelText('one'), {
      target: { name: 'one', value: '2' },
    });

    expect(getByText('Submit')).not.toBeDisabled();

    fireEvent.click(getByText('Submit'));

    await waitFor(() => expect(validate).toBeCalled());

    expect(validate).toBeCalledWith({ one: '2' }, undefined, false);

    expect(getByText('Submit')).toBeDisabled();
    expect(getByText(errMsg)).not.toBeNull();
  });
});
