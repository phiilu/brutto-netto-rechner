import SectionHeading from '@components/SectionHeading';
import * as React from 'react';
import clsx from 'clsx';
import DescriptionList, { DescriptionListItem } from '@components/DescriptionList';
import { useNetto } from '@hooks/useNetto';
import { usePrevious } from '@hooks/usePrevious';
import { useDisclosureState, Disclosure, DisclosureContent } from 'reakit/Disclosure';
import Banner from '@components/Banner';

// const NumberFormatPercentage = new Intl.NumberFormat('de-AT', { style: 'percent' });
const NumberFormatCurrency = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });

function getNumeric(string) {
  const value = parseFloat(`${string}`.replace(/\./g, '').replace(/,/g, '.'));
  return Number.isNaN(value) ? 0 : Math.round(Math.max(value, 0));
}

function BruttoInput({ value, onChange, period }) {
  return (
    <div>
      <label htmlFor="bruttoInput" className="block text-sm font-medium text-gray-700">
        Brutto Gehalt im {period === 'monthly' ? 'Monat' : 'Jahr'}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">€</span>
        </div>
        <input
          type="text"
          id="bruttoInput"
          className="block w-full pr-12 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pl-7 sm:text-sm"
          placeholder={period === 'monthly' ? '2.000' : '28.000'}
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
  );
}

