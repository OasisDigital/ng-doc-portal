import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cdpTabItem]',
})
export class TabItemDirective {
  private _title = '';

  @Input() set cdpTabItem(title: string) {
    this._title = title;
  }
  get title(): string {
    return this._title;
  }

  constructor(public templateRef: TemplateRef<any>) {}
}
