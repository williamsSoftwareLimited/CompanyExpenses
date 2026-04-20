import { useEffect, useRef, useState } from 'react';
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

const BLUR_DEBOUNCE_MS = 50;
const CLOSE_ICON = '✕';
const DISMISS_KEYBOARD_BUTTON_LABEL = `Close keyboard ${CLOSE_ICON}`;

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
  const [isAnyInputFocused, setIsAnyInputFocused] = useState(false);
  const blurTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsAnyInputFocused(true);
  };

  const handleInputBlur = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    blurTimeoutRef.current = setTimeout(() => {
      setIsAnyInputFocused(false);
      blurTimeoutRef.current = null;
    }, BLUR_DEBOUNCE_MS);
  };

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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close expense modal"
                  accessibilityHint="Closes the expense form and prompts if there are unsaved changes"
                >
                  <Text style={styles.modalCloseButtonText}>{CLOSE_ICON}</Text>
                </Pressable>
              </View>
              <TextInput
                value={newExpenseTitle}
                onChangeText={onChangeTitle}
                onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Title"
              accessibilityLabel="Expense title"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseAmount}
              onChangeText={onChangeAmount}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Amount"
              keyboardType="decimal-pad"
              accessibilityLabel="Expense amount"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseVatAmount}
              onChangeText={onChangeVatAmount}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="VAT amount"
              keyboardType="decimal-pad"
              accessibilityLabel="Expense VAT amount"
              style={styles.modalInput}
            />
            <TextInput
              value={newExpenseDescription}
              onChangeText={onChangeDescription}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
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
            {isKeyboardVisible || isAnyInputFocused ? (
              <Pressable
                style={styles.keyboardDismissButton}
                onPress={Keyboard.dismiss}
                accessibilityRole="button"
                accessibilityLabel="Dismiss keyboard"
                accessibilityHint="Dismisses the on-screen keyboard"
              >
                <Text style={styles.keyboardDismissButtonText}>{DISMISS_KEYBOARD_BUTTON_LABEL}</Text>
              </Pressable>
            ) : null}
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
