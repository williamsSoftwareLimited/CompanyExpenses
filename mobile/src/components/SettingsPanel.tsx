import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';
import { CurrencySymbol } from '../utils/expenseMath';

type SettingsPanelProps = {
  currencySymbol: CurrencySymbol;
  onCurrencyChange: (currency: CurrencySymbol) => void;
};

export const SettingsPanel = ({ currencySymbol, onCurrencyChange }: SettingsPanelProps) => {
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
});
