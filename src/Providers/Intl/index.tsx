import React, { createContext, useContext, useState, useMemo } from 'react';

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { getCurrency } from 'locale-currency';

import { registerLocale, setDefaultLocale } from 'react-datepicker';

const localeTables: Record<string, any> = { 'en-US': enUS, 'es-ES': es };

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
  getCurrencyForCountry: (locale: string) => string;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

const initialValues = {
  locales: Object.keys(localeTables),
  setLocale: notImplemented,
  locale: navigator.language,
  formatDate: notImplemented,
  currency: getCurrency(navigator.language),
  setCurrency: notImplemented,
  formatCurrency: notImplemented,
  currencySign: '$',
  currencySignPrepend: true,
  currencyDecimals: 2,
  getCurrencyForCountry: getCurrency,
};

export const IntlContext = createContext<intlType>(initialValues);

export const IntlProvider: React.FC<{
  locale?: string;
  currency?: string;
}> = ({ locale: l = navigator.language, currency: c, children }) => {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(
    c || getCurrency(l || navigator.language)
  );

  const ctx = useMemo<intlType>(() => {
    // for DatePicker
    setDefaultLocale(locale);

    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });

    const {
      currencyDecimals,
      currencySign,
      currencySignPrepend,
    } = currFormatter.formatToParts(12.345).reduce<{
      currencyDecimals: number;
      currencySign: string;
      currencySignPrepend: boolean;
      // n is auxiliary, to be ignored
      n: boolean;
    }>(
      (ps, { type, value }) => {
        switch (type) {
          case 'integer':
            return {
              ...ps,
              n: true,
            };
          case 'fraction':
            return {
              ...ps,
              currencyDecimals: value.length,
            };
          case 'currency':
            return {
              ...ps,
              currencySign: value,
              currencySignPrepend: !ps.n,
            };
          default:
            return ps;
        }
      },
      {
        currencyDecimals: 0,
        currencySign: '',
        currencySignPrepend: false,
        n: false,
      }
    );

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
      getCurrencyForCountry: getCurrency,
      currencyDecimals,
      currencySign,
      currencySignPrepend,
    };
  }, [locale, currency]);

  return <IntlContext.Provider value={ctx}>{children}</IntlContext.Provider>;
};

export function useIntl() {
  return useContext(IntlContext);
}
