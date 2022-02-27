import { Component } from '@angular/core';

@Component({
  template: `
    <h1>Please select a component document page from the side navigation.</h1>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        place-items: center;
      }
    `,
  ],
})
export class HomePageComponent {}
