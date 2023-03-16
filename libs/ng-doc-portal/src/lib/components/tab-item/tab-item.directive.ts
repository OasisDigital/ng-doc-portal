import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngdpTabItem]',
  standalone: true,
})
export class TabItemDirective {
  private _title = '';

  @Input() set ngdpTabItem(title: string) {
    this._title = title;
  }
  get title(): string {
    return this._title;
  }

  constructor(public templateRef: TemplateRef<any>) {}
}
