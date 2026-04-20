import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from './ExpenseModalStyles';

type ExpenseModalProps = {
  visible: boolean;
  isKeyboardVisible: boolean;
  isProcessingReceipt: boolean;
  isSubmitDisabled: boolean;
  modalTitle: string;
  submitButtonLabel: string;
  submitButtonAccessibilityHint: string;
  cancelButtonAccessibilityLabel: string;
  newExpenseTitle: string;
  newExpenseAmount: string;
  newExpenseVatAmount: string;
  newExpenseDescription: string;
  newExpenseReceipt: string;
  onChangeTitle: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeVatAmount: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onSelectReceipt: (source: 'camera' | 'library') => void | Promise<void>;
  onClearReceipt: () => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function ExpenseModal({
  visible,
  isKeyboardVisible,
  isProcessingReceipt,
  isSubmitDisabled,
  modalTitle,
  submitButtonLabel,
  submitButtonAccessibilityHint,
  cancelButtonAccessibilityLabel,
  newExpenseTitle,
  newExpenseAmount,
  newExpenseVatAmount,
  newExpenseDescription,
  newExpenseReceipt,
  onChangeTitle,
  onChangeAmount,
  onChangeVatAmount,
  onChangeDescription,
  onSelectReceipt,
  onClearReceipt,
  onSubmit,
  onClose,
}: ExpenseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalKeyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={Keyboard.dismiss}
          accessibilityRole="button"
          accessibilityLabel="Modal background"
        >
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TextInput
              value={newExpenseTitle}
              onChangeText={onChangeTitle}
              placeholder="Title"
              accessibilityLabel="Expense title"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseAmount}
              onChangeText={onChangeAmount}
              placeholder="Amount"
              keyboardType="decimal-pad"
              accessibilityLabel="Expense amount"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseVatAmount}
              onChangeText={onChangeVatAmount}
              placeholder="VAT amount"
              keyboardType="decimal-pad"
              accessibilityLabel="Expense VAT amount"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseDescription}
              onChangeText={onChangeDescription}
              placeholder="Description"
              accessibilityLabel="Expense description"
              style={styles.modalInput}
              multiline
            />
            <View style={styles.receiptSection}>
              <Text style={styles.receiptSectionTitle}>Receipt</Text>
              <View style={styles.receiptHolder}>
                {newExpenseReceipt ? (
                  <Image
                    source={{ uri: newExpenseReceipt }}
                    style={styles.receiptImage}
                    accessibilityLabel="Selected receipt image"
                  />
                ) : (
                  <Text style={styles.receiptPlaceholderText}>No receipt selected</Text>
                )}
              </View>
              {isProcessingReceipt ? (
                <View style={styles.ocrStatus}>
                  <ActivityIndicator size="small" color="#2f6bed" />
                  <Text style={styles.ocrStatusText}>Reading receipt with OCR…</Text>
                </View>
              ) : null}
              <View style={styles.receiptActions}>
                <Pressable
                  style={[styles.actionButton, styles.receiptActionButton]}
                  onPress={() => {
                    void onSelectReceipt('camera');
                  }}
                  accessibilityLabel="Take receipt photo"
                >
                  <Text style={styles.actionButtonText}>Take photo</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.receiptActionButton]}
                  onPress={() => {
                    void onSelectReceipt('library');
                  }}
                  accessibilityLabel="Choose receipt from photos"
                >
                  <Text style={styles.actionButtonText}>Choose photo</Text>
                </Pressable>
                {newExpenseReceipt ? (
                  <Pressable
                    style={[styles.actionButton, styles.receiptActionButton, styles.clearReceiptButton]}
                    onPress={onClearReceipt}
                    accessibilityLabel="Remove selected receipt"
                  >
                    <Text style={styles.actionButtonText}>Clear</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <Pressable
              style={styles.keyboardDismissButton}
              onPress={Keyboard.dismiss}
              accessibilityRole="button"
              accessibilityLabel="Hide keyboard"
              accessibilityHint="Dismisses the on-screen keyboard"
            >
              <Text style={styles.keyboardDismissButtonText}>Hide keyboard</Text>
            </Pressable>
            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.actionButton,
                  styles.modalActionButton,
                  isSubmitDisabled && styles.disabledActionButton,
                ]}
                onPress={onSubmit}
                disabled={isSubmitDisabled}
                accessibilityLabel={`${submitButtonLabel} expense`}
                accessibilityHint={submitButtonAccessibilityHint}
              >
                <Text style={styles.actionButtonText}>{submitButtonLabel}</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.modalActionButton, styles.cancelButton]}
                onPress={onClose}
                accessibilityLabel={cancelButtonAccessibilityLabel}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
