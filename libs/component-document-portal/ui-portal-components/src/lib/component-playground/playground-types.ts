import { Type } from '@angular/core';

export enum PlaygroundControlConfigType {
  Text = 'text',
  TextArea = 'textarea',
  Number = 'number',
  Range = 'range',
  Select = 'select',
  Checkbox = 'checkbox',
  RadioGroup = 'radio-group',
  Date = 'date',
  Time = 'time',
  DateTime = 'date-time',
  ColorPicker = 'color-picker',
}

interface PlaygroundControlConfigBase {
  label: string;
  property: string;
  value?: any;
}

export interface PlaygroundTextControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Text;
  placeholder?: string;
}

export interface PlaygroundTextAreaControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.TextArea;
  placeholder?: string;
}

export interface PlaygroundNumberControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Number;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface PlaygroundRangeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Range;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface PlaygroundControlOption {
  display: string;
  value: string;
}

export interface PlaygroundSelectControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Select;
  options: PlaygroundControlOption[];
}

export interface PlaygroundCheckboxControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Checkbox;
}

export interface PlaygroundRadioGroupControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.RadioGroup;
  options: PlaygroundControlOption[];
}

export interface PlaygroundDateControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Date;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundTimeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.Time;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundDateTimeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.DateTime;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundColorPickerControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlConfigType.ColorPicker;
}

export type PlaygroundControlConfig =
  | PlaygroundTextControlConfig
  | PlaygroundTextAreaControlConfig
  | PlaygroundNumberControlConfig
  | PlaygroundRangeControlConfig
  | PlaygroundSelectControlConfig
  | PlaygroundCheckboxControlConfig
  | PlaygroundRadioGroupControlConfig
  | PlaygroundDateControlConfig
  | PlaygroundTimeControlConfig
  | PlaygroundDateTimeControlConfig
  | PlaygroundColorPickerControlConfig;

export interface ComponentPlaygroundConfig {
  component: Type<any>;
  inputs: PlaygroundControlConfig[];
}
