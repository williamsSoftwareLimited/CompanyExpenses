import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 16,
    paddingTop: 72,
  },
  modalKeyboardContainer: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  receiptSection: {
    gap: 8,
  },
  receiptSectionTitle: {
    fontWeight: '600',
  },
  receiptHolder: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  receiptPlaceholderText: {
    color: '#606060',
  },
  receiptActions: {
    flexDirection: 'row',
    gap: 8,
  },
  receiptActionButton: {
    flex: 1,
  },
  clearReceiptButton: {
    backgroundColor: '#6f6f6f',
  },
  ocrStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ocrStatusText: {
    color: '#2f6bed',
    fontWeight: '500',
  },
  keyboardDismissButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  keyboardDismissButtonText: {
    color: '#2f6bed',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalActionButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6f6f6f',
  },
  disabledActionButton: {
    backgroundColor: '#a6b8e8',
  },
});
