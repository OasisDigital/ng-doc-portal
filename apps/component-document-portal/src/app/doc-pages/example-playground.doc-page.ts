import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
  PlaygroundControlConfigType,
  ComponentPlaygroundConfig,
} from '@oasisdigital/ng-doc-portal';

import { TestComponent } from './test.component';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Playground Test Component</h1>
        <cdp-code-snippet lang="typescript">
          <textarea>
            function() {
              asd;
            }
          </textarea
          >
        </cdp-code-snippet>
        <cdp-code-snippet ngNonBindable>
          <textarea>
            <cdp-tab-item (click) = "doSomething()" *ngFor="let a of b">
              {{ asdasd }}
            </cdp-tab-item>
          </textarea
          >
        </cdp-code-snippet>
        <cdp-code-snippet [code]="snippet"></cdp-code-snippet>
      </cdp-tab-item>
      <cdp-tab-item title="Playground">
        <cdp-playground [config]="playgroundComponentConfig"></cdp-playground>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ExamplePlaygroundPageComponent {
  snippet = `
    <cdp-tab-item (click) = "doSomething()" *ngFor="let a of b">
      {{ asdasd }}
    </cdp-tab-item>
  `;
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

const docPageConfig: DocPageConfig = {
  title: 'General/Playground Example',
  docPageComponent: ExamplePlaygroundPageComponent,
};

export default docPageConfig;
