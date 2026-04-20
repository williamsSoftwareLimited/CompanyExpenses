export type Expense = {
  id: string;
  title: string;
  amount: number;
  vatAmount: number | null;
  description: string;
  createdDate: string;
  updatedDate: string;
  receipt: string | null;
};

export type CurrencySymbol = '€' | '£' | '$';
export type BudgetStatus = 'on-track' | 'over-budget';
export const DEFAULT_VAT_CALC_AMOUNT = 23 / 123;

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

export const calculateVat = (
  amount: number,
  vatCalcAmount: number = DEFAULT_VAT_CALC_AMOUNT
): number => amount * vatCalcAmount;

export const formatVatAmountForModal = (vatAmount: number): string => vatAmount.toFixed(2);

export const resolveVatAmount = (
  amount: number,
  vatCalcAmount: number = DEFAULT_VAT_CALC_AMOUNT,
  vatAmount: number | null = null
): number => (vatAmount === null ? calculateVat(amount, vatCalcAmount) : vatAmount);

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
