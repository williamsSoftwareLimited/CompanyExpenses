import { StyleSheet, Text, View } from 'react-native';
import { CurrencySymbol, formatCurrency } from '../utils/expenseMath';

type ExpenseItemProps = {
  title: string;
  amount: number;
  currencySymbol: CurrencySymbol;
};

export const ExpenseItem = ({ title, amount, currencySymbol }: ExpenseItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text>{formatCurrency(amount, currencySymbol)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
});
