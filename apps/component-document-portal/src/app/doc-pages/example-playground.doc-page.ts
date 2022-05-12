import { Component, Input, NgModule } from '@angular/core';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';
import {
  ComponentPlaygroundConfig,
  DocComponentsModule,
  PlaygroundControls,
} from '@cdp/component-document-portal/ui-portal-components';

@Component({
  template: `
    <h1>The Text: {{ text }}</h1>
    <h2>color: {{ color }}</h2>
  `,
})
export class TestComponent {
  @Input() text = '';
  @Input() color = '';
}

@Component({
  template: `
    <cdp-playground [config]="playgroundComponentConfig"></cdp-playground>
  `,
})
export class ExamplePlaygroundPageComponent {
  playgroundComponentConfig: ComponentPlaygroundConfig = {
    component: TestComponent,
    inputs: [
      {
        label: 'Text Input',
        propertyName: 'text',
        type: PlaygroundControls.input,
      },
      {
        label: 'Select a Color',
        propertyName: 'color',
        type: PlaygroundControls.select,
        // Would be nice if the "typeOption" properties were flat on this control object
        typeOptions: {
          options: [
            {
              label: 'Blue',
              value: 'blue',
              // what is this? why is it needed?
              propertyName: '',
            },
            {
              label: 'Red',
              value: 'red',
              propertyName: '',
            },
            {
              label: 'Green',
              value: 'green',
              propertyName: '',
            },
          ],
          // should probably have this be the default... and thus not need to state it
          optionSource: 'static',
          // why is this needed when it's static?
          optionSourceHook: '',
        },
      },
    ],
  };
}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [ExamplePlaygroundPageComponent],
  imports: [DocComponentsModule],
})
export class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Playground Example',
  docPageComponent: ExamplePlaygroundPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
