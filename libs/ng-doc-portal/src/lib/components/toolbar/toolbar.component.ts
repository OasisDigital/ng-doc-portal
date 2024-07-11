import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Optional,
  Type,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ThemeService } from '../../services/theme-service';
import {
  NG_DOC_PORTAL_THEME_OPTIONS_TOKEN,
  ThemeOption,
} from '../../services/tokens';

import { NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN } from './toolbar-tokens';

@Component({
  selector: 'ngdp-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [ReactiveFormsModule, NgComponentOutlet],
})
export class ToolbarComponent implements OnDestroy {
  themeControl: FormControl<string>;
  resizeObserver: ResizeObserver;
  destroy = new Subject<void>();

  public get hasChildElements() {
    this.cdr.detectChanges();
    return this.ref.nativeElement.children.length > 0;
  }

  constructor(
    private ref: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    @Optional()
    @Inject(NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN)
    public plugins?: Type<any>[],
    @Optional()
    @Inject(NG_DOC_PORTAL_THEME_OPTIONS_TOKEN)
    public themeOptions?: ThemeOption[]
  ) {
    this.themeControl = new FormControl(this.themeService.getTheme() ?? '', {
      nonNullable: true,
    });
    this.themeService.theme
      .pipe(takeUntil(this.destroy))
      .subscribe((theme) =>
        this.themeControl.setValue(theme, { emitEvent: false })
      );
    this.themeControl.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((theme) => {
        this.themeService.setTheme(theme);
      });

    this.resizeObserver = new ResizeObserver(() =>
      setTimeout(() => this.setOverflowingClass(), 100)
    );
    this.resizeObserver.observe(this.ref.nativeElement);
  }

  setOverflowingClass() {
    const element = this.ref.nativeElement;
    if (element.scrollWidth > element.offsetWidth) {
      element.classList.add('overflowing');
    } else {
      element.classList.remove('overflowing');
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    this.resizeObserver.disconnect();
  }
}
