import { type SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: SelectOption[];
}