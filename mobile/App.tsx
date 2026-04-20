import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { recognizeText } from 'expo-ocr-kit';
import {
  AccessibilityInfo,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ExpenseItem } from './src/components/ExpenseItem';
import { ExpenseModal } from './src/components/ExpenseModal';
import { SettingsPanel } from './src/components/SettingsPanel';
import { ExpenseSummaryCard } from './src/components/ExpenseSummaryCard';
import {
  CurrencySymbol,
  Expense,
  calculateRemainingBudget,
  calculateTotalSpent,
  getBudgetStatus,
} from './src/utils/expenseMath';

const expenses: Expense[] = [
  {
    id: '1',
    title: 'Team Lunch',
    amount: 120,
    description: 'Lunch with client success team.',
    createdDate: '2026-01-05T09:00:00.000Z',
    updatedDate: '2026-01-05T09:00:00.000Z',
    receipt: null,
  },
  {
    id: '2',
    title: 'Taxi',
    amount: 65,
    description: 'Airport transfer for partner meeting.',
    createdDate: '2026-01-09T08:30:00.000Z',
    updatedDate: '2026-01-09T08:30:00.000Z',
    receipt: null,
  },
  {
    id: '3',
    title: 'Stationery',
    amount: 40,
    description: 'Office stationery refill.',
    createdDate: '2026-01-11T14:15:00.000Z',
    updatedDate: '2026-01-11T14:15:00.000Z',
    receipt: null,
  },
];

type ParsedReceiptData = {
  title?: string;
  amount?: string;
  description?: string;
};

