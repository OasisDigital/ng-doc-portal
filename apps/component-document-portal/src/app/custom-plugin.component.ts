import { Component } from '@angular/core';
import { ThemeService } from '@oasisdigital/ng-doc-portal';

@Component({
  template: `<button type="submit" (click)="log()">Click Me!</button>`,
})
export class CustomPluginComponent {
  constructor(private themeService: ThemeService) {}

  log() {
    this.themeService.setTheme(
      this.themeService.themeOptions?.[0].value ?? 'light-theme'
    );
    console.log('hello world!');
  }
}
