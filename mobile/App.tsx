import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ExpenseItem } from './src/components/ExpenseItem';
import { SettingsPanel } from './src/components/SettingsPanel';
import { ExpenseSummaryCard } from './src/components/ExpenseSummaryCard';
import {
  CurrencySymbol,
  Expense,
  calculateRemainingBudget,
  calculateTotalSpent,
  getBudgetStatus,
  summarizeExpenses,
} from './src/utils/expenseMath';

const monthlyBudget = 1000;
const expenses: Expense[] = [
  { id: '1', title: 'Team Lunch', amount: 120 },
  { id: '2', title: 'Taxi', amount: 65 },
  { id: '3', title: 'Stationery', amount: 40 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'settings'>('main');
  const [expenseList, setExpenseList] = useState<Expense[]>(expenses);
  const [currencySymbol, setCurrencySymbol] = useState<CurrencySymbol>('€');

  const totalSpent = calculateTotalSpent(expenseList);
  const remainingBudget = calculateRemainingBudget(monthlyBudget, totalSpent);
  const budgetStatus = getBudgetStatus(remainingBudget);
  const summary = summarizeExpenses(expenses, monthlyBudget);

  const handleCreate = () => {
    setExpenseList((currentExpenses) => {
      const existingIds = new Set(currentExpenses.map((expense) => expense.id));
      let nextExpenseId = currentExpenses.length + 1;

      while (existingIds.has(nextExpenseId.toString())) {
        nextExpenseId += 1;
      }

      return [
        ...currentExpenses,
        {
          id: nextExpenseId.toString(),
          title: `New Expense ${nextExpenseId}`,
          amount: 50,
        },
      ];
    });
  };

  const handleUpdate = () => {
    setExpenseList((currentExpenses) => {
      if (currentExpenses.length === 0) {
        return currentExpenses;
      }

      return currentExpenses.map((expense, index) =>
        index === 0
          ? {
              ...expense,
              amount: expense.amount + 10,
              title: expense.title.includes('(Updated)') ? expense.title : `${expense.title} (Updated)`,
            }
          : expense
      );
    });
  };

  const handleDelete = () => {
    setExpenseList((currentExpenses) => currentExpenses.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Company Expenses</Text>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabButton, activeTab === 'main' && styles.activeTabButton]}
          onPress={() => setActiveTab('main')}
        >
          <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>Main</Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'settings' && styles.activeTabButton]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
        </Pressable>
      </View>

      {activeTab === 'main' ? (
        <>
          <ExpenseSummaryCard
            totalBudget={monthlyBudget}
            totalSpent={totalSpent}
            budgetStatus={budgetStatus}
            currencySymbol={currencySymbol}
          />
          <View style={styles.actionContainer}>
            <Pressable style={styles.actionButton} onPress={handleCreate}>
              <Text style={styles.actionButtonText}>Create</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleUpdate}>
              <Text style={styles.actionButtonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleDelete}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </Pressable>
          </View>
          <FlatList
            data={expenseList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem title={item.title} amount={item.amount} currencySymbol={currencySymbol} />
            )}
            ListEmptyComponent={<Text style={styles.emptyStateText}>No expenses available.</Text>}
          />
        </>
      ) : (
        <SettingsPanel currencySymbol={currencySymbol} onCurrencyChange={setCurrencySymbol} />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#dde8ff',
  },
  tabText: {
    color: '#505050',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2f6bed',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2f6bed',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyStateText: {
    marginTop: 8,
    color: '#707070',
  },
});
