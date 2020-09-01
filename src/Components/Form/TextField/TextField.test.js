import React from 'react';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import * as Yup from 'yup';

import Form from '../Form';
import TextField from '.';

class ErrorBoundary extends React.PureComponent {
  state = { hasError: false };

  static getDerivedStateFromError(err) {
    // Update state so the next render will show the fallback UI.
    return { hasError: err.message };
  }

  // componentDidCatch(err, info) {
  //   this.setState({ hasError: err.message });
  // }

  render() {
    return this.state.hasError || React.Children.only(this.props.children);
  }
}

afterEach(cleanup);

const nullSubmit = () => undefined;

describe('Form/TextField', () => {
  it('should throw with no props as name argument is mandatory', () => {
    const e = console.error;
    console.error = (msg) => {};
    const { container } = render(
      <ErrorBoundary>
        <Form onSubmit={nullSubmit}>
          <TextField />
        </Form>
      </ErrorBoundary>
    );

    expect(container.innerHTML).toMatchSnapshot();
    console.error = e;
  });

  it('should throw with any extra property but name as argument is mandatory', () => {
    const e = console.error;
    console.error = (msg) => {};
    const { container } = render(
      <ErrorBoundary>
        <Form onSubmit={nullSubmit}>
          <TextField label="some label" value="Some value" />
        </Form>
      </ErrorBoundary>
    );
    expect(container.innerHTML).toMatchSnapshot();
    console.error = e;
  });

  it('should validate on field change', async () => {
    const errorMessage = 'some error';
    const validate = jest.fn(() => errorMessage);
    const { getByLabelText, getByText } = render(
      <Form defaultValues={{ one: 1 }} mode="onChange" onSubmit={nullSubmit}>
        <TextField label="one" name="one" validation={{ validate }} />
      </Form>
    );
    fireEvent.input(getByLabelText('one'), {
      target: { name: 'one', value: '2' },
    });
    await waitFor(() => {
      expect(validate).toBeCalledWith('2');
      expect(getByText(errorMessage).className).toBe('invalid-feedback');
    });
  });

  it('should generate an id when no id provided', () => {
    const { getByLabelText } = render(
      <Form defaultValues={{ one: 1 }} onSubmit={nullSubmit}>
        <TextField label="one" name="one" />
      </Form>
    );
    expect(getByLabelText('one').id).toMatch(/^F_TF_\d+$/);
  });

  it('should respect the id provided', () => {
    const { getByLabelText } = render(
      <Form defaultValues={{ one: 1 }} onSubmit={nullSubmit}>
        <TextField label="one" name="one" id="abcd" />
      </Form>
    );
    expect(getByLabelText('one').id).toBe('abcd');
  });

  xit('should cast value to an integer before validate with schema on field change', async () => {
    // in react-form-hoo, validations are exclusive of one another
    const schema = Yup.object().shape({
      one: Yup.number().integer().truncate().default(0),
    });
    const { getByLabelText, getByText } = render(
      <Form
        defaultValues={{ one: 1 }}
        schema={schema}
        mode="onChange"
        onSubmit={nullSubmit}
      >
        <TextField label="one" name="one" />
      </Form>
    );
    fireEvent.input(getByLabelText('one'), {
      target: { name: 'one', value: '2.5' },
    });
    // string '2.5' was transformed into a number 2
    await waitFor(() => {
      expect(getByText('xxx')).toBe(2);
    });
  });
});
