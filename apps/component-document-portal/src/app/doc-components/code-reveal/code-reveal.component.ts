import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as style from 'prettier';
import * as parserHTML from 'prettier/parser-html';
import * as parserTS from 'prettier/parser-typescript';
@Component({
  selector: 'cdp-code-reveal',
  templateUrl: './code-reveal.component.html',
  styleUrls: ['./code-reveal.component.scss'],
})
export class CodeRevealComponent implements OnInit {
  @Input() language = 'html';
  code = '';
  constructor(private elem: ElementRef) {}
  prettier = style;

  ngOnInit(): void {
    const replaced = this.angularReplace(this.elem.nativeElement.children[1].innerHTML);
    const formatted = this.prettier.format(replaced, {
      semi: true,
      parser: this.language,
      plugins: [parserHTML, parserTS],
    });
    this.code = formatted;
  }

  angularReplace(html: string) {
    html = html.replace(/_ngcontent-[a-z]{3}-c\d\d=""/gm, '');
    if (this.language !== 'html') {
      html = html.replace(/<textarea >/gm, '');
      html = html.replace(/<\/textarea>/gm, '');
    }
    return html;
  }
}
