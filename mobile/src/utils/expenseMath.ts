export type Expense = {
  id: string;
  title: string;
  amount: number;
};

export type CurrencySymbol = '€' | '£' | '$';
export type BudgetStatus = 'on-track' | 'over-budget';

export type ExpenseSummary = {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetStatus: BudgetStatus;
  expenseCount: number;
  formattedTotalBudget: string;
  formattedTotalSpent: string;
  formattedRemainingBudget: string;
};

export const calculateTotalSpent = (expenses: Expense[]): number =>
  expenses.reduce((total, expense) => total + expense.amount, 0);

export const calculateRemainingBudget = (totalBudget: number, totalSpent: number): number =>
  totalBudget - totalSpent;

export const getBudgetStatus = (remainingBudget: number): BudgetStatus =>
  remainingBudget >= 0 ? 'on-track' : 'over-budget';

export const formatCurrency = (amount: number, currencySymbol: CurrencySymbol = '€'): string => {
  const absoluteAmount = Math.abs(amount).toFixed(2);
  const formattedAmount = `${currencySymbol}${absoluteAmount}`;

  return amount < 0 ? `-${formattedAmount}` : formattedAmount;
};

export const summarizeExpenses = (expenses: Expense[], totalBudget: number): ExpenseSummary => {
  const totalSpent = calculateTotalSpent(expenses);
  const remainingBudget = calculateRemainingBudget(totalBudget, totalSpent);

  return {
    totalBudget,
    totalSpent,
    remainingBudget,
    budgetStatus: getBudgetStatus(remainingBudget),
    expenseCount: expenses.length,
    formattedTotalBudget: formatCurrency(totalBudget),
    formattedTotalSpent: formatCurrency(totalSpent),
    formattedRemainingBudget: formatCurrency(remainingBudget),
  };
};
