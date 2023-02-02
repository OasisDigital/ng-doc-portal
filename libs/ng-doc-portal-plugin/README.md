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

To start serving your new application you can run `nx serve {name-of-application}`.

To build your application you can run `nx build {name-of-application}`.

### Adjusting the Angular Build/Serve Configuration Target

The `serve` and `build` commands are runnning the normal Angular serve/build underneath aliased to `ng-serve` and `ng-build` along with our custom compiler.

If you would like to specify which Angular configuration to use for your build/serve commands please adjust the `ngConfigTarget` property of the `configurations` object in your app's `project.json` build/serve objects.

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
    "apps/component-doc-portal/src/app/doc-pages/*.doc-page.ts",
    "apps/component-doc-portal/src/app/starting-example.doc-page.ts"
  ]
}
```

```json
{
  "globPatterns": [
    {
      "pattern": "apps/component-doc-portal/src/app/doc-pages/*.doc-page.ts"
    },
    {
      "pattern": "apps/component-doc-portal/src/app/starting-example.doc-page.ts"
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
      "pattern": "apps/component-doc-portal/src/app/doc-pages/*.doc-page.ts",
      "titlePrefix": "General"
    },
    {
      "pattern": "apps/component-doc-portal/src/app/starting-example.doc-page.ts",
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
  component: ExamplePageComponent,
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
  component: ExamplePageComponent,
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
    <ngdp-tab-menu>
      <ngdp-tab-item title="Overview">
        <h1>Button Component Document Page</h1>
        <button>Example Button</button>

        <p>The button is used to get actions from the user by click</p>
      </ngdp-tab-item>
      <ngdp-tab-item title="Examples">
        <button>Example Button</button>
        <ngdp-code-reveal lang="html">
          <button>Example Buttons</button>
        </ngdp-code-reveal>
      </ngdp-tab-item>
    </ngdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  component: ButtonDocumentPageComponent,
};

export default docPageConfig;
```

## Styling your Ng Doc Portal Application

Since the `ng-doc-portal` system piggy backs off of an angular application you can simply add your custom styles to the root `styles.scss` file or in the `style` property of the angular app's `project.json` build config.

## Theming

### Setup Theme Selection System

If you want to sync your theming system with your ng doc portal application you can make use of the `ngDocPortalProvideThemeOptions` in the `app.module.ts` of your ng doc portal application. You will need to give this method a list of theme options to display in a dropdown menu in our toolbar. Any theme selections will be stored in localstorage and should rehydrate upon refresh.

Example below:

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgDocPortalModule.forRoot(docPageLoaders)],
  providers: [
    // Add the below method call to your `providers` list
    ngDocPortalProvideThemeOptions([
      { value: 'light-theme', display: 'Light Theme' },
      { value: 'dark-theme', display: 'Dark Theme' },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The `ThemeOption` interface that you provide to the `ngDocPortalProvideThemeOptions` function is below:

```ts
interface ThemeOption {
  display: string;
  value: string;
  default?: boolean;
  hljsTheme?: string;
}
```

The `display` property is used for the text in the select dropdown option that is created.

The `value` is both used for the select dropdown option and is the class that will be applied to the `<html>` element for the application.

The `default` property will set the theme as the default selected theme (if there isn't already one). Otherwise the first theme in the list will be the default.

The `hljsTheme` property allows for custom css sheets to be applied to the HLJS syntax highlighting system for the `code-snippet` component. The value should be an href to a valid css HLJS theme css file. An example would be: `assets/github.css`. We recommend placing the css file in your Doc Portal's assets folder for easy linking. A list of available themes (or examples to make your own) can be found here: https://github.com/highlightjs/highlight.js/tree/main/src/styles

### Syncing Ng Doc Portal Application With Your Theme Styles

The ng doc portal application uses the follow css variables for colors:

```
--ngdp-font-color
--ngdp-background-color
--ngdp-border-color
--ngdp-side-nav-active-color
--ngdp-side-nav-highlight-color
--ngdp-code-background-color
```

Feel free to override these with your own colors based on the selected theme like below:

```scss
html {
  &.dark-theme {
    --ngdp-font-color: white;
    --ngdp-background-color: #363636;
    --ngdp-border-color: white;
    --ngdp-side-nav-active-color: #6e6e6e;
    --ngdp-side-nav-highlight-color: #adadad;
    --ngdp-code-background-color: #4e4e4e;
  }

  &.light-theme {
    --ngdp-font-color: black;
    --ngdp-background-color: white;
    --ngdp-border-color: black;
    --ngdp-side-nav-active-color: #b9b9b9;
    --ngdp-side-nav-highlight-color: #868686;
    --ngdp-code-background-color: #eeeeee;
  }
}
```

### Accessing and Setting Theme Value Manually

The theme system has an exposed `ThemeService` that you can access at any time via Dependency Injection to fetch the current theme value synchronously or asynchronously. You can also update the theme value at any time as well.

The API for the `ThemeService` is below:

```ts
theme: Observable<string>;

themeOptions: ThemeOption[] | undefined;

getTheme(): string | undefined;

setTheme(newTheme: string): void;
```

## Custom Title

By default we setup a Title for the UI in the top left corner. This will have the default text of 'Doc Portal'.

If you want to set a custom title you may do so by providing the `ngDocPortalProvideTitle` function in the root module of the doc portal application.

This function takes in either a plain string value or a custom Component class. If you provide a custom component class you will need to make sure the content fits inside a height of 48px.

Example of custom plain string title:

```ts
providers: [
  // Add the below method call to your `providers` list
  ngDocPortalProvideTitle('My Custom Title'),
];
```

Example of custom component title:

```ts
providers: [
  // Add the below method call to your `providers` list
  ngDocpPortalProvideTitle(MyCustomTitleComponent),
];
```

## Custom Toolbar Plugins

This system allows you to insert your own custom components into the doc portal's main toolbar/action bar. If you make use of the doc portal theming plugin this is the same toolbar it shows up in.

In order to provide your components you can setup the below code in your `app.modules.ts` providers:

```ts
providers: [
  // Add the below method call to your `providers` list
  ngDocPortalProvideToolbarPlugins([MyCustomPluginComponent]),
];
```

The `ngDocPortalProvideToolbarPlugins` takes in an array of components as it's argument. These components will need to fit in a default height of 40-48px (depending on if there is horizontal overflow or not). The width of the component is not limited.

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

The tab menu component system allows you to easily have tab-based navigation in your doc page. You will need to have a top level `ngdp-tab-menu` and subsequent `ngdp-tab-item` elements in your doc page template.

The navigation will use `query-params` for the `title` properties you have set on your `ngdp-tab-item` component instances.

Example below:

```html
<ngdp-tab-menu>
  <ngdp-tab-item title="Overview">
    <h1>Button Component Document Page</h1>

    <p>The button is used to get actions from the user by click</p>
  </ngdp-tab-item>
  <ngdp-tab-item title="Examples">
    <button>Example Button</button>
  </ngdp-tab-item>
</ngdp-tab-menu>
```

A potential url for the above template could look like:
`/general-button?tab=overview`

### Code Snippet

The `<ngdp-code-snippet>` component allows you to display syntax highlighted code with an option to easily get the displayed code onto your clipboard.

There are three different approaches to displaying your code with syntax highlighting.

1. `<ngdp-code-snippet>` with `<textarea></textarea>` inside it housing your code

```html
<ngdp-code-snippet>
  <textarea>
    <!-- Your Code To Display Here -->
  </textarea>
</ngdp-code-snippet>
```

2. `<ngdp-code-snippet>` with `code` input binding assigned to string housing your code

```html
<ngdp-code-snippet [code]="yourCodeStringVariable"></ngdp-code-snippet>
```

3. `ngdpCodeSnippet` directive on a `<textarea></textarea>` element housing your code

```html
<textarea ngdpCodeSnippet>
  <!-- Your Code To Display Here -->
</textarea>
```

#### Setting the Code Language

By default the code "language" is set to HTML/Angular template. If you want to override this provide a value for the `lang` input attribute. The options we support are currently: `'html' | 'typescript' | 'css' | 'scss'`. `'html'` is treated the same as an angular template would be.

```html
<ngdp-code-snippet lang="typescript">
  <textarea>
    function myFunction() {
      console.log('Hello World!');
    }
  </textarea>
</ngdp-code-snippet>
```

#### Angular Template Bindings Helper

If you are displaying Angular template code with any bindings (inputs, outputs, interpolation) then you will want to add the `ngNonBindable` attribute to your `<ngdp-code-snippet>` element or your `<textarea>` with the `ngdpCodeSnippet` directive on it.

### Iframe Embed

The `<ngdp-embed-iframe>` component allows you to embed sites into your doc page. You will simply need to set the `src` property.

Example below:

```html
<ngdp-embed-iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
></ngdp-embed-iframe>
```

### Markdown

The `<ngdp-markdown>` component lets you to render some markdown code inside your doc page. This can either be done with static markdown text or a file located in your assets or hosted elsewhere.

Examples below:

#### Hosted/Asset Markdown File

```html
<ngdp-markdown filePath="/assets/example-markdown.md"></ngdp-markdown>
```

#### Static Markdown Text

```ts
const exampleMarkdown = `
# Markdown from a string

Hello World!
`;
```

```html
<ngdp-markdown [markdown]="markdownString"></ngdp-markdown>
```

#### Markdown Directive

```html
<pre ngdpMarkdown>
  # Header
  
  Hello World!
</pre>
```

> It should be noted that most markdown syntaxes should work within the html `<pre>` element. The only notable one that doesn't is the double space "line break" syntax. Please use a `\` at the end of a paragraph line to denote a "line break".

> It also generally helps to use a separate `html` file for your doc-page component's template when making use of the `ngdpMarkdown` directive. This is due to the angular language service having issues with syntax highlighting some parts of markdown code inside the inline template of your component's Typescript file. This is especially the case when using the "backtick" character for code blocks/in-line snippets.

### Component Playground

The `<ngdp-playground>` component allows you to place your component in a playground form system. Here you can configure form fields that automatically hook into a component's input properties.

You will need to set the `config` property to a valid `NgDocPortalPlaygroundConfig` object variable on the doc page class.

```ts
export class ExamplePlaygroundPageComponent {
  playgroundComponentConfig: NgDocPortalPlaygroundConfig = {
    ...
  }
}
```

```html
<ngdp-playground [config]="playgroundComponentConfig"></ngdp-playground>
```

The config object requires a `component` property to know which component to work with in the playground.

### Input/Property Binding

By configuring the `inputs` property of your playground config object you can have form fields that hook into your component's input(s) or other class properties.

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
<ngdp-playground [config]="playgroundConfig"></ngdp-playground>
```

```ts
export class ExamplePlaygroundPageComponent {
  playgroundConfig: NgDocPortalPlaygroundConfig = {
    component: TestComponent,
    inputs: [
      {
        label: 'Text Input',
        property: 'text',
        type: PlaygroundControlType.Text,
        value: 'blah',
      },
      {
        label: 'Select a Pet',
        property: 'pet',
        type: PlaygroundControlType.Select,
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
        type: PlaygroundControlType.ColorPicker,
        value: '#363636',
      },
    ],
  };
}
```

### Text Content Binding

If you add the `textContentBinding` property to your playground config object you can allow for projecting strings or other native html elements into your component's `ng-content`.

#### Static Text

```ts
{
  ...
  textContentBinding: 'My Text Content!'
}
```

#### Dynamic Text Form Field

No default value:

```ts
{
  ...
  textContentBinding: true
}
```

Has default value:

```ts
{
  ...
  textContentBinding: { default: 'Hello World!' }
}
```

#### HTML Node Binding

```ts
const node = document.createElement('div');

{
  ...
  textContentBinding: [[node]]
}
```

### Class Binding

If you add the `classBinding` property to your playground config object you can have static or dynamic classes added to your component element.

#### Static Class

You can either provide a string (with space separated classes) or an array of string classes.

Examples below:

```ts
{
  ...
  classBinding: 'my-class'
}
```

```ts
{
  ...
  classBinding: 'foo bar'
}
```

```ts
{
  ...
  classBinding: ['foo', 'bar']
}
```

### Dynamic Class Field

You will have to provide the class list for the select field. You can optionally set a default value with a `string` or `string[]` and/or allow for multiple class selections with the `multiple` property.

Examples below:

```ts
{
  ...
  classBinding: {
    classes: ['foo', 'bar']
  }
}
```

```ts
{
  ...
  classBinding: {
    classes: ['foo', 'bar'],
    default: 'bar'
  }
}
```

```ts
{
  ...
  classBinding: {
    classes: ['foo', 'bar'],
    multiselect: true
  }
}
```
