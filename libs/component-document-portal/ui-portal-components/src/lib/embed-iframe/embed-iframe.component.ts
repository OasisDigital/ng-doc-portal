import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'cdp-embed-iframe',
  templateUrl: './embed-iframe.component.html',
  styleUrls: ['./embed-iframe.component.scss'],
})
export class EmbedIframeComponent {
  safeUrl: SafeResourceUrl | undefined;
  @Input() set SafeUrl(url: string) {
    this.safeUrl = this.getTrustedUrl(url);
  }

  getTrustedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
