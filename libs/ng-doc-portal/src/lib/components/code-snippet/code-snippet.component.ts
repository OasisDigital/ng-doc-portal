import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import parserAngular from 'prettier/parser-angular';
import parserHTML from 'prettier/parser-html';
import parserPostCss from 'prettier/parser-postcss';
import parserTS from 'prettier/parser-typescript';
import prettier from 'prettier/standalone';
import {
  catchError,
  delay,
  from,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'ngdp-code-snippet',
  standalone: true,
  templateUrl: './code-snippet.component.html',
  imports: [NgIf, AsyncPipe, HighlightModule],
})
export class CodeSnippetComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('content', { read: ElementRef })
  content?: ElementRef<HTMLDivElement>;
  @Input() code = '';
  @Input() parser: 'html' | 'typescript' | 'css' | 'scss' = 'html';
  displayError = '';
  displayCode = '';
  buttonText: Observable<string>;
  copyTrigger = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {
    this.buttonText = this.copyTrigger.pipe(
      switchMap(() =>
        from(navigator.clipboard.writeText(this.code)).pipe(
          switchMap(() => delayedReset('Copied', 'Copy')),
          catchError(() => delayedReset('Failed', 'Copy'))
        )
      ),
      startWith('Copy')
    );
  }

  setCodeFromDirective(
    value: string,
    parser: 'html' | 'typescript' | 'css' | 'scss' = 'html'
  ) {
    this.code = value;
    this.parser = parser;
    this.updateDisplayCode();
  }

  updateDisplayCode() {
    try {
      this.displayCode = prettier.format(this.code, {
        semi: true,
        parser: this.parser === 'html' ? 'angular' : this.parser,
        plugins: [parserTS, parserHTML, parserAngular, parserPostCss],
      });
    } catch (error: any) {
      console.error(error);
      this.displayError = error.message ?? error;
    }
  }

  copyToClipboard() {
    this.copyTrigger.next();
  }

  ngAfterViewInit() {
    if (this.content && this.content.nativeElement.children.length !== 0) {
      const throwErrorMessage =
        new Error(`The \`<ngdp-code-snippet>\` component expects to only have a \`<textarea>\` element as a direct child. Example below:

    <ngdp-code-snippet>
      <textarea>
        <!-- Your Code For Display Here -->
      </textarea>
    </ngdp-code-snippet>
`);
      const errorMessage =
        'Error with provided code... See browser console for more information.';
      const divElement = this.content.nativeElement;
      if (divElement.children.length > 1) {
        this.displayError = errorMessage;
        throw throwErrorMessage;
      } else {
        const childElement = divElement.children[0];
        if (childElement.tagName !== 'TEXTAREA') {
          this.displayError = errorMessage;
          throw throwErrorMessage;
        } else {
          this.code = (childElement as HTMLTextAreaElement).value;
          this.updateDisplayCode();
        }
      }
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateDisplayCode();
  }

  ngOnDestroy() {
    this.copyTrigger.complete();
  }
}

function delayedReset(initial: string, reset: string) {
  return merge(of(initial), of(reset).pipe(delay(2000)));
}