export default function IndexPage() {
  const [period, setPeriod] = React.useState('monthly');
  const [bruttoInput, setBruttoInput] = React.useState('');
  const [brutto, setBrutto] = React.useState(0);
  const {
    // multiplier,
    // verkehrsabsetzungsbetrag,
    sozialversicherung,
    // bemessungsgrundlage,
    // steuersatz,
    // avab,
    lohnsteuer,
    netto,
    netto13,
    netto14
  } = useNetto(brutto, period);
  const previousTab = usePrevious(period);
  const advancedFieldsDisclosure = useDisclosureState({ visible: true });
  const [hasAlleinverdiener, setHasAlleinverdiener] = React.useState(false);
  const [alleinverdienerBonus, setAlleinverdienerBonus] = React.useState('none');

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

  // const lohnsteuerCalcProcess = brutto
  //   ? `${multiplier > 1 ? '(' : ''}${NumberFormatCurrency.format(
  //       bemessungsgrundlage / multiplier
  //     )} × ${NumberFormatPercentage.format(steuersatz)} -
  // ${NumberFormatCurrency.format(avab)} -
  // ${NumberFormatCurrency.format(verkehrsabsetzungsbetrag / multiplier)}${
  //       multiplier > 1 ? ') × ' : ''
  //     } ${multiplier > 1 ? multiplier : ''} =
  // ${NumberFormatCurrency.format(lohnsteuer)} `
  //   : NumberFormatCurrency.format(0);

  return (
    <main>
      <Banner>Der Brutto-Netto Rechner befindet sich unter aktiver Entwicklung</Banner>
      <article className="container px-4 py-8 pb-8 mx-auto space-y-8 md:pt-16">
        <SectionHeading title="Brutto-Netto" highlight="Rechner">
          Instant Gehalt berechnen
        </SectionHeading>

        <div className="flex flex-wrap justify-center gap-4">
          <section className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg ">
            <div className="px-4 py-5 space-y-8 sm:p-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Eingaben</h3>
              </div>
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
                        className={clsx(
                          'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none focus:border-green-400 focus:text-green-400',
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
                        className={clsx(
                          'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none focus:border-green-400 focus:text-green-400',
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

              <form className="space-y-4">
                <BruttoInput
                  key="inputSimple"
                  value={bruttoInput}
                  onChange={handleBruttoChange}
                  period={period}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Disclosure
                      {...advancedFieldsDisclosure}
                      className="flex items-center gap-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      Weitere Eingaben
                      <svg
                        className={clsx('w-5 h-5 transform transition-transform', [
                          advancedFieldsDisclosure.visible && 'rotate-180'
                        ])}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </Disclosure>
                  </div>
                  <DisclosureContent {...advancedFieldsDisclosure}>
                    <div className="space-y-4">
                      {/* Alleinverdiener */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="flex flex-col flex-grow" id="toggleLabel">
                            <span className="text-sm font-medium text-gray-900">
                              Alleinverdiener- / Alleinerzieherabsetzbetrag
                            </span>
                            <span className="text-sm leading-normal text-gray-500">
                              {hasAlleinverdiener ? 'Ja' : 'Nein'}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-pressed="false"
                            aria-labelledby="toggleLabel"
                            className={clsx(
                              'relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
                              [hasAlleinverdiener ? 'bg-green-600' : 'bg-gray-200']
                            )}
                            onClick={() => setHasAlleinverdiener((prev) => !prev)}>
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={clsx(
                                'inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow ring-0',
                                [hasAlleinverdiener ? 'translate-x-5' : 'translate-x-0']
                              )}></span>
                          </button>
                        </div>
                        {hasAlleinverdiener && (
                          <div>
                            <label
                              htmlFor="location"
                              className="block text-sm font-medium text-gray-700">
                              Familienbonus
                            </label>
                            <select
                              id="location"
                              className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              onBlur={(e) => setAlleinverdienerBonus(e.target.value)}
                              onChange={(e) => setAlleinverdienerBonus(e.target.value)}
                              value={alleinverdienerBonus}>
                              <option selected value="none">
                                kein Bonus
                              </option>
                              <option value="full">voller Bonus</option>
                              <option value="half">geteilter Bonus</option>
                            </select>
                          </div>
                        )}
                        {hasAlleinverdiener && alleinverdienerBonus !== 'none' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="childrenBelow18"
                                className="block text-sm font-medium text-gray-700">
                                Kinder bis 17 Jahren
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  id="childrenBelow18"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="childrenAbove18"
                                className="block text-sm font-medium text-gray-700">
                                Kinder über 18 Jahren
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  id="childrenAbove18"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                  placeholder="0"
                                />
                              </div>
                              <p
                                className="mt-2 text-sm text-gray-500"
                                id="childrenAbove18-description">
                                Für die Sie Familienbeihilfe beziehen.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DisclosureContent>
                </div>
              </form>
            </div>
          </section>

          <div className="w-full max-w-2xl space-y-4">
            <section>
              <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Abrechnung</h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Dein Netto Gehalt ergibt sich aus folgender Berechnung
                  </p>
                </div>
                <DescriptionList>
                  <DescriptionListItem title="Netto">
                    <p className="text-xl font-bold sm:text-2xl md:text-4xl">
                      {NumberFormatCurrency.format(netto)}
                    </p>
                  </DescriptionListItem>
                  <DescriptionListItem title="Sozialversicherung">
                    {NumberFormatCurrency.format(sozialversicherung)}
                  </DescriptionListItem>
                  <DescriptionListItem title="Lohnsteuer">
                    {NumberFormatCurrency.format(lohnsteuer)}
                  </DescriptionListItem>
                  {/* <DescriptionListItem title="Bemessungsgrundlage">
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
                  </DescriptionListItem> */}
                </DescriptionList>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <section>
                <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">13. Bezug</h3>
                  </div>
                  <DescriptionList>
                    <DescriptionListItem title="Netto">
                      <p className="text-xl font-bold sm:text-2xl md:text-4xl">
                        {NumberFormatCurrency.format(netto13.netto)}
                      </p>
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

              <section>
                <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">14. Bezug</h3>
                  </div>
                  <DescriptionList>
                    <DescriptionListItem title="Netto">
                      <p className="text-xl font-bold sm:text-2xl md:text-4xl">
                        {NumberFormatCurrency.format(netto14.netto)}
                      </p>
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
            </div>
          </div>
        </div>
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
