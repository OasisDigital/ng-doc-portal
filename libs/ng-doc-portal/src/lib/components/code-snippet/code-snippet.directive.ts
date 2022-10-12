import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';

import { CodeSnippetComponent } from './code-snippet.component';

@Directive({
  selector: '[cdpCodeSnippet]',
})
export class CodeSnippetDirective {
  @Input() lang: 'html' | 'typescript' = 'html';

  constructor(
    private element: ElementRef<HTMLTextAreaElement>,
    private vcr: ViewContainerRef
  ) {
    if (this.element.nativeElement.tagName !== 'TEXTAREA') {
      throw new Error(
        'The `[cdpCodeSnippet] directive can only be used on the <textarea> element`'
      );
    } else {
      // have to use a timeout here in case this directive is on a content projected element
      setTimeout(() => {
        const code = this.element.nativeElement.value;
        this.element.nativeElement.hidden = true;
        const codeSnippet = this.vcr.createComponent(CodeSnippetComponent);
        codeSnippet.instance.setCodeFromDirective(code, this.lang);
      }, 0);
    }
  }
}
