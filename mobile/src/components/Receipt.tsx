import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ReceiptProps = {
  receiptUri: string;
  isProcessingReceipt: boolean;
  onSelectReceipt: (source: 'camera' | 'library') => void | Promise<void>;
  onClearReceipt: () => void;
};

export function Receipt({
  receiptUri,
  isProcessingReceipt,
  onSelectReceipt,
  onClearReceipt,
}: ReceiptProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const hasReceipt = Boolean(receiptUri?.trim());

  return (
    <View style={styles.receiptSection}>
      <View style={styles.receiptSummaryRow}>
        <Text style={styles.receiptSectionTitle}>Receipt</Text>
        <Text style={styles.receiptStatusText}>{hasReceipt ? 'Attached' : 'Not attached'}</Text>
      </View>
      <Pressable
        style={styles.viewReceiptButton}
        onPress={() => setIsViewerOpen(true)}
        accessibilityLabel="View receipt"
      >
        <Text style={styles.viewReceiptButtonText}>View receipt</Text>
      </Pressable>
      {isProcessingReceipt ? (
        <View style={styles.ocrStatus}>
          <ActivityIndicator size="small" color="#2f6bed" />
          <Text style={styles.ocrStatusText}>Reading receipt with OCR…</Text>
        </View>
      ) : null}
      <Modal
        visible={isViewerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsViewerOpen(false)}
      >
        <View style={styles.viewerOverlay}>
          <View style={styles.viewerCard}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle}>Receipt</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setIsViewerOpen(false)}
                accessibilityLabel="Close receipt viewer"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.receiptHolder}>
              {hasReceipt ? (
                <Image
                  source={{ uri: receiptUri }}
                  style={styles.receiptImage}
                  accessibilityLabel="Selected receipt image"
                />
              ) : (
                <View style={styles.emptyReceiptContainer}>
                  <Text style={styles.emptyReceiptIcon}>🖼️</Text>
                  <Text style={styles.emptyReceiptText}>No receipt selected</Text>
                </View>
              )}
            </View>
            <View style={styles.receiptActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  void onSelectReceipt('camera');
                }}
                accessibilityLabel="Take receipt photo"
              >
                <Text style={styles.actionButtonText}>Take photo</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  void onSelectReceipt('library');
                }}
                accessibilityLabel="Use photo from library"
              >
                <Text style={styles.actionButtonText}>Use photo</Text>
              </Pressable>
            </View>
            {hasReceipt ? (
              <Pressable
                style={[styles.actionButton, styles.clearButton]}
                onPress={onClearReceipt}
                accessibilityLabel="Remove selected receipt"
              >
                <Text style={styles.actionButtonText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptSection: {
    gap: 8,
  },
  receiptSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptSectionTitle: {
    fontWeight: '600',
  },
  receiptStatusText: {
    color: '#606060',
    fontSize: 12,
  },
  viewReceiptButton: {
    backgroundColor: '#2f6bed',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewReceiptButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
    justifyContent: 'center',
  },
  viewerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eceff5',
  },
  closeButtonText: {
    color: '#2b2b2b',
    fontSize: 16,
    fontWeight: '700',
  },
  receiptHolder: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
  },
  emptyReceiptContainer: {
    alignItems: 'center',
    gap: 4,
  },
  emptyReceiptIcon: {
    fontSize: 28,
  },
  emptyReceiptText: {
    color: '#606060',
  },
  receiptActions: {
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
  clearButton: {
    backgroundColor: '#6f6f6f',
  },
});
