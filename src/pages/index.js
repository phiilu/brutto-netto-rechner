import SectionHeading from '@components/SectionHeading';
import * as React from 'react';
import classNames from 'classnames';
import DescriptionList, { DescriptionListItem } from '@components/DescriptionList';
import { useNetto } from '@hooks/useNetto';
import { usePrevious } from '@hooks/usePrevious';

const NumberFormatPercentage = new Intl.NumberFormat('de-AT', { style: 'percent' });
const NumberFormatCurrency = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });

function getNumeric(string) {
  const value = parseFloat(`${string}`.replace(/\./g, '').replace(/,/g, '.'));
  return Number.isNaN(value) ? 0 : Math.round(Math.max(value, 0));
}

function BruttoInputSimple({ value, onChange, period }) {
  return (
    <form>
      <div>
        <label
          key="bruttoSimpleLabel"
          id="bruttoSimpleLabel"
          htmlFor="bruttoSimple"
          className="block text-sm font-medium text-gray-700">
          Brutto Gehalt im {period === 'monthly' ? 'Monat' : 'Jahr'}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 sm:text-sm">€</span>
          </div>
          <input
            type="text"
            id="bruttoSimple"
            className="block w-full pr-12 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pl-7 sm:text-sm"
            placeholder="0,00"
            aria-describedby="brutto-currency"
            name="brutto"
            value={value}
            onChange={onChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 sm:text-sm" id="brutto-currency">
              EUR
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

function BruttoInputBig({ value, onChange, period }) {
  return (
    <form>
      <div>
        <input
          id="bruttoBig"
          type="text"
          className="w-full text-center bg-gray-100 border-none rounded-lg text-7xl focus:ring-2 focus:ring-green-700"
          name="brutto"
          placeholder="2.000"
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <label
          key="bruttoBigLabel"
          id="bruttoBigLabel"
          htmlFor="bruttoBig"
          className="block mt-2 text-sm font-medium text-center text-gray-700">
          Brutto Gehalt im {period === 'monthly' ? 'Monat' : 'Jahr'}
        </label>
      </div>
    </form>
  );
}

const aB = Math.floor(Math.random() * 2) + 1;

export default function IndexPage() {
  const [period, setPeriod] = React.useState('monthly');
  const [bruttoInput, setBruttoInput] = React.useState('');
  const [brutto, setBrutto] = React.useState(0);
  const {
    multiplier,
    verkehrsabsetzungsbetrag,
    sozialversicherung,
    bemessungsgrundlage,
    steuersatz,
    avab,
    lohnsteuer,
    netto,
    netto13,
    netto14
  } = useNetto(brutto, period);
  const previousTab = usePrevious(period);

  function handleBruttoChange(e) {
    setBruttoInput(e.target.value);
  }

  React.useEffect(() => {
    const numericBrutto = getNumeric(bruttoInput);
    setBrutto(period === 'yearly' ? numericBrutto / 14 : numericBrutto);
  }, [bruttoInput, period]);

  // set the input to the right value on period change
  React.useEffect(() => {
    if (!bruttoInput) {
      return;
    }

    if (previousTab === 'monthly' && period === 'yearly') {
      setBruttoInput(getNumeric(bruttoInput) * 14);
    } else if (previousTab === 'yearly' && period === 'monthly') {
      setBruttoInput(getNumeric(bruttoInput) / 14);
    }
  }, [bruttoInput, previousTab, period]);

  const lohnsteuerCalcProcess = brutto
    ? `${multiplier > 1 ? '(' : ''}${NumberFormatCurrency.format(
        bemessungsgrundlage / multiplier
      )} × ${NumberFormatPercentage.format(steuersatz)} - 
  ${NumberFormatCurrency.format(avab)} - 
  ${NumberFormatCurrency.format(verkehrsabsetzungsbetrag / multiplier)}${
        multiplier > 1 ? ') × ' : ''
      } ${multiplier > 1 ? multiplier : ''} = 
  ${NumberFormatCurrency.format(lohnsteuer)} `
    : NumberFormatCurrency.format(0);

  return (
    <main>
      <article className="container px-4 py-8 pb-8 mx-auto space-y-8 md:pt-16">
        <SectionHeading title="Brutto-Netto" highlight="Rechner">
          Instant Gehalt berechnen
        </SectionHeading>

        <section className="max-w-md mx-auto space-y-8">
          <div>
            <div className="sm:hidden">
              <label htmlFor="periods" className="sr-only">
                Select a period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                onBlur={(e) => setPeriod(e.target.value)}
                id="periods"
                className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-green-500">
                <option value="monthly">Monat</option>
                <option value="yearly">Jahr</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => setPeriod('monthly')}
                    className={classNames(
                      'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none',
                      {
                        'border-green-500 text-green-600 hover:text-green-700 hover:border-green-300':
                          period === 'monthly',
                        'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300':
                          period !== 'monthly'
                      }
                    )}>
                    Monat
                  </button>
                  <button
                    onClick={() => setPeriod('yearly')}
                    className={classNames(
                      'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none',
                      {
                        'border-green-500 text-green-600 hover:text-green-700 hover:border-green-300':
                          period === 'yearly',
                        'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300':
                          period !== 'yearly'
                      }
                    )}>
                    Jahr
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {aB === 1 ? (
            <BruttoInputSimple
              key="inputSimple"
              value={bruttoInput}
              onChange={handleBruttoChange}
              period={period}
            />
          ) : (
            <BruttoInputBig
              key="inputBig"
              value={bruttoInput}
              onChange={handleBruttoChange}
              period={period}
            />
          )}
        </section>

        <section className="max-w-lg mx-auto">
          <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Abrechnung</h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500">
                Dein Netto Gehalt ergibt sich aus folgender Berechnung
              </p>
            </div>
            <DescriptionList>
              <DescriptionListItem title="Netto">
                <p className="text-4xl font-bold">{NumberFormatCurrency.format(netto)}</p>
              </DescriptionListItem>
              <DescriptionListItem title="Sozialversicherung">
                {NumberFormatCurrency.format(sozialversicherung)}
              </DescriptionListItem>
              <DescriptionListItem title="Bemessungsgrundlage">
                {brutto
                  ? `${NumberFormatCurrency.format(
                      brutto * multiplier
                    )} - ${NumberFormatCurrency.format(
                      sozialversicherung
                    )} = ${NumberFormatCurrency.format(bemessungsgrundlage)}`
                  : NumberFormatCurrency.format(0)}
              </DescriptionListItem>
              <DescriptionListItem title="Steuersatz">
                {NumberFormatPercentage.format(steuersatz)}
              </DescriptionListItem>
              <DescriptionListItem title="AVAB">
                {NumberFormatCurrency.format(avab)}
              </DescriptionListItem>
              <DescriptionListItem title="Verkehrsabsetzungsbetrag">
                {NumberFormatCurrency.format(verkehrsabsetzungsbetrag)}
              </DescriptionListItem>
              <DescriptionListItem title="Lohnsteuer">{lohnsteuerCalcProcess}</DescriptionListItem>
            </DescriptionList>
          </div>
        </section>

        <section className="max-w-lg mx-auto">
          <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">13. Bezug</h3>
            </div>
            <DescriptionList>
              <DescriptionListItem title="Netto">
                <p className="text-4xl font-bold">{NumberFormatCurrency.format(netto13.netto)}</p>
              </DescriptionListItem>
              <DescriptionListItem title="Sozialversicherung">
                {NumberFormatCurrency.format(netto13.sozialversicherung)}
              </DescriptionListItem>
              <DescriptionListItem title="Lohnsteuer">
                {NumberFormatCurrency.format(netto13.lohnsteuer)}
              </DescriptionListItem>
            </DescriptionList>
          </div>
        </section>

        <section className="max-w-lg mx-auto">
          <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">14. Bezug</h3>
            </div>
            <DescriptionList>
              <DescriptionListItem title="Netto">
                <p className="text-4xl font-bold">{NumberFormatCurrency.format(netto14.netto)}</p>
              </DescriptionListItem>
              <DescriptionListItem title="Sozialversicherung">
                {NumberFormatCurrency.format(netto14.sozialversicherung)}
              </DescriptionListItem>
              <DescriptionListItem title="Lohnsteuer">
                {NumberFormatCurrency.format(netto14.lohnsteuer)}
              </DescriptionListItem>
            </DescriptionList>
          </div>
        </section>
      </article>

      <aside className="max-w-lg px-4 mx-auto my-20 prose text-justify text-gray-400 md:px-0 ">
        <p>
          Der Autor übernimmt keine Haftung für Schäden oder Folgeschäden, die auf die Anwendung des
          Rechners zurückgehen. Im Einzelfall wenden Sie sich bitte an einen Experten Ihres
          Vertrauens.
        </p>
      </aside>
    </main>
  );
}
