import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'cdp-markdown',
  template: `<div [innerHTML]="parsedHtml"></div>`,
  styleUrls: ['./markdown.component.scss'],
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