const parseReceiptData = (rawText: string): ParsedReceiptData => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const title = lines.find(
    (line) =>
      /[a-z]/i.test(line) &&
      !/total|tax|subtotal|vat|invoice|receipt no|amount/i.test(line) &&
      line.length >= 3 &&
      line.length <= 60
  );

  const labeledAmountMatch = rawText.match(
    /(?:grand\s*total|total\s*due|amount\s*due|total)\D*(\d+(?:[.,]\d{2})?)/i
  );

  let strongestAmount: number | null = null;
  const numericRegex = /(?:€|£|\$)?\s*(\d+(?:[.,]\d{2}))/g;
  for (const match of rawText.matchAll(numericRegex)) {
    const parsedAmount = Number.parseFloat((match[1] ?? '').replace(',', '.'));
    if (Number.isFinite(parsedAmount) && (strongestAmount === null || parsedAmount > strongestAmount)) {
      strongestAmount = parsedAmount;
    }
  }

  const labeledAmount = labeledAmountMatch?.[1]
    ? Number.parseFloat(labeledAmountMatch[1].replace(',', '.'))
    : null;

  const resolvedAmount = Number.isFinite(labeledAmount) ? labeledAmount : strongestAmount;

  const description = lines.slice(0, 4).join(' ').slice(0, 160);

  return {
    title,
    amount: resolvedAmount !== null ? resolvedAmount.toString() : undefined,
    description: description || undefined,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'settings'>('main');
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [expenseList, setExpenseList] = useState<Expense[]>(expenses);
  const [currencySymbol, setCurrencySymbol] = useState<CurrencySymbol>('€');
  const [modalMode, setModalMode] = useState<'create' | 'update' | null>(null);
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseReceipt, setNewExpenseReceipt] = useState('');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);

  const totalSpent = calculateTotalSpent(expenseList);
  const remainingBudget = calculateRemainingBudget(monthlyBudget, totalSpent);
  const budgetStatus = getBudgetStatus(remainingBudget);
  const parsedExpenseAmount = useMemo(() => {
    const parsedValue = Number.parseFloat(newExpenseAmount);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }, [newExpenseAmount]);
  const isExpenseAmountValid = parsedExpenseAmount !== null && parsedExpenseAmount > 0;

  const selectedExpense = useMemo(
    () => expenseList.find((expense) => expense.id === selectedExpenseId) ?? null,
    [expenseList, selectedExpenseId]
  );
  const hasSelectedExpense = selectedExpense !== null;
  const isModalVisible = modalMode !== null;
  const isUpdateMode = modalMode === 'update';
  const submitButtonLabel = isUpdateMode ? 'Update' : 'Create';
  const submitButtonAccessibilityHint = isUpdateMode
    ? 'Updates the selected expense with the entered title and amount'
    : 'Creates a new expense with the entered title and amount';
  const modalTitle = isUpdateMode ? 'Update Expense' : 'Create Expense';
  const cancelButtonAccessibilityLabel = isUpdateMode
    ? 'Cancel expense update'
    : 'Cancel expense creation';
  const isSubmitDisabled = useMemo(
    () => !newExpenseTitle.trim() || !isExpenseAmountValid,
    [newExpenseTitle, isExpenseAmountValid]
  );

  const closeModal = () => {
    setModalMode(null);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseReceipt('');
    setIsProcessingReceipt(false);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseReceipt('');
    setIsProcessingReceipt(false);
  };

  const openUpdateModal = () => {
    if (!selectedExpense) {
      return;
    }

    setModalMode('update');
    setNewExpenseTitle(selectedExpense.title);
    setNewExpenseAmount(selectedExpense.amount.toString());
    setNewExpenseDescription(selectedExpense.description);
    setNewExpenseReceipt(selectedExpense.receipt ?? '');
    setIsProcessingReceipt(false);
  };

  const handleReceiptOcr = async (receiptUri: string) => {
    setIsProcessingReceipt(true);

    try {
      const ocrResult = await recognizeText(receiptUri);
      const recognizedText = ocrResult?.text?.trim();

      if (!recognizedText) {
        Alert.alert('OCR', 'No text was recognized from the selected receipt image.');
        return;
      }

      const parsedReceiptData = parseReceiptData(recognizedText);

      if (parsedReceiptData.title && !newExpenseTitle.trim()) {
        setNewExpenseTitle(parsedReceiptData.title);
      }

      if (parsedReceiptData.amount && !newExpenseAmount.trim()) {
        setNewExpenseAmount(parsedReceiptData.amount);
      }

      if (parsedReceiptData.description && !newExpenseDescription.trim()) {
        setNewExpenseDescription(parsedReceiptData.description);
      }
    } catch {
      Alert.alert(
        'OCR unavailable',
        'OCR could not be completed on this build. Receipt image was still attached successfully.'
      );
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handleSelectReceipt = async (source: 'camera' | 'library') => {
    const permissionsResponse =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionsResponse.granted) {
      Alert.alert(
        'Permission needed',
        source === 'camera'
          ? 'Camera access is needed to take a receipt photo.'
          : 'Photo library access is needed to select a receipt image.'
      );
      return;
    }

    const pickerResult =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });

    if (pickerResult.canceled) {
      return;
    }

    const receiptUri = pickerResult.assets?.[0]?.uri;

    if (!receiptUri) {
      return;
    }

    setNewExpenseReceipt(receiptUri);
    await handleReceiptOcr(receiptUri);
  };

  const handleSubmitExpense = () => {
    const trimmedTitle = newExpenseTitle.trim();
    const trimmedDescription = newExpenseDescription.trim();
    const trimmedReceipt = newExpenseReceipt.trim();

    if (!trimmedTitle || !isExpenseAmountValid) {
      return;
    }

    if (isUpdateMode) {
      if (!selectedExpenseId) {
        return;
      }

      setExpenseList((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === selectedExpenseId
            ? {
                ...expense,
                title: trimmedTitle,
                amount: parsedExpenseAmount,
                description: trimmedDescription,
                updatedDate: new Date().toISOString(),
                receipt: trimmedReceipt || null,
              }
            : expense
        )
      );
      closeModal();
      return;
    }

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
          title: trimmedTitle,
          amount: parsedExpenseAmount,
          description: trimmedDescription,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          receipt: trimmedReceipt || null,
        },
      ];
    });

    closeModal();
  };

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenseId((currentId) => {
      const isSelecting = currentId !== expenseId;
      const selectedTitle = expenseList.find((expense) => expense.id === expenseId)?.title;

      if (selectedTitle) {
        AccessibilityInfo.announceForAccessibility(
          `${selectedTitle} ${isSelecting ? 'selected' : 'deselected'}`
        );
      }

      return isSelecting ? expenseId : null;
    });
  };

  const handleDelete = () => {
    if (!selectedExpenseId || !selectedExpense) {
      return;
    }

    Alert.alert('Delete Expense', `Are you sure you want to delete "${selectedExpense.title}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => {
          setExpenseList((currentExpenses) =>
            currentExpenses.filter((expense) => expense.id !== selectedExpenseId)
          );
          setSelectedExpenseId(null);
        },
      },
    ]);
  };

  const handleResetSpent = () => {
    setExpenseList([]);
    setSelectedExpenseId(null);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (isModalVisible) {
        setIsKeyboardVisible(true);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    if (!isModalVisible) {
      setIsKeyboardVisible(false);
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isModalVisible]);

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
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
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
            <Pressable style={styles.actionButton} onPress={openCreateModal}>
              <Text style={styles.actionButtonText}>Create</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, !hasSelectedExpense && styles.disabledActionButton]}
              onPress={openUpdateModal}
              disabled={!hasSelectedExpense}
            >
              <Text style={styles.actionButtonText}>Update</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, !hasSelectedExpense && styles.disabledActionButton]}
              onPress={handleDelete}
              disabled={!hasSelectedExpense}
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </Pressable>
          </View>
          <FlatList
            data={expenseList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem
                title={item.title}
                amount={item.amount}
                description={item.description}
                createdDate={item.createdDate}
                updatedDate={item.updatedDate}
                receipt={item.receipt}
                currencySymbol={currencySymbol}
                isSelected={item.id === selectedExpenseId}
                onPress={() => handleSelectExpense(item.id)}
              />
            )}
            ListEmptyComponent={<Text style={styles.emptyStateText}>No expenses available.</Text>}
          />
          <ExpenseModal
            visible={isModalVisible}
            isKeyboardVisible={isKeyboardVisible}
            isProcessingReceipt={isProcessingReceipt}
            isSubmitDisabled={isSubmitDisabled}
            modalTitle={modalTitle}
            submitButtonLabel={submitButtonLabel}
            submitButtonAccessibilityHint={submitButtonAccessibilityHint}
            cancelButtonAccessibilityLabel={cancelButtonAccessibilityLabel}
            newExpenseTitle={newExpenseTitle}
            newExpenseAmount={newExpenseAmount}
            newExpenseDescription={newExpenseDescription}
            newExpenseReceipt={newExpenseReceipt}
            onChangeTitle={setNewExpenseTitle}
            onChangeAmount={setNewExpenseAmount}
            onChangeDescription={setNewExpenseDescription}
            onSelectReceipt={handleSelectReceipt}
            onClearReceipt={() => setNewExpenseReceipt('')}
            onSubmit={handleSubmitExpense}
            onClose={closeModal}
          />
        </>
      ) : (
        <SettingsPanel
          currencySymbol={currencySymbol}
          onCurrencyChange={setCurrencySymbol}
          budget={monthlyBudget}
          onBudgetChange={setMonthlyBudget}
          onResetSpent={handleResetSpent}
          canResetSpent={expenseList.length > 0}
        />
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
  disabledActionButton: {
    backgroundColor: '#a6b8e8',
  },
});
