import React, { createContext, useContext, useState, useMemo } from 'react';

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

import { registerLocale, setDefaultLocale } from 'react-datepicker';

const localeTables: { [index: string]: any } = { 'en-US': enUS, 'es-ES': es };

Object.keys(localeTables).forEach((l) => registerLocale(l, localeTables[l]));

type intlType = {
  locales: string[];
  setLocale: (locale: string) => void;
  locale: string;
  formatDate: (date?: Date, formatStr?: string) => string;
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount?: number, plain?: boolean) => string;
  currencySign: string;
  currencySignPrepend: boolean;
  currencyDecimals: number;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

const initialValues = {
  locales: Object.keys(localeTables),
  setLocale: notImplemented,
  locale: navigator.language,
  formatDate: notImplemented,
  currency: 'EUR',
  setCurrency: notImplemented,
  formatCurrency: notImplemented,
  currencySign: '$',
  currencySignPrepend: true,
  currencyDecimals: 2,
};

export const IntlContext = createContext<intlType>(initialValues);

const currRegExp = /(.*)\s*12(.)(\d*)\s*(.*)/;

export const IntlProvider: React.FC<{
  locale?: string;
  currency?: string;
}> = ({ locale: l = navigator.language, currency: c = 'EUR', children }) => {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(c);

  const ctx = useMemo<intlType>(() => {
    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });

    const sample = currFormatter.format(12.345);
    const sampleParts = currRegExp.exec(sample) || [
      '12,35 €',
      '',
      ',',
      '35',
      '€',
    ];
    setDefaultLocale(locale);
    const currencyDecimals = sampleParts[3].length;
    const plainCurrencyFormatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: currencyDecimals,
    });

    return {
      locales: Object.keys(localeTables),
      setLocale,
      locale,
      formatDate: (date?: Date, formatStr: string = 'P') =>
        date
          ? format(date, formatStr, {
              locale: localeTables[locale],
            })
          : '',
      currency,
      setCurrency,
      formatCurrency: (value?: number, plain: boolean = false) =>
        value
          ? plain
            ? plainCurrencyFormatter.format(value)
            : currFormatter.format(value)
          : '',
      currencySign: sampleParts[1] || sampleParts[4],
      currencySignPrepend: !!sampleParts[1],
      currencyDecimals,
    };
  }, [locale, currency]);

  return <IntlContext.Provider value={ctx}>{children}</IntlContext.Provider>;
};

export function useIntl() {
  return useContext(IntlContext);
}
