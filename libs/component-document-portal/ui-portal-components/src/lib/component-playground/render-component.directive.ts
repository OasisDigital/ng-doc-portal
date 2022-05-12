import {
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[cdpRenderComponent]',
})
export class RenderComponentDirective {
  @Input() set cdpRenderComponent(component: Type<any>) {
    this.vcr.clear();
    this.componentRefCreated.emit(this.vcr.createComponent(component));
  }

  @Output() componentRefCreated = new EventEmitter<ComponentRef<any>>();

  constructor(private vcr: ViewContainerRef) {}
}
