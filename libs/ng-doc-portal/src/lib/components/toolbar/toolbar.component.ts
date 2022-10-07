import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Optional,
  Type,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { concat, merge, of, pairwise } from 'rxjs';

import {
  CDP_THEME_OPTIONS_TOKEN,
  CDP_TOOLBAR_PLUGINS_TOKEN,
  ThemeOption,
  THEME_KEY,
} from './toolbar-tokens';

@Component({
  selector: 'cdp-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnDestroy {
  themeControl = new FormControl('', { nonNullable: true });
  resizeObserver: ResizeObserver;

  public get hasChildElements() {
    this.cdr.detectChanges();
    return this.ref.nativeElement.children.length > 0;
  }

  constructor(
    private ref: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    @Optional()
    @Inject(CDP_TOOLBAR_PLUGINS_TOKEN)
    public plugins?: Type<any>[],
    @Optional()
    @Inject(CDP_THEME_OPTIONS_TOKEN)
    public themeOptions?: ThemeOption[]
  ) {
    if (this.themeOptions?.length) {
      let defaultThemeValue = this.themeOptions.find(
        (theme) => theme.default
      )?.value;
      if (!defaultThemeValue) {
        defaultThemeValue = this.themeOptions[0].value;
      }

      try {
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) {
          defaultThemeValue = storedTheme;
        }
      } catch (e) {
        // Do nothing
      }

      this.themeControl.patchValue(defaultThemeValue);

      merge(
        concat(of(null), of(defaultThemeValue)),
        this.themeControl.valueChanges
      )
        .pipe(pairwise())
        .subscribe(([oldTheme, newTheme]) => {
          if (document.documentElement) {
            if (oldTheme) {
              document.documentElement.classList.remove(oldTheme);
            }
            if (newTheme) {
              document.documentElement.classList.add(newTheme);

              try {
                localStorage.setItem(THEME_KEY, newTheme);
              } catch (e) {
                // Do nothing
              }
            }
          }
        });
    }

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
    this.resizeObserver.disconnect();
  }
}
