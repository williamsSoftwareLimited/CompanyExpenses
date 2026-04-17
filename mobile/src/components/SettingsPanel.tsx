import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CurrencySymbol } from '../utils/expenseMath';

type SettingsPanelProps = {
  currencySymbol: CurrencySymbol;
  onCurrencyChange: (currency: CurrencySymbol) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  onResetSpent: () => void;
  canResetSpent: boolean;
};

export const SettingsPanel = ({
  currencySymbol,
  onCurrencyChange,
  budget,
  onBudgetChange,
  onResetSpent,
  canResetSpent,
}: SettingsPanelProps) => {
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  useEffect(() => {
    setBudgetInput(budget.toString());
  }, [budget]);

  const handleBudgetEndEditing = () => {
    const parsedBudget = Number.parseFloat(budgetInput);

    if (Number.isFinite(parsedBudget) && parsedBudget >= 0) {
      onBudgetChange(parsedBudget);
      setBudgetInput(parsedBudget.toString());
      return;
    }

    setBudgetInput(budget.toString());
  };

  return (
    <View style={styles.settingsCard}>
      <Text style={styles.settingsLabel}>Currency</Text>
      <Picker
        selectedValue={currencySymbol}
        onValueChange={(itemValue) => onCurrencyChange(itemValue as CurrencySymbol)}
        style={styles.currencyPicker}
      >
        <Picker.Item label="€" value="€" />
        <Picker.Item label="£" value="£" />
        <Picker.Item label="$" value="$" />
      </Picker>
      <Text style={styles.settingsLabel}>Budget</Text>
      <TextInput
        value={budgetInput}
        onChangeText={setBudgetInput}
        onEndEditing={handleBudgetEndEditing}
        keyboardType="decimal-pad"
        accessibilityLabel="Budget amount"
        style={styles.budgetInput}
      />
      <Pressable
        style={[styles.resetButton, !canResetSpent && styles.resetButtonDisabled]}
        onPress={onResetSpent}
        disabled={!canResetSpent}
      >
        <Text style={styles.resetButtonText}>Reset Spent Amount</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  settingsLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  currencyPicker: {
    marginHorizontal: -8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#c62828',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#e6a3a3',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
