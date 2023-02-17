import { Type } from '@angular/core';

export enum PlaygroundControlType {
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
  type: PlaygroundControlType.Text;
  placeholder?: string;
}

export interface PlaygroundTextAreaControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.TextArea;
  placeholder?: string;
}

export interface PlaygroundNumberControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Number;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface PlaygroundRangeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Range;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface PlaygroundControlOption {
  display: string;
  value: string;
}

export interface PlaygroundMultiSelectControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Select;
  options: PlaygroundControlOption[];
  multiple: true;
  value: any[];
}

export interface PlaygroundSingleSelectControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Select;
  options: PlaygroundControlOption[];
  multiple?: false;
}

export type PlaygroundSelectControlConfig =
  | PlaygroundSingleSelectControlConfig
  | PlaygroundMultiSelectControlConfig;

export interface PlaygroundCheckboxControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Checkbox;
}

export interface PlaygroundRadioGroupControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.RadioGroup;
  options: PlaygroundControlOption[];
}

export interface PlaygroundDateControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Date;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundTimeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.Time;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundDateTimeControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.DateTime;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface PlaygroundColorPickerControlConfig
  extends PlaygroundControlConfigBase {
  type: PlaygroundControlType.ColorPicker;
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

export interface PlaygroundClassBindingControlConfig {
  classes: string[];
  default?: string | string[];
  multiple?: boolean;
}

export interface PlaygroundTextContentControlConfig {
  default: string;
}

export interface NgDocPortalPlaygroundConfig {
  component: Type<any>;
  textContentBinding?:
    | string
    | Node[][]
    | true
    | PlaygroundTextContentControlConfig;
  classBinding?: string | string[] | PlaygroundClassBindingControlConfig;
  inputs?: PlaygroundControlConfig[];
}
