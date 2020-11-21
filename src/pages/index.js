import SectionHeading from '@components/SectionHeading';
import * as React from 'react';
import classNames from 'classnames';
import DescriptionList, { DescriptionListItem } from '@components/DescriptionList';

function calculateAvab(steuersatz, children = 0) {
  if (steuersatz === 0) {
    return 0;
  }

  function getAvabByChildren(value) {
    switch (children) {
      case 0:
        return value;
      case 1:
        return value + 41.17;
      case 2:
        return value + 55.75;
      default:
        return value + 55.75 + 18.33 * children;
    }
  }

  if (steuersatz === 0.2) {
    return getAvabByChildren(186.54);
  }

  if (steuersatz === 0.35) {
    return getAvabByChildren(413.94);
  }

  if (steuersatz === 0.42) {
    return getAvabByChildren(595.89);
  }

  if (steuersatz === 0.48) {
    return getAvabByChildren(896.85);
  }

  if (steuersatz === 0.5) {
    return getAvabByChildren(1047.17);
  }

  if (steuersatz === 0.55) {
    return getAvabByChildren(5214.63);
  }

  return 0;
}

function getSteuersatz(bemessungsgrundlage) {
  let steuersatz = 0;

  if (bemessungsgrundlage > 932.67) {
    steuersatz = 0.2;
  }
  if (bemessungsgrundlage > 1516.0) steuersatz = 0.35;
  if (bemessungsgrundlage > 2599.33) steuersatz = 0.42;
  if (bemessungsgrundlage > 5016.0) steuersatz = 0.48;
  if (bemessungsgrundlage > 7516.0) steuersatz = 0.5;
  if (bemessungsgrundlage > 83349.33) steuersatz = 0.55;

  return steuersatz;
}

// const NumberFormat = new Intl.NumberFormat('de-DE');
const NumberFormatPercentage = new Intl.NumberFormat('de-AT', { style: 'percent' });
const NumberFormatCurrency = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });
const initialBrutto = { monthly: 0, yearly: 0 };

function useNetto(brutto) {
  const verkehrsabsetzungsbetrag = React.useMemo(() => (brutto > 0 ? 33.33 : 0), [brutto]);
  const sozialversicherung = React.useMemo(() => Math.max(brutto * 0.1812, 0), [brutto]);
  const bemessungsgrundlage = React.useMemo(() => Math.max(brutto - sozialversicherung, 0), [
    brutto,
    sozialversicherung
  ]);
  const steuersatz = React.useMemo(() => getSteuersatz(bemessungsgrundlage), [bemessungsgrundlage]);
  const avab = React.useMemo(() => Math.max(calculateAvab(steuersatz), 0), [steuersatz]);
  const lohnsteuer = React.useMemo(
    () => Math.max(bemessungsgrundlage * steuersatz - avab - verkehrsabsetzungsbetrag, 0),
    [bemessungsgrundlage, steuersatz, avab, verkehrsabsetzungsbetrag]
  );
  const netto = React.useMemo(() => Math.max(brutto - sozialversicherung - lohnsteuer, 0), [
    brutto,
    sozialversicherung,
    lohnsteuer
  ]);

  return {
    verkehrsabsetzungsbetrag,
    sozialversicherung,
    bemessungsgrundlage,
    steuersatz,
    avab,
    lohnsteuer,
    netto
  };
}

export default function IndexPage() {
  const [tab, setTab] = React.useState('monthly');
  const [bruttoInput, setBruttoInput] = React.useState('');
  const [bruttoTab, setBruttoTab] = React.useState(initialBrutto);
  const brutto = React.useMemo(() => bruttoTab[tab], [bruttoTab, tab]);
  const {
    verkehrsabsetzungsbetrag,
    sozialversicherung,
    bemessungsgrundlage,
    steuersatz,
    avab,
    lohnsteuer,
    netto
  } = useNetto(brutto);

  function handleSelectTab(newTab) {
    setTab(newTab);
  }

  function handleBruttoChange(e) {
    setBruttoInput(e.target.value);
    const numericValue = parseFloat(e.target.value.replace(/,/, '.'));
    if (!Number.isNaN(numericValue)) {
      setBruttoTab((prev) => ({ ...prev, [tab]: Math.max(numericValue, 0) }));
    } else {
      setBruttoTab(initialBrutto);
    }
  }

  return (
    <main>
      <article className="container pt-16 pb-8 mx-auto space-y-8">
        <SectionHeading title="Brutto-Netto" highlight="Rechner">
          Berechne dein Netto Gehalt in 2 Sekunden
        </SectionHeading>

        <section className="max-w-md mx-auto space-y-8">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-green-500">
                <option>Monat</option>
                <option>Jahr</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => handleSelectTab('monthly')}
                    className={classNames(
                      'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none',
                      {
                        'border-green-500 text-green-600 hover:text-green-700 hover:border-green-300':
                          tab === 'monthly',
                        'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300':
                          tab !== 'monthly'
                      }
                    )}>
                    Monat
                  </button>
                  <button
                    onClick={() => handleSelectTab('yearly')}
                    className={classNames(
                      'w-2/4 px-1 py-4 text-sm font-medium text-center border-b-2 focus:outline-none',
                      {
                        'border-green-500 text-green-600 hover:text-green-700 hover:border-green-300':
                          tab === 'yearly',
                        'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300':
                          tab !== 'yearly'
                      }
                    )}>
                    Jahr
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <form>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Brutto Gehalt im {tab === 'monthly' ? 'Monat' : 'Jahr'}
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="text"
                  id="price"
                  className="block w-full pr-12 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pl-7 sm:text-sm"
                  placeholder="0,00"
                  aria-describedby="price-currency"
                  name="brutto"
                  value={bruttoInput}
                  onChange={handleBruttoChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    EUR
                  </span>
                </div>
              </div>
            </div>
          </form>
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
                  ? `${NumberFormatCurrency.format(brutto)} - ${NumberFormatCurrency.format(
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
              <DescriptionListItem title="Lohnsteuer">
                {brutto
                  ? `${NumberFormatCurrency.format(
                      bemessungsgrundlage
                    )} × ${NumberFormatPercentage.format(steuersatz)} - 
                ${NumberFormatCurrency.format(avab)} - 
                ${NumberFormatCurrency.format(verkehrsabsetzungsbetrag)} = 
                ${NumberFormatCurrency.format(lohnsteuer)} `
                  : NumberFormatCurrency.format(0)}
              </DescriptionListItem>
            </DescriptionList>
          </div>
        </section>
      </article>
    </main>
  );
}
