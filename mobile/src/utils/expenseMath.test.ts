import {
  calculateTotalSpent,
  formatCurrency,
  getBudgetStatus,
  summarizeExpenses,
  calculateRemainingBudget,
} from './expenseMath';

describe('expenseMath', () => {
  it('calculates total spent from expenses', () => {
    expect(
      calculateTotalSpent([
        { id: '1', title: 'Lunch', amount: 25 },
        { id: '2', title: 'Travel', amount: 15.5 },
      ])
    ).toBe(40.5);
  });

  it('returns zero when no expenses are present', () => {
    expect(calculateTotalSpent([])).toBe(0);
  });

  it('calculates remaining budget', () => {
    expect(calculateRemainingBudget(200, 75)).toBe(125);
  });

  it('returns on-track status when budget remains', () => {
    expect(getBudgetStatus(5)).toBe('on-track');
  });

  it('returns over-budget status when budget is negative', () => {
    expect(getBudgetStatus(-1)).toBe('over-budget');
  });

  it('formats EUR by default', () => {
    expect(formatCurrency(123.45)).toBe('€123.45');
  });

  it('formats selected currencies', () => {
    expect(formatCurrency(123.45, '£')).toBe('£123.45');
    expect(formatCurrency(123.45, '$')).toBe('$123.45');
  });

  it('summarizes expenses for shared app and MCP usage', () => {
    expect(
      summarizeExpenses(
        [
          { id: '1', title: 'Lunch', amount: 25 },
          { id: '2', title: 'Travel', amount: 15.5 },
        ],
        100
      )
    ).toEqual({
      totalBudget: 100,
      totalSpent: 40.5,
      remainingBudget: 59.5,
      budgetStatus: 'on-track',
      expenseCount: 2,
      formattedTotalBudget: '£100.00',
      formattedTotalSpent: '£40.50',
      formattedRemainingBudget: '£59.50',
    });
  });
});
