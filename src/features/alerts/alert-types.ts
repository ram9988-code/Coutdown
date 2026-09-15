import { Ionicons } from '@expo/vector-icons';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void | Promise<void>;
}

export interface ShowAlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  buttons?: AlertButton[];
}

export interface ShowDeleteAlertOptions {
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  onDelete: () => void | Promise<void>;
}

export interface AlertContextValue {
  showAlert: (options: ShowAlertOptions) => void;
  showDeleteAlert: (options: ShowDeleteAlertOptions) => void;
  hideAlert: () => void;
}
