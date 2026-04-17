import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../utils/expenseMath';

type ExpenseSummaryCardProps = {
  totalBudget: number;
  totalSpent: number;
  budgetStatus: 'on-track' | 'over-budget';
};

export const ExpenseSummaryCard = ({ totalBudget, totalSpent, budgetStatus }: ExpenseSummaryCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Monthly Summary</Text>
      <Text>Budget: {formatCurrency(totalBudget)}</Text>
      <Text>Spent: {formatCurrency(totalSpent)}</Text>
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
