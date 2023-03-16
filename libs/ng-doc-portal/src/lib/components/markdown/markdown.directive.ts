import { Directive, ElementRef, ViewContainerRef } from '@angular/core';

import { MarkdownComponent } from './markdown.component';

@Directive({
  selector: '[ngdpMarkdown]',
  standalone: true,
})
export class MarkdownDirective {
  constructor(
    private element: ElementRef<HTMLElement>,
    private vcr: ViewContainerRef
  ) {
    if (this.element.nativeElement.tagName !== 'PRE') {
      throw new Error(
        'The `[ngdpMarkdown]` directive should only be used on a <pre> element due to auto formatting concerns'
      );
    } else {
      // have to use a timeout here in case this directive is on a content projected element
      setTimeout(() => {
        const text = this.element.nativeElement.innerText;
        this.element.nativeElement.hidden = true;
        const trimmedText = text
          .trim()
          .split('\n')
          .map((line) => line.trim())
          .join('\n');

        const markdownComponent = this.vcr.createComponent(MarkdownComponent);
        markdownComponent.instance.markdown = trimmedText;
      }, 0);
    }
  }
}
