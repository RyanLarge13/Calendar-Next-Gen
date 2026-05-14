import React, { useMemo, useState } from "react";

type PinLockMode = "unlock" | "set" | "change";

type PinLockScreenProps = {
  mode?: PinLockMode;
  title?: string;
  subtitle?: string;
  pinLength?: number;
  error?: string | null;
  onSubmit?: (pin: string) => void;
  onSetPin?: (pin: string) => void;
  onChangePin?: (oldPin: string, newPin: string) => void;
  onBiometricUnlock?: () => void;
};

const PinLockScreen = ({
  mode = "unlock",
  title,
  subtitle,
  pinLength = 4,
  error = null,
  onSubmit,
  onSetPin,
  onChangePin,
  onBiometricUnlock,
}: PinLockScreenProps) => {
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [step, setStep] = useState<"old" | "new" | "confirm">(
    mode === "change" ? "old" : "new",
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const pinSlots = useMemo(
    () => Array.from({ length: pinLength }),
    [pinLength],
  );

  const displayTitle =
    title ??
    (mode === "unlock"
      ? "App Locked"
      : mode === "set"
        ? step === "confirm"
          ? "Confirm PIN"
          : "Create PIN"
        : step === "old"
          ? "Current PIN"
          : step === "confirm"
            ? "Confirm New PIN"
            : "New PIN");

  const displaySubtitle =
    subtitle ??
    (mode === "unlock"
      ? "Enter your PIN to unlock your workspace."
      : mode === "set"
        ? step === "confirm"
          ? "Enter your PIN again to confirm it."
          : "Choose a PIN to protect your workspace."
        : step === "old"
          ? "Enter your current PIN before changing it."
          : step === "confirm"
            ? "Enter your new PIN again to confirm it."
            : "Choose your new app PIN.");

  const resetEntry = () => setPin("");

  const handleCompletedPin = (completedPin: string) => {
    if (mode === "unlock") {
      onSubmit?.(completedPin);
      return;
    }

    if (mode === "set") {
      if (step === "new") {
        setFirstPin(completedPin);
        setStep("confirm");
        resetEntry();
        return;
      }

      if (completedPin !== firstPin) {
        setLocalError("PINs do not match. Try again.");
        setFirstPin("");
        setStep("new");
        resetEntry();
        return;
      }

      onSetPin?.(completedPin);
      return;
    }

    if (mode === "change") {
      if (step === "old") {
        setOldPin(completedPin);
        setStep("new");
        resetEntry();
        return;
      }

      if (step === "new") {
        setFirstPin(completedPin);
        setStep("confirm");
        resetEntry();
        return;
      }

      if (completedPin !== firstPin) {
        setLocalError("New PINs do not match. Try again.");
        setFirstPin("");
        setStep("new");
        resetEntry();
        return;
      }

      onChangePin?.(oldPin, completedPin);
    }
  };

  const handleNumber = (num: string) => {
    if (pin.length >= pinLength) return;

    setLocalError(null);

    const nextPin = pin + num;
    setPin(nextPin);

    if (nextPin.length === pinLength) {
      setTimeout(() => handleCompletedPin(nextPin), 120);
    }
  };

  const handleDelete = () => setPin((prev) => prev.slice(0, -1));

  const handleClear = () => {
    setLocalError(null);
    setPin("");
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const shownError = error ?? localError;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#07070A] px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_40%)]" />

      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative w-full max-w-[390px] rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="rounded-[1.55rem] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.035] p-5">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 shadow-lg shadow-cyan-950/30">
              <span className="text-2xl">{mode === "unlock" ? "🔒" : "✦"}</span>
            </div>

            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
              {mode === "unlock" ? "Secure Session" : "Security Setup"}
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {displayTitle}
            </h1>

            <p className="mx-auto mt-2 max-w-[260px] text-sm leading-5 text-white/50">
              {displaySubtitle}
            </p>
          </div>

          <div className="mb-5 flex items-center justify-center gap-3">
            {pinSlots.map((_, index) => {
              const filled = index < pin.length;

              return (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full border transition-all duration-200 ${
                    filled
                      ? "scale-110 border-cyan-200 bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.65)]"
                      : "border-white/20 bg-white/5"
                  }`}
                />
              );
            })}
          </div>

          {shownError && (
            <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-center text-xs text-red-200">
              {shownError}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {numbers.map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => handleNumber(number)}
                className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-lg font-medium text-white shadow-sm transition-all duration-200 hover:border-cyan-200/25 hover:bg-white/[0.10] active:scale-95"
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-xs font-semibold uppercase tracking-widest text-white/45 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/70 active:scale-95"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleNumber("0")}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-lg font-medium text-white shadow-sm transition-all duration-200 hover:border-cyan-200/25 hover:bg-white/[0.10] active:scale-95"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-xs font-semibold uppercase tracking-widest text-white/45 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/70 active:scale-95"
            >
              Del
            </button>
          </div>

          {mode === "unlock" && onBiometricUnlock && (
            <button
              type="button"
              onClick={onBiometricUnlock}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-100 transition-all duration-200 hover:border-cyan-200/30 hover:bg-cyan-300/[0.12] active:scale-[0.98]"
            >
              <span>✦</span>
              Unlock with biometrics
            </button>
          )}

          <p className="mt-5 text-center text-[0.68rem] leading-4 text-white/35">
            {mode === "unlock"
              ? "Your app stays private until unlocked."
              : "Choose something memorable, but not easy to guess."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinLockScreen;
