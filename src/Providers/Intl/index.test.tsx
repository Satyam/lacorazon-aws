import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider, useIntl } from './index';

describe('Various initial settings', () => {
  const P: React.FC<{ label: string }> = ({ label }) => {
    const {
      currency,
      locale,
      currencySign,
      currencyDecimals,
      currencySignPrepend,
      formatCurrency,
      formatDate,
      locales,
    } = useIntl();
    return (
      <p title="value">
        {`
        ${label}
        --------------------
        currency: ${currency}
        locale: ${locale}
        currencySign: ${currencySign}
        currencyDecimals: ${currencyDecimals}
        currencySignPrepend: ${currencySignPrepend}
        formatDate 1/mar/2000: ${formatDate(new Date(2000, 2, 1))}
        formatCurrency: ${formatCurrency(1234.567)}
        locales: ${locales.join(' - ')}
        `}
      </p>
    );
  };

  const FC: React.FC<{ loc?: string; cur?: string; label: string }> = ({
    loc,
    cur,
    label,
  }) => (
    <IntlProvider locale={loc} currency={cur}>
      <P label={label} />
    </IntlProvider>
  );

  test('Provider with defaults', () => {
    render(<FC label="locale not set" />);
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
          "
                  locale not set
                  --------------------
                  currency: USD
                  locale: en-US
                  currencySign: $
                  currencyDecimals: 2
                  currencySignPrepend: true
                  formatDate 1/mar/2000: 03/01/2000
                  formatCurrency: $1,234.57
                  locales: en-US - es-ES
                  "
      `);
  });

  test('Provider set to es-ES', () => {
    render(<FC loc="es-ES" label="locale set to es-ES" />);
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
          "
                  locale set to es-ES
                  --------------------
                  currency: EUR
                  locale: es-ES
                  currencySign: €
                  currencyDecimals: 2
                  currencySignPrepend: false
                  formatDate 1/mar/2000: 01/03/2000
                  formatCurrency: 1234,57&nbsp;€
                  locales: en-US - es-ES
                  "
      `);
  });

  test('Provider set to en-US', () => {
    render(<FC loc="en-US" label="locale set to en-US" />);
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
          "
                  locale set to en-US
                  --------------------
                  currency: USD
                  locale: en-US
                  currencySign: $
                  currencyDecimals: 2
                  currencySignPrepend: true
                  formatDate 1/mar/2000: 03/01/2000
                  formatCurrency: $1,234.57
                  locales: en-US - es-ES
                  "
      `);
  });

  test('Provider set to es-ES / USD', () => {
    render(<FC loc="es-ES" cur="USD" label="locale set to es-ES" />);
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
          "
                  locale set to es-ES
                  --------------------
                  currency: USD
                  locale: es-ES
                  currencySign: US$
                  currencyDecimals: 2
                  currencySignPrepend: false
                  formatDate 1/mar/2000: 01/03/2000
                  formatCurrency: 1234,57&nbsp;US$
                  locales: en-US - es-ES
                  "
      `);
  });

  test('Provider set to en-US / EUR', () => {
    render(<FC loc="en-US" cur="EUR" label="locale set to en-US" />);
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
          "
                  locale set to en-US
                  --------------------
                  currency: EUR
                  locale: en-US
                  currencySign: €
                  currencyDecimals: 2
                  currencySignPrepend: true
                  formatDate 1/mar/2000: 03/01/2000
                  formatCurrency: €1,234.57
                  locales: en-US - es-ES
                  "
      `);
  });
});

describe('switching locale settings dynamically', () => {
  const P: React.FC<{
    label: string;
    locAfter?: string;
    curAfter?: string;
  }> = ({ label, locAfter, curAfter }) => {
    const {
      currency,
      locale,
      currencySign,
      currencyDecimals,
      currencySignPrepend,
      formatCurrency,
      formatDate,
      locales,
      setCurrency,
      setLocale,
    } = useIntl();

    useEffect(() => {
      if (locAfter) setLocale(locAfter);
      if (curAfter) setCurrency(curAfter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <p title="value">
        {`
          ${label}
          --------------------
          currency: ${currency}
          locale: ${locale}
          currencySign: ${currencySign}
          currencyDecimals: ${currencyDecimals}
          currencySignPrepend: ${currencySignPrepend}
          formatDate 1/mar/2000: ${formatDate(new Date(2000, 2, 1))}
          formatCurrency: ${formatCurrency(1234.567)}
          locales: ${locales.join(' - ')}
          `}
      </p>
    );
  };

  const FC: React.FC<{
    loc?: string;
    cur?: string;
    locAfter?: string;
    curAfter?: string;
    label: string;
  }> = ({ loc, locAfter, cur, curAfter, label }) => (
    <IntlProvider locale={loc} currency={cur}>
      <P label={label} locAfter={locAfter} curAfter={curAfter} />
    </IntlProvider>
  );

  test('switch locale from es-ES to en-US', () => {
    render(
      <FC
        loc="es-ES"
        locAfter="en-US"
        label="switch locale from es-ES to en-US"
      />
    );
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
      "
                switch locale from es-ES to en-US
                --------------------
                currency: EUR
                locale: en-US
                currencySign: €
                currencyDecimals: 2
                currencySignPrepend: true
                formatDate 1/mar/2000: 03/01/2000
                formatCurrency: €1,234.57
                locales: en-US - es-ES
                "
    `);
  });
  test('switch locale from en-US to es-ES', () => {
    render(
      <FC
        loc="en-US"
        locAfter="es-ES"
        label="switch locale from en-US to es-ES"
      />
    );
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
      "
                switch locale from en-US to es-ES
                --------------------
                currency: USD
                locale: es-ES
                currencySign: US$
                currencyDecimals: 2
                currencySignPrepend: false
                formatDate 1/mar/2000: 01/03/2000
                formatCurrency: 1234,57&nbsp;US$
                locales: en-US - es-ES
                "
    `);
  });
});

describe('switching locale and currency settings dynamically', () => {
  const P: React.FC<{
    label: string;
    locAfter?: string;
    curAfter?: string;
  }> = ({ label, locAfter, curAfter }) => {
    const {
      currency,
      locale,
      currencySign,
      currencyDecimals,
      currencySignPrepend,
      formatCurrency,
      formatDate,
      locales,
      setCurrency,
      setLocale,
      getCurrencyForCountry,
    } = useIntl();

    useEffect(() => {
      if (locAfter) {
        setLocale(locAfter);
        setCurrency(getCurrencyForCountry(locAfter));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <p title="value">
        {`
          ${label}
          --------------------
          currency: ${currency}
          locale: ${locale}
          currencySign: ${currencySign}
          currencyDecimals: ${currencyDecimals}
          currencySignPrepend: ${currencySignPrepend}
          formatDate 1/mar/2000: ${formatDate(new Date(2000, 2, 1))}
          formatCurrency: ${formatCurrency(1234.567)}
          locales: ${locales.join(' - ')}
          `}
      </p>
    );
  };

  const FC: React.FC<{
    loc?: string;
    cur?: string;
    locAfter?: string;
    curAfter?: string;
    label: string;
  }> = ({ loc, locAfter, cur, curAfter, label }) => (
    <IntlProvider locale={loc} currency={cur}>
      <P label={label} locAfter={locAfter} curAfter={curAfter} />
    </IntlProvider>
  );

  test('switch locale from es-ES to en-US', () => {
    render(
      <FC
        loc="es-ES"
        locAfter="en-US"
        label="switch locale from es-ES to en-US"
      />
    );
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
      "
                switch locale from es-ES to en-US
                --------------------
                currency: USD
                locale: en-US
                currencySign: $
                currencyDecimals: 2
                currencySignPrepend: true
                formatDate 1/mar/2000: 03/01/2000
                formatCurrency: $1,234.57
                locales: en-US - es-ES
                "
    `);
  });
  test('switch locale from en-US to es-ES', () => {
    render(
      <FC
        loc="en-US"
        locAfter="es-ES"
        label="switch locale from en-US to es-ES"
      />
    );
    expect(screen.getByTitle('value').innerHTML).toMatchInlineSnapshot(`
      "
                switch locale from en-US to es-ES
                --------------------
                currency: EUR
                locale: es-ES
                currencySign: €
                currencyDecimals: 2
                currencySignPrepend: false
                formatDate 1/mar/2000: 01/03/2000
                formatCurrency: 1234,57&nbsp;€
                locales: en-US - es-ES
                "
    `);
  });
});
