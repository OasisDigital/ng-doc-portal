import { Component, Input, NgModule } from '@angular/core';

import {
  ComponentPlaygroundConfig,
  DocComponentsModule,
  PlaygroundControlConfigType,
} from '@cdp/component-document-portal/ui-portal-components';
import { DocPageConfig } from '@cdp/component-document-portal/util-types';

@Component({
  template: `
    <p>The Text: {{ text }}</p>
    <p>pet: {{ pet }}</p>
    <p>
      color:
      <span class="color-block" [style.background]="color"></span>
    </p>
  `,
  styles: [
    `
      :host {
        padding: 5px 20px;
        display: block;
        background-color: rgb(32, 122, 195);
        font-size: 24px;
        color: white;

        .color-block {
          display: inline-block;
          padding: 5px;
          height: 15px;
          width: 15px;
        }
      }
    `,
  ],
})
export class TestComponent {
  @Input() text?: string;
  @Input() pet?: string;
  @Input() color?: string;
}

@Component({
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Playground Test Component</h1>
        <p></p>
      </cdp-tab-item>
      <cdp-tab-item title="Playground">
        <cdp-playground [config]="playgroundComponentConfig"></cdp-playground>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ExamplePlaygroundPageComponent {
  playgroundComponentConfig: ComponentPlaygroundConfig = {
    component: TestComponent,
    inputs: [
      {
        label: 'Text Input',
        property: 'text',
        type: PlaygroundControlConfigType.Text,
        value: 'blah',
      },
      {
        label: 'Select a Pet',
        property: 'pet',
        type: PlaygroundControlConfigType.Select,
        value: 'dog',
        options: [
          {
            display: 'Dog',
            value: 'dog',
          },
          {
            display: 'Cat',
            value: 'cat',
          },
          {
            display: 'Hamster',
            value: 'hamster',
          },
        ],
      },
      {
        label: 'Color',
        property: 'color',
        type: PlaygroundControlConfigType.ColorPicker,
        value: '#363636',
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
