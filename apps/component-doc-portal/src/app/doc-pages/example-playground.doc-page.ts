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
    <ngdp-tab-menu>
      <ngdp-tab-item title="Overview">
        <h1>Playground Test Component</h1>
        <ngdp-code-snippet lang="typescript">
          <textarea>
            function() {
              asd;
            }
          </textarea
          >
        </ngdp-code-snippet>
        <ngdp-code-snippet ngNonBindable>
          <textarea>
            <ngdp-tab-item (click) = "doSomething()" *ngFor="let a of b">
              {{ asdasd }}
            </ngdp-tab-item>
          </textarea
          >
        </ngdp-code-snippet>
        <ngdp-code-snippet [code]="snippet"></ngdp-code-snippet>
      </ngdp-tab-item>
      <ngdp-tab-item title="Playground">
        <ngdp-playground [config]="playgroundComponentConfig"></ngdp-playground>
      </ngdp-tab-item>
    </ngdp-tab-menu>
  `,
})
export class ExamplePlaygroundPageComponent {
  snippet = `
    <ngdp-tab-item (click) = "doSomething()" *ngFor="let a of b">
      {{ asdasd }}
    </ngdp-tab-item>
  `;
  playgroundComponentConfig: ComponentPlaygroundConfig = {
    component: TestComponent,
    classBinding: {
      classes: ['foo', 'bar', 'baz', 'test', 'test2', 'test3'],
      multiple: true,
    },
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
        multiple: true,
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
