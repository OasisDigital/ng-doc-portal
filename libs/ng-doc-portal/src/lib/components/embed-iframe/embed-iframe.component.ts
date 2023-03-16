import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ngdp-embed-iframe',
  standalone: true,
  templateUrl: './embed-iframe.component.html',
})
export class EmbedIframeComponent {
  safeUrl: SafeResourceUrl | undefined;
  @Input() set src(url: string) {
    this.safeUrl = this.getTrustedUrl(url);
  }

  getTrustedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
