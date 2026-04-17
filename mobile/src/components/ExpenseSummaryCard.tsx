import { StyleSheet, Text, View } from 'react-native';
import { CurrencySymbol, formatCurrency } from '../utils/expenseMath';

type ExpenseSummaryCardProps = {
  totalBudget: number;
  totalSpent: number;
  budgetStatus: 'on-track' | 'over-budget';
  currencySymbol: CurrencySymbol;
};

export const ExpenseSummaryCard = ({
  totalBudget,
  totalSpent,
  budgetStatus,
  currencySymbol,
}: ExpenseSummaryCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Monthly Summary</Text>
      <Text>Budget: {formatCurrency(totalBudget, currencySymbol)}</Text>
      <Text>Spent: {formatCurrency(totalSpent, currencySymbol)}</Text>
      <Text style={budgetStatus === 'over-budget' ? styles.overBudget : styles.onTrack}>
        Status: {budgetStatus}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  onTrack: {
    color: '#1f8f4b',
  },
  overBudget: {
    color: '#c62828',
  },
});
