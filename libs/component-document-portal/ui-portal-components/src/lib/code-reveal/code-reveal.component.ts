import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import * as style from 'prettier';
import * as parserHTML from 'prettier/parser-html';
import * as parserTS from 'prettier/parser-typescript';
import { catchError, delay, from, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'cdp-code-reveal',
  templateUrl: './code-reveal.component.html',
  styleUrls: ['./code-reveal.component.scss'],
})
export class CodeRevealComponent implements OnInit, OnDestroy {
  @Input() language = 'html';
  code = '';
  prettier = style;
  buttonText: Observable<string>;
  copyTrigger = new Subject<void>();

  constructor(private elem: ElementRef) {
    this.buttonText = this.copyTrigger.pipe(
      switchMap(() =>
        from(navigator.clipboard.writeText(this.code)).pipe(
          switchMap(() => delayedReset('Copied', 'Copy')),
          catchError(() => delayedReset('Failed', 'Copy')),
        ),
      ),
      startWith('Copy'),
    );
  }

  ngOnInit(): void {
    const replaced = this.angularReplace(this.elem.nativeElement.children[1].innerHTML);
    const formatted = this.prettier.format(replaced, {
      semi: true,
      parser: this.language,
      plugins: [parserHTML, parserTS],
    });
    this.code = formatted;
  }

  ngOnDestroy() {
    this.copyTrigger.complete();
  }

  angularReplace(html: string) {
    html = html.replace(/_ngcontent-[a-z]{3}-c\d\d=""/gm, '');
    if (this.language !== 'html') {
      html = html.replace(/<textarea >/gm, '');
      html = html.replace(/<\/textarea>/gm, '');
    }
    return html;
  }

  copyToClipboard() {
    this.copyTrigger.next();
  }
}

function delayedReset(initial: string, reset: string) {
  return merge(
    of(initial),
    of(reset).pipe(delay(2000))
  )
}
