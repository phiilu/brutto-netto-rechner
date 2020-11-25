import * as React from 'react';

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

function calculateSozialversicherung(brutto, reduced = 0) {
  let steuersatz = 0.1512;

  if (brutto > 1733) {
    steuersatz = 0.1612;
  }

  if (brutto > 1891) {
    steuersatz = 0.1712;
  }

  if (brutto > 2049) {
    steuersatz = 0.1812;
  }

  return Math.max(brutto * (steuersatz - reduced), 0);
}

function get13thSalary(brutto) {
  const sozialversicherung = calculateSozialversicherung(brutto, 0.01); // reduced by 1%
  const lohnsteuer = Math.max((brutto - sozialversicherung - 620) * 0.06, 0); // first 6 month are 620 Euro reduced
  const netto = Math.max(brutto - sozialversicherung - lohnsteuer, 0);

  return {
    netto,
    sozialversicherung,
    lohnsteuer
  };
}

function get14thSalary(brutto) {
  const sozialversicherung = calculateSozialversicherung(brutto, 0.01); // reduced by 1%
  const lohnsteuer = Math.max((brutto - sozialversicherung) * 0.06, 0);
  const netto = Math.max(brutto - sozialversicherung - lohnsteuer, 0);

  return {
    netto,
    sozialversicherung,
    lohnsteuer
  };
}

export function useNetto(brutto, period = 'monthly') {
  const multiplier = React.useMemo(() => (period === 'yearly' ? 14 : 1), [period]);

  const verkehrsabsetzungsbetrag = React.useMemo(() => (brutto > 0 ? 33.33 * multiplier : 0), [
    brutto,
    multiplier
  ]);
  const sozialversicherung = React.useMemo(() => calculateSozialversicherung(brutto) * multiplier, [
    brutto,
    multiplier
  ]);
  const sozialversicherungReduced = React.useMemo(
    () => calculateSozialversicherung(brutto, 0.01) * multiplier,
    [brutto, multiplier]
  );

  const bemessungsgrundlage = React.useMemo(
    () => Math.max(brutto * multiplier - sozialversicherung, 0),
    [brutto, sozialversicherung, multiplier]
  );
  const steuersatz = React.useMemo(() => getSteuersatz(bemessungsgrundlage / multiplier), [
    bemessungsgrundlage,
    multiplier
  ]);
  const avab = React.useMemo(() => Math.max(calculateAvab(steuersatz), 0), [steuersatz]);
  const lohnsteuer = React.useMemo(
    () =>
      Math.max(
        ((bemessungsgrundlage / multiplier) * steuersatz -
          avab -
          verkehrsabsetzungsbetrag / multiplier) *
          multiplier,
        0
      ),
    [bemessungsgrundlage, steuersatz, avab, verkehrsabsetzungsbetrag, multiplier]
  );
  const netto = React.useMemo(
    () => Math.max(brutto * multiplier - sozialversicherung - lohnsteuer, 0),
    [brutto, sozialversicherung, lohnsteuer, multiplier]
  );
  const netto13 = React.useMemo(() => get13thSalary(brutto), [brutto]);
  const netto14 = React.useMemo(() => get14thSalary(brutto), [brutto]);

  return {
    multiplier,
    verkehrsabsetzungsbetrag,
    sozialversicherung,
    sozialversicherungReduced,
    bemessungsgrundlage,
    steuersatz,
    avab,
    lohnsteuer,
    netto,
    netto13,
    netto14
  };
}
