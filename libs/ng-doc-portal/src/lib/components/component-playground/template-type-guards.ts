import {
  PlaygroundColorPickerControlConfig,
  PlaygroundControlConfig,
  PlaygroundControlType,
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
    return config.type === PlaygroundControlType.Text;
  }

  static isTextAreaControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundTextAreaControlConfig {
    return config.type === PlaygroundControlType.TextArea;
  }

  static isNumberControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundNumberControlConfig {
    return config.type === PlaygroundControlType.Number;
  }

  static isRangeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundRangeControlConfig {
    return config.type === PlaygroundControlType.Range;
  }

  static isSelectControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundSelectControlConfig {
    return config.type === PlaygroundControlType.Select;
  }

  static isCheckboxControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundCheckboxControlConfig {
    return config.type === PlaygroundControlType.Checkbox;
  }

  static isRadioGroupControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundRadioGroupControlConfig {
    return config.type === PlaygroundControlType.RadioGroup;
  }

  static isDateControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundDateControlConfig {
    return config.type === PlaygroundControlType.Date;
  }

  static isTimeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundTimeControlConfig {
    return config.type === PlaygroundControlType.Time;
  }

  static isDateTimeControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundDateTimeControlConfig {
    return config.type === PlaygroundControlType.DateTime;
  }

  static isColorPickerControlConfig(
    config: PlaygroundControlConfig
  ): config is PlaygroundColorPickerControlConfig {
    return config.type === PlaygroundControlType.ColorPicker;
  }
}
