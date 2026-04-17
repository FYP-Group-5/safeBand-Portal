/**
 * TypeScript 5.9 + @types/react 19 compatibility fix.
 *
 * @types/react/global.d.ts re-declares several DOM interfaces as empty stubs
 * (e.g. `interface HTMLInputElement extends HTMLElement {}`) for projects that
 * don't include the DOM lib.  In TypeScript 5.9 the stricter interface-merging
 * rules cause the merged HTMLInputElement (and siblings) to lose properties
 * like `value` that are defined in lib.dom.d.ts.
 *
 * This file re-augments the affected interfaces so that `e.target.value` and
 * similar accesses compile correctly when both `lib: ["dom"]` and
 * `@types/react` are present.
 */

interface HTMLInputElement {
  value: string;
  valueAsDate: Date | null;
  valueAsNumber: number;
  checked: boolean;
  files: FileList | null;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  min: string;
  max: string;
  step: string;
  maxLength: number;
  minLength: number;
  pattern: string;
  multiple: boolean;
  accept: string;
  defaultValue: string;
  defaultChecked: boolean;
  indeterminate: boolean;
  autofocus: boolean;
}

interface HTMLSelectElement {
  value: string;
  selectedIndex: number;
  options: HTMLOptionsCollection;
  multiple: boolean;
  name: string;
  id: string;
  disabled: boolean;
  required: boolean;
  size: number;
  length: number;
}

interface HTMLTextAreaElement {
  value: string;
  defaultValue: string;
  name: string;
  id: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  placeholder: string;
  rows: number;
  cols: number;
  maxLength: number;
  minLength: number;
}
