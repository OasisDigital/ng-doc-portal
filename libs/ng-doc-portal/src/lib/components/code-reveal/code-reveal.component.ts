import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as prettier from 'prettier';
import * as parserHTML from 'prettier/parser-html';
import * as parserTS from 'prettier/parser-typescript';
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
  selector: 'cdp-code-reveal',
  templateUrl: './code-reveal.component.html',
  styleUrls: ['./code-reveal.component.scss'],
})
export class CodeRevealComponent implements AfterViewInit, OnDestroy {
  @Input() language = 'html';
  @ViewChild('content', { read: ElementRef }) content!: ElementRef;
  code = '';
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

  ngAfterViewInit() {
    const replaced = this.angularReplace(this.content.nativeElement.innerHTML);
    this.code = prettier.format(replaced, {
      semi: true,
      parser: this.language,
      plugins: [parserHTML, parserTS],
    });
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.copyTrigger.complete();
  }

  angularReplace(html: string) {
    html = html.replace(/\s_ngcontent-[a-z]{3}-c\d\d=""/gm, '');
    if (this.language !== 'html') {
      html = html.replace(/<textarea(.*?)>/gm, '');
      html = html.replace(/<\/textarea>/gm, '');
    }
    return html;
  }

  copyToClipboard() {
    this.copyTrigger.next();
  }
}

function delayedReset(initial: string, reset: string) {
  return merge(of(initial), of(reset).pipe(delay(2000)));
}
