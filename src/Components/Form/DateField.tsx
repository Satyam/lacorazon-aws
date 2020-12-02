import React, { useEffect, useState } from 'react';
import { LabelInputBox, LabelInputBoxProps } from './LabelBox';
import { Controller, RegisterOptions } from 'react-hook-form';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames';

import { useIntl } from 'Providers/Intl';

export type DateFieldProps = LabelInputBoxProps & {
  validation?: RegisterOptions;
  minDate?: Date;
  maxDate?: Date;
} & Omit<ReactDatePickerProps, 'onChange'>;

export const DateField: React.FC<DateFieldProps> = ({
  // for LabelInputBox
  name,
  label,
  id,
  help,
  methods,
  // for form
  validation,
  // for DatePicker
  className,
  minDate,
  maxDate,
  ...rest
}) => {
  const [dummy, setDummy] = useState(0);
  const { locale } = useIntl();

  // I'm using setActualId as a means of forcing a
  // refresh of the component so it takes the new locale
  // In the end, it doesn't really changes the id at all.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDummy((dummy + 1) % Number.MAX_SAFE_INTEGER), [locale]);
  return (
    <LabelInputBox
      name={name}
      label={label}
      id={id}
      help={help}
      methods={methods}
    >
      {({ name, id, hasError, methods }) => {
        let actualMin = minDate;
        let actualMax = maxDate;

        // if (validationSchema) {
        //   const tests = validationSchema.fields[name].tests;
        //   if (!actualMin) {
        //     const minTest = tests.filter(t => t.TEST_NAME === 'min')[0];
        //     if (minTest) {
        //       actualMin = minTest.TEST.params.min;
        //     }
        //   }
        //   if (!actualMax) {
        //     const maxTest = tests.filter(t => t.TEST_NAME === 'max')[0];
        //     if (maxTest) {
        //       actualMax = maxTest.TEST.params.max;
        //     }
        //   }
        // }
        return (
          <Controller
            render={({ onBlur, onChange, name, value, ref }) => {
              return (
                <ReactDatePicker
                  onBlur={onBlur}
                  // @ts-ignore
                  onChange={onChange}
                  name={name}
                  ref={ref}
                  className={classNames('form-control', className, {
                    'is-invalid': hasError,
                  })}
                  selected={value}
                  dateFormat="P"
                  id={id}
                  minDate={actualMin}
                  maxDate={actualMax}
                  {...rest}
                />
              );
            }}
            name={name}
            control={methods.control}
            rules={validation}
            defaultValue={methods.getValues(name)}
          />
        );
      }}
    </LabelInputBox>
  );
};

export default DateField;
