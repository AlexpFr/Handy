import React, { useState } from "react";
import { Input } from "../../ui/Input";

interface MaxTokensFieldProps {
  value: number | undefined;
  onCommit: (value: number) => void;
  disabled: boolean;
  className?: string;
}

// The setting is a u32 in Rust: a larger number can't be stored.
const MAX_STORABLE = 4294967295;

export const MaxTokensField: React.FC<MaxTokensFieldProps> = React.memo(
  ({ value, onCommit, disabled, className = "" }) => {
    const stored = value === undefined ? "" : String(value);
    const [localValue, setLocalValue] = useState(stored);

    // Sync with prop changes
    React.useEffect(() => {
      setLocalValue(stored);
    }, [stored]);

    // Anything the setting can't store, such as an empty field or a fraction,
    // goes back to the stored value. The model's own limit isn't checked.
    const commit = () => {
      const parsed = Number(localValue);
      const storable =
        localValue.trim() !== "" &&
        Number.isInteger(parsed) &&
        parsed >= 1 &&
        parsed <= MAX_STORABLE;

      if (storable && parsed !== value) {
        onCommit(parsed);
      } else {
        setLocalValue(stored);
      }
    };

    return (
      <Input
        type="number"
        min={1}
        step={1}
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        variant="compact"
        disabled={disabled}
        className={`w-28 ${className}`}
      />
    );
  },
);

MaxTokensField.displayName = "MaxTokensField";
