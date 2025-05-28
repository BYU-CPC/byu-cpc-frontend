import React from "react";

type InputBaseProps<T> = {
  value: T;
  setValue: (value: T) => void;
  disabled?: boolean;
};

export function Input({
  value,
  setValue,
  disabled = false,
}: InputBaseProps<string>) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={disabled}
      className="input-field"
    />
  );
}

export function Checkbox({
  value,
  setValue,
  disabled = false,
}: InputBaseProps<boolean>) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
      disabled={disabled}
      className="checkbox-field"
    />
  );
}

export function NumberInput({
  value,
  setValue,
  disabled = false,
}: InputBaseProps<number | null>) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => {
        if (isNaN(parseFloat(e.target.value))) {
          setValue(null);
        } else {
          setValue(e.target.value ? parseFloat(e.target.value) : null);
        }
      }}
      disabled={disabled}
      className={`input-field`}
    />
  );
}
