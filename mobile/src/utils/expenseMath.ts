export type Expense = {
  id: string;
  title: string;
  amount: number;
};

export type CurrencySymbol = '€' | '£' | '$';

export const calculateTotalSpent = (expenses: Expense[]): number =>
  expenses.reduce((total, expense) => total + expense.amount, 0);

export const calculateRemainingBudget = (totalBudget: number, totalSpent: number): number =>
  totalBudget - totalSpent;

export const getBudgetStatus = (remainingBudget: number): 'on-track' | 'over-budget' =>
  remainingBudget >= 0 ? 'on-track' : 'over-budget';

const currencyFormatConfig: Record<CurrencySymbol, { locale: string; currency: string }> = {
  '€': { locale: 'en-IE', currency: 'EUR' },
  '£': { locale: 'en-GB', currency: 'GBP' },
  $: { locale: 'en-US', currency: 'USD' },
};

export const formatCurrency = (amount: number, currencySymbol: CurrencySymbol = '€'): string => {
  const config = currencyFormatConfig[currencySymbol];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
};
