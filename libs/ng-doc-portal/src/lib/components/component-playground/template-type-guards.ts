import {
  PlaygroundColorPickerControlConfig,
  PlaygroundControlConfig,
  PlaygroundControlConfigType,
  PlaygroundDateControlConfig,
  PlaygroundDateTimeControlConfig,
  PlaygroundNumberControlConfig,
  PlaygroundRadioGroupControlConfig,
  PlaygroundRangeControlConfig,
  PlaygroundCheckboxControlConfig,
  PlaygroundSelectControlConfig,
  PlaygroundTextAreaControlConfig,
  PlaygroundTextControlConfig,
  PlaygroundTimeControlConfig,
} from './playground-types';

export class PlaygroundControlTemplateTypeGuards {
  static isTextControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundTextControlConfig {
    return config.type === PlaygroundControlConfigType.Text;
  }

  static isTextAreaControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundTextAreaControlConfig {
    return config.type === PlaygroundControlConfigType.TextArea;
  }

  static isNumberControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundNumberControlConfig {
    return config.type === PlaygroundControlConfigType.Number;
  }

  static isRangeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundRangeControlConfig {
    return config.type === PlaygroundControlConfigType.Range;
  }

  static isSelectControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundSelectControlConfig {
    return config.type === PlaygroundControlConfigType.Select;
  }

  static isCheckboxControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundCheckboxControlConfig {
    return config.type === PlaygroundControlConfigType.Checkbox;
  }

  static isRadioGroupControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundRadioGroupControlConfig {
    return config.type === PlaygroundControlConfigType.RadioGroup;
  }

  static isDateControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundDateControlConfig {
    return config.type === PlaygroundControlConfigType.Date;
  }

  static isTimeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundTimeControlConfig {
    return config.type === PlaygroundControlConfigType.Time;
  }

  static isDateTimeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundDateTimeControlConfig {
    return config.type === PlaygroundControlConfigType.DateTime;
  }

  static isColorPickerControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundColorPickerControlConfig {
    return config.type === PlaygroundControlConfigType.ColorPicker;
  }
}
