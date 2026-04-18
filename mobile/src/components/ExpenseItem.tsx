import { Pressable, StyleSheet, Text } from 'react-native';
import { CurrencySymbol, formatCurrency } from '../utils/expenseMath';

type ExpenseItemProps = {
  title: string;
  amount: number;
  description: string;
  createdDate: string;
  updatedDate: string;
  receipt: string | null;
  currencySymbol: CurrencySymbol;
  isSelected?: boolean;
  onPress?: () => void;
};

export const ExpenseItem = ({
  title,
  amount,
  description,
  createdDate,
  updatedDate,
  receipt,
  currencySymbol,
  isSelected = false,
  onPress,
}: ExpenseItemProps) => {
  const formattedCreatedDate = new Date(createdDate).toLocaleDateString();
  const formattedUpdatedDate = new Date(updatedDate).toLocaleDateString();

  return (
    <Pressable
      style={[styles.item, isSelected && styles.selectedItem]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${title}, ${formatCurrency(amount, currencySymbol)}`}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description || 'No description provided.'}</Text>
      <Text>{formatCurrency(amount, currencySymbol)}</Text>
      <Text style={styles.metadataText}>Created: {formattedCreatedDate}</Text>
      <Text style={styles.metadataText}>Updated: {formattedUpdatedDate}</Text>
      <Text style={styles.metadataText}>Receipt: {receipt ? 'Attached' : 'Not attached'}</Text>
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
  description: {
    color: '#404040',
    marginBottom: 2,
  },
  metadataText: {
    color: '#606060',
    fontSize: 12,
  },
});
