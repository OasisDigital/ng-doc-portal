import { Component } from '@angular/core';

@Component({
  template: `<button type="submit" (click)="log()">Click Me!</button>`,
})
export class CustomPluginComponent {
  log() {
    console.log('hello world!');
  }
}
