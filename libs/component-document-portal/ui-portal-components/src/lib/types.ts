import { Type } from '@angular/core';
import { Control, ControlType } from '@incrudable/forms';

export interface ComponentPlaygroundConfig {
  component: Type<any>;
  inputs: Control[];
}

// Would be nice to construct our own enum using the underlying string values
// This way we could allow only a subset of controls that @incrudable/forms offers
// Without accidentally having the wrong string values for the new enum (or falling behind)
export const PlaygroundControls = ControlType;
