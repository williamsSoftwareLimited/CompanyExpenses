import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CurrencySymbol } from '../utils/expenseMath';

type SettingsPanelProps = {
  currencySymbol: CurrencySymbol;
  onCurrencyChange: (currency: CurrencySymbol) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  vatCalcAmount: number;
  onVatCalcAmountChange: (vatCalcAmount: number) => void;
  onResetSpent: () => void;
  canResetSpent: boolean;
};

export const SettingsPanel = ({
  currencySymbol,
  onCurrencyChange,
  budget,
  onBudgetChange,
  vatCalcAmount,
  onVatCalcAmountChange,
  onResetSpent,
  canResetSpent,
}: SettingsPanelProps) => {
  const [budgetInput, setBudgetInput] = useState(budget.toString());
  const [vatCalcAmountInput, setVatCalcAmountInput] = useState(vatCalcAmount.toString());

  useEffect(() => {
    setBudgetInput(budget.toString());
  }, [budget]);

  useEffect(() => {
    setVatCalcAmountInput(vatCalcAmount.toString());
  }, [vatCalcAmount]);

  const handleBudgetEndEditing = () => {
    const trimmedBudgetInput = budgetInput.trim();

    if (!trimmedBudgetInput) {
      setBudgetInput(budget.toString());
      return;
    }

    const parsedBudget = Number.parseFloat(trimmedBudgetInput);

    if (Number.isFinite(parsedBudget) && parsedBudget > 0) {
      onBudgetChange(parsedBudget);
      setBudgetInput(parsedBudget.toString());
      return;
    }

    setBudgetInput(budget.toString());
  };

  const parseVatCalcAmount = (value: string): number | null => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    // Matches "numerator/denominator" fractions such as "23/123" or "0.5/2.0".
    const fractionMatch = trimmedValue.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (fractionMatch) {
      const numerator = Number.parseFloat(fractionMatch[1]);
      const denominator = Number.parseFloat(fractionMatch[2]);
      if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
      return null;
    }

    const parsedValue = Number.parseFloat(trimmedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  };

  const handleVatCalcAmountEndEditing = () => {
    const parsedVatCalcAmount = parseVatCalcAmount(vatCalcAmountInput);

    if (parsedVatCalcAmount !== null && parsedVatCalcAmount > 0 && parsedVatCalcAmount <= 1) {
      onVatCalcAmountChange(parsedVatCalcAmount);
      setVatCalcAmountInput(parsedVatCalcAmount.toString());
      return;
    }

    setVatCalcAmountInput(vatCalcAmount.toString());
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
      <Text style={styles.settingsLabel}>VAT Calc Amount</Text>
      <TextInput
        value={vatCalcAmountInput}
        onChangeText={setVatCalcAmountInput}
        onEndEditing={handleVatCalcAmountEndEditing}
        keyboardType="numbers-and-punctuation"
        accessibilityLabel="VAT calculation amount"
        accessibilityHint="Enter a decimal like 0.18699 or a fraction like 23/123"
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
