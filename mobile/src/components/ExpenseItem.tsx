import { Pressable, StyleSheet, Text } from 'react-native';
import { CurrencySymbol, formatCurrency } from '../utils/expenseMath';

type ExpenseItemProps = {
  title: string;
  amount: number;
  currencySymbol: CurrencySymbol;
  isSelected?: boolean;
  onPress?: () => void;
};

export const ExpenseItem = ({
  title,
  amount,
  currencySymbol,
  isSelected = false,
  onPress,
}: ExpenseItemProps) => {
  return (
    <Pressable style={[styles.item, isSelected && styles.selectedItem]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text>{formatCurrency(amount, currencySymbol)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  selectedItem: {
    borderColor: '#2f6bed',
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
});
