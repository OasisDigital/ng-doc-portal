# NgDocPortalPlugin

The `@oasisdigital/ng-doc-portal-plugin` package allows you to create your own component documentation portal natively in Angular. This system makes use of the latest features of Angular (stand-alone components and lazy loading components) to provide an ergonomic development experience for documenting your angular components. Everything is built natively in angular so there are no hoops to jump through or different libraries/frameworks/syntaxes to learn!

> This package is meant to be used in tangent with the `@oasisdigital/ng-doc-portal` package inside of an Nx Workspace.

## Installation

### npm

`npm install --save @oasisdigital/ng-doc-portal`

`npm install --save-dev @oasisdigital/ng-doc-portal-plugin`

### yarn

`yarn add @oasisdigital/ng-doc-portal`

`yarn add --dev @oasisdigital/ng-doc-portal-plugin`

## Generating a New `ng-doc-portal` Application

Run `nx generate @oasisdigital/ng-doc-portal-plugin:app`

You will need to provide a name for your new `ng-doc-portal` application via command line or the prompt.

By default the newly generated application will come with one example doc page named `starting-example.doc-page.ts`. The `.doc-page.ts` extension is the default file type that the `ng-doc-portal` compiler will look for (this can be modified).

## Serve/Build `ng-doc-portal` Application

To start serving your new application you can run `nx cdp-serve {name-of-application}`.

To build your application you can run `nx cdp-build {name-of-application}`.

> This is using the normal angular serve/build underneath, but the `cdp-*` commands also do some pre-processing beforehand for your document page files.

## Configuring Your `ng-doc-portal` Application

By default there will be a `ng-doc-portal-config.json` at the root of the your generated `ng-doc-portal` application. This file allows you to set all the top-level configuration in one spot.

### Page Globbing

In the `ng-doc-portal-config.json` file you can set either the `globPattern` or `globPatterns` property.
Both properties take either a string pattern or a `GlobPattern` object. In the case of `globPatterns` you can add an array of string or `GlobPattern` object.

By default we set the `globPattern` property to look anywhere in your Nx Workspace for the `.doc-page.ts` files with the below example:

```json
{
  "globPattern": "**/*.doc-page.ts"
}
```

More examples below:

```json
{
  "globPatterns": [
    "apps/component-document-portal/src/app/doc-pages/*.doc-page.ts",
    "apps/component-document-portal/src/app/starting-example.doc-page.ts"
  ]
}
```

```json
{
  "globPatterns": [
    {
      "pattern": "apps/component-document-portal/src/app/doc-pages/*.doc-page.ts"
    },
    {
      "pattern": "apps/component-document-portal/src/app/starting-example.doc-page.ts"
    }
  ]
}
```

### Adding Prefixed Groups to Globs

You can add a prefixed group to any glob pattern object by adding the `titlePrefix` property. This will automatically prefix the globbed pages with the group in the side navigation system.

> This will not overwrite any groups you explicitly defined in the page's title property. It will only prefix the title.

```json
{
  "globPatterns": [
    {
      "pattern": "apps/component-document-portal/src/app/doc-pages/*.doc-page.ts",
      "titlePrefix": "General"
    },
    {
      "pattern": "apps/component-document-portal/src/app/starting-example.doc-page.ts",
      "titlePrefix": "Example"
    }
  ]
}
```

## Adding Your Own Doc Page

In principle you can add your own doc pages anywhere inside the Nx Workspace. Although you will possibly need to update your globbing configuration.

To create a new doc page you can either make use of this plugins generator with the following command
`nx g @oasisdigital/ng-doc-portal-plugin:doc-page` or manually create your own angular component file with the correct file extension.

## Configuring Your Doc Page

By default this package makes use of Angular's standalone component system. When you create your own doc page component make sure to set the `standalone` property to `true` in your `Component` decorator.

Example:

```ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h1>Example Doc Page</h1>`,
})
export default class ExamplePageComponent {}
```

The title of the doc page will also be auto-generated based on the glob prefix and the name of the file by default. This will be used for the side nav and the navigation url.

### Adding Custom Title

In order to add a custom title to a doc page. You will need to export a config object instead of exporting your component by `default`.

Example below:

```ts
import { Component } from '@angular/core';
import { DocPageConfig } from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  template: `<h1>Example Doc Page</h1>`,
})
export class ExamplePageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'My Custom Example Page Title',
  docPageComponent: ExamplePageComponent,
};

export default docPageConfig;
```

#### Adding Grouping to Titles

In order to add grouping to a doc page's title you can simply add one or more `/` characters in the title.

Example below:

```ts
import { Component } from '@angular/core';
import { DocPageConfig } from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  template: `<h1>Example Doc Page</h1>`,
})
export class ExamplePageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'My Custom Group/My Custom Example Page Title',
  docPageComponent: ExamplePageComponent,
};

export default docPageConfig;
```

### Adding `ng-doc-portal` or Other Custom Components

In order to add any component systems to your doc page you will need to add an `imports` property to your `Component` decorator.

You can also access this package's component system from the following import:
`import { NgDocPortalComponentsModule } from '@oasisdigital/ng-doc-portal';`

Full Example Below:

```ts
import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule, // <---- Added import for the ng-doc-portal components module
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule], // <---- Added imports property here
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Button Component Document Page</h1>
        <button>Example Button</button>

        <p>The button is used to get actions from the user by click</p>
      </cdp-tab-item>
      <cdp-tab-item title="Examples">
        <button>Example Button</button>
        <cdp-code-reveal lang="html">
          <button>Example Buttons</button>
        </cdp-code-reveal>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
};

export default docPageConfig;
```

## Styling your Ng Doc Portal Application

Since the `ng-doc-portal` system piggy backs off of an angular application you can simply add your custom styles to the root `styles.scss` file or in the `style` property of the angular app's `project.json` build config.

## Theming

### Setup Theme Selection System

If you want to sync your theming system with your ng doc portal application you can make use of the `cdpProvideThemeOptions` in the `app.module.ts` of your ng doc portal application. You will need to give this method a list of theme options to display in a dropdown menu in our toolbar. Any theme selections will be stored in localstorage and should rehydrate upon refresh.

Example below:

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgDocPortalModule.forRoot(docPageConfigs, compilerMode),
  ],
  providers: [
    // Add the below method call to your `providers` list
    cdpProvideThemeOptions([
      { value: 'light-theme', display: 'Light Theme' },
      { value: 'dark-theme', display: 'Dark Theme' },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The `ThemeOption` interface that you provide to the `cdpProvideThemeOptions` function is below:

```ts
interface ThemeOption {
  display: string;
  value: string;
  default?: boolean;
}
```

The `default` property will set the theme as the default selected theme (if there isn't already one). Otherwise the first theme in the list will be the default.

### Syncing Ng Doc Portal Application With Your Theme Styles

The ng doc portal application uses the follow css variables for colors:

```
--cdp-font-color
--cdp-background-color
--cdp-border-color
--cdp-nav-active-color
--cdp-nav-highlight-color
```

Feel free to override these with your own colors based on the selected theme like below:

```scss
html {
  &.dark-theme {
    --cdp-font-color: white;
    --cdp-background-color: #363636;
    --cdp-border-color: white;
    --cdp-nav-active-color: #6e6e6e;
    --cdp-nav-highlight-color: #adadad;
  }

  &.light-theme {
    --cdp-font-color: black;
    --cdp-background-color: white;
    --cdp-border-color: black;
    --cdp-nav-active-color: #b9b9b9;
    --cdp-nav-highlight-color: #868686;
  }
}
```

## Custom Title

By default we setup a Title for the UI in the top left corner. This will have the default text of 'Doc Portal'.

If you want to set a custom title you may do so by providing the `cdpProvideTitle` function in the root module of the doc portal application.

This function takes in either a plain string value or a custom Component class. If you provide a custom component class you will need to make sure the content fits inside a height of 48px.

Example of custom plain string title:

```ts
providers: [
  // Add the below method call to your `providers` list
  cdpProvideTitle('My Custom Title'),
];
```

Example of custom component title:

```ts
providers: [
  // Add the below method call to your `providers` list
  cdpProvideTitle(MyCustomTitleComponent),
];
```

## Custom Toolbar Plugins

This system allows you to insert your own custom components into the doc portal's main toolbar/action bar. If you make use of the doc portal theming plugin this is the same toolbar it shows up in.

In order to provide your components you can setup the below code in your `app.modules.ts` providers:

```ts
providers: [
  // Add the below method call to your `providers` list
  cdpProvideToolbarPlugins([MyCustomPluginComponent]),
];
```

The `cdpProvideToolbarPlugins` takes in an array of components as it's argument. These components will need to fit in a default height of 40-48px (depending on if there is horizontal overflow or not). The width of the component is not limited.

## Ng Doc Portal's Component Library

The `ng-doc-portal` package ships with a small component-library that will help you document your component and display this information.

You can add this component module to your doc page via the `imports` property in your stand-alone `Component` decorator.

Example below:

```ts
import { Component } from '@angular/core';
import { NgDocPortalComponentsModule } from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `

  `
})
```

### Tab Menu

The tab menu component system allows you to easily have tab-based navigation in your doc page. You will need to have a top level `cdp-tab-menu` and subsequent `cdp-tab-item` elements in your doc page template.

The navigation will use `query-params` for the `title` properties you have set on your `cdp-tab-item` component instances.

Example below:

```html
<cdp-tab-menu>
  <cdp-tab-item title="Overview">
    <h1>Button Component Document Page</h1>

    <p>The button is used to get actions from the user by click</p>
  </cdp-tab-item>
  <cdp-tab-item title="Examples">
    <button>Example Button</button>
  </cdp-tab-item>
