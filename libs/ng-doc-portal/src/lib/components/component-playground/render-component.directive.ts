import {
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';

export interface RenderComponentConfig {
  component: Type<any>;
  projectableNodes?: Node[][];
}

@Directive({
  selector: '[cdpRenderComponent]',
})
export class RenderComponentDirective {
  @Input() set cdpRenderComponent(config: RenderComponentConfig) {
    this.vcr.clear();
    this.componentRefCreated.emit(
      this.vcr.createComponent(config.component, {
        projectableNodes: config.projectableNodes,
      })
    );
  }

  @Output() componentRefCreated = new EventEmitter<ComponentRef<any>>();

  constructor(private vcr: ViewContainerRef) {}
}
