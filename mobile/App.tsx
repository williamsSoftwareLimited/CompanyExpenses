import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ExpenseItem } from './src/components/ExpenseItem';
import { ExpenseSummaryCard } from './src/components/ExpenseSummaryCard';
import { Expense, summarizeExpenses } from './src/utils/expenseMath';

const monthlyBudget = 1000;
const expenses: Expense[] = [
  { id: '1', title: 'Team Lunch', amount: 120 },
  { id: '2', title: 'Taxi', amount: 65 },
  { id: '3', title: 'Stationery', amount: 40 },
];

export default function App() {
  const summary = summarizeExpenses(expenses, monthlyBudget);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Company Expenses</Text>
      <ExpenseSummaryCard
        totalBudget={monthlyBudget}
        totalSpent={summary.totalSpent}
        budgetStatus={summary.budgetStatus}
      />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem title={item.title} amount={item.amount} />}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