</cdp-tab-menu>
```

A potential url for the above template could look like:
`/general-button?tab=overview`

### Code Reveal

The `<cdp-code-reveal>` component allows you to have syntax highlighting on a code snippet and allows for copying the code snippet to your clipboard. You will need to specify the language the code uses in the `lang` property.

Example below:

```html
<cdp-code-reveal lang="html">
  <button>Example Buttons</button>
</cdp-code-reveal>
```

As an additional note the `<cdp-code-reveal>` component also will parse the code snippet for proper syntax. If the code is incorrect you will see a "build" error where the code snippet would normally be.

### Iframe Embed

The `<cdp-embed-iframe>` component allows you to embed sites into your doc page. You will simply need to set the `src` property.

Example below:

```html
<cdp-embed-iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
></cdp-embed-iframe>
```

### Markdown

The `<cdp-markdown>` component lets you to render some markdown code inside your doc page. This can either be done with static markdown text or a file located in your assets or hosted elsewhere.

Examples below:

#### Hosted/Asset Markdown File

```html
<cdp-markdown filePath="/assets/example-markdown.md"></cdp-markdown>
```

#### Static Markdown Text

```ts
const exampleMarkdown = `
# Markdown from a string

Hello World!
`;
```

```html
<cdp-markdown [markdown]="markdownString"></cdp-markdown>
```

### Component Playground

The `<cdp-playground>` component allows you to place your component in a playground form system. Here you can configure form fields that automatically hook into a component's input properties.

You will need to set the `config` property to a valid `ComponentPlaygroundConfig` object variable on the doc page class.

```ts
export class ExamplePlaygroundPageComponent {
  playgroundComponentConfig: ComponentPlaygroundConfig = {
    ...
  }
}
```

```html
<cdp-playground [config]="playgroundComponentConfig"></cdp-playground>
```

The config object requires a `component` property to know which component to work with in the playground. After this is set you will need to configure the `inputs` array property to create form fields that hook into your component's input(s).

There is currently support for the following form controls:

- TextControl
- TextAreaControl
- NumberControl
- RangeControl
- SelectControl
- CheckboxControl
- RadioGroupControl
- DateControl
- TimeControl
- DateTimeControl
- ColorPickerControl

Full Example Below:

```html
<cdp-playground [config]="playgroundComponentConfig"></cdp-playground>
```

```ts
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
```
