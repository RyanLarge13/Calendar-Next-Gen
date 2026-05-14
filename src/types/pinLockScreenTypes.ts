export type PinLockScreenType = {
  mode?: string;
  title?: string;
  subtitle?: string;
  pinLength?: number;
  error?: string | null;
  onSubmit?: (pin: string) => void;
  onBiometricUnlock?: () => void;
};
