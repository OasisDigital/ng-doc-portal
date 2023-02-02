import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { lastValueFrom } from 'rxjs';

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
});

@Component({
  selector: 'ngdp-markdown',
  template: `<div [innerHTML]="parsedHtml"></div>`,
})
export class MarkdownComponent {
  parsedHtml: SafeHtml | undefined;

  @Input() set markdown(value: string) {
    this.parseMarkdown(value);
  }

  @Input() set filePath(value: string) {
    (async () => {
      const fileContents = await this.getFileData(value);
      this.parseMarkdown(fileContents);
    })();
  }

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  parseMarkdown(textToMark: string) {
    this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(
      marked.parse(textToMark)
    );
  }

  getFileData(localPath: string) {
    return lastValueFrom(this.http.get(localPath, { responseType: 'text' }));
  }
}
