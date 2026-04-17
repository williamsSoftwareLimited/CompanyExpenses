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

export const formatCurrency = (amount: number, currencySymbol: CurrencySymbol = '€'): string => {
  const absoluteAmount = Math.abs(amount).toFixed(2);
  const formattedAmount = `${currencySymbol}${absoluteAmount}`;

  return amount < 0 ? `-${formattedAmount}` : formattedAmount;
};
