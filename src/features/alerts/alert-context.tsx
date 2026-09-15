import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  AlertContextValue,
  ShowAlertOptions,
  ShowDeleteAlertOptions,
} from './alert-types';
import { CustomAlertModal, CustomAlertModalProps } from './custom-alert-modal';

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<
    Omit<CustomAlertModalProps, 'onClose'> & { visible: boolean }
  >({
    visible: false,
    title: '',
    message: '',
  });

  const hideAlert = useCallback(() => {
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAlert = useCallback(
    ({
      title,
      message,
      type = 'info',
      icon,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      buttons,
    }: ShowAlertOptions) => {
      setModalState({
        visible: true,
        title,
        message,
        type,
        icon,
        isDelete: false,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        buttons,
      });
    },
    []
  );

  const showDeleteAlert = useCallback(
    ({
      title = 'Delete Item',
      message = 'Are you sure you want to permanently remove this? This cannot be undone.',
      itemName,
      confirmText = 'Delete',
      cancelText = 'Cancel',
      onDelete,
    }: ShowDeleteAlertOptions) => {
      setModalState({
        visible: true,
        title,
        message,
        itemName,
        isDelete: true,
        type: 'danger',
        confirmText,
        cancelText,
        onConfirm: onDelete,
        onCancel: () => {},
      });
    },
    []
  );

  return (
    <AlertContext.Provider value={{ showAlert, showDeleteAlert, hideAlert }}>
      {children}
      <CustomAlertModal
        {...modalState}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useCustomAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within an AlertProvider');
  }
  return context;
}
