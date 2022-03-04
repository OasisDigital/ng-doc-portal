# Component Document Portal

Component document portal proof of concept written in Angular 13 with nx workspace wrapper.

## Document Page Files

A sample `.doc-page.ts` file is displayed below.

```ts
import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@doc-page-config/types';

@Component({
  template: `
    <h1>Button Component Document Page</h1>
    <button>Example Button</button>
  `,
})
export class ButtonDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
})
class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'Group/Button',
  docPage: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
```

## Possible Improvements to the Document Page Files

- Once Angular supports Optional Modules, the `ngModule` export could be removed from the config; letting the component itself handle the typical module declarations, imports, and providers.

## Document Page Config Compiler

The compiler can be run with `node doc-page-configs-compiler.js` or `npm run gen:doc-page-configs`.

There are optional `watch` and `silent` modes provided as environment or command line arguments.

`node doc-page-configs-compiler.js --watch` will run the compiler in "watch" mode. This can also be run with `npm run gen:doc-page-configs:watch`.

`node doc-page-configs-compiler.js --silent` will disable all logging to the console. This can also be run with `npm run gen:doc-page-configs:silent`.

## Running the Component Document Portal Application

You can either run `npm run gen:doc-page-configs:watch` and `npm run serve:cdp` in different terminals or run `npm run start:cdp`. The `npm run start:cdp` command will run the Document Page Config Compiler in silent mode to not conflict with the angular compiler logging.

Any changes to the `.doc-page.ts` files will result in two compilation loops of the Angular application.

## Possible Improvements to the Compiler

This was made in a span of mostly 1 day. There could be better processes for consuming the `.doc-page.ts` files. I attempted to write the compiler in TS, but the way I was compiling my TS it was complaining about es module imports in the `.doc-page.ts` files with the Angular imports when doing a dynamic `import()` of the file from the globbing.

Because of this I just opted to write the compiler in straight nodeJS and do a work around for the above. The compiler just reads the raw TS code from the file and transpiles it to a raw JS string. This raw JS string is then saved to a temporary `.mjs` file, dynamically imported into the compiler runtime, and then the `.mjs` file is deleted.

## Generating Document Pages for Performance Testing

To generate large numbers of Document Pages you can do `npm run gen:perf-testing`. If you want to modify the amount of files generate (default 100) you can do `npm run gen:perf-testing -- --amount {amount here}`.

Example of generating 1000 files:
`npm run gen:perf-testing -- --amount 1000`

Which took ~6000ms (rounded up to near 1000ms) to initially generate the config list file on a solid grade desktop machine. The watch recompilations average anywhere from 10-50ms (after the 500ms debounce of potential multiple file changes).
