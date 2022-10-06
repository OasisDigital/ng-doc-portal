import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Optional,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { concat, merge, of, pairwise } from 'rxjs';

import {
  CDP_THEME_OPTIONS_TOKEN,
  ThemeOption,
  THEME_KEY,
} from './toolbar-token';

@Component({
  selector: 'cdp-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  themeControl = new FormControl('', { nonNullable: true });

  public get hasChildElements() {
    this.cdr.detectChanges();
    return this.ref.nativeElement.children.length > 0;
  }

  constructor(
    private ref: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
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
  }
}
