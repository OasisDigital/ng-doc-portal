import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { HighlightLoader } from 'ngx-highlightjs';
import { ReplaySubject } from 'rxjs';

import {
  NG_DOC_PORTAL_THEME_OPTIONS_TOKEN,
  ThemeOption,
  THEME_KEY,
} from './tokens';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme: ReplaySubject<string> = new ReplaySubject(1);
  private currentTheme: string | undefined;
  theme = this._theme.asObservable();

  constructor(
    private hljsLoader: HighlightLoader,
    @Inject(DOCUMENT) private document: Document,
    @Optional()
    @Inject(NG_DOC_PORTAL_THEME_OPTIONS_TOKEN)
    public themeOptions?: ThemeOption[]
  ) {
    if (this.themeOptions?.length) {
      // pull default from injectable config
      let defaultThemeValue = this.themeOptions.find(
        (theme) => theme.default
      )?.value;
      if (!defaultThemeValue) {
        defaultThemeValue = this.themeOptions[0].value;
      }

      // override with theme in local storage
      try {
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) {
          defaultThemeValue = storedTheme;
        }
      } catch (e) {
        // Do nothing
      }

      this.setTheme(defaultThemeValue);
    }
  }

  setTheme(newTheme: string) {
    if (this.document.documentElement) {
      if (this.currentTheme) {
        document.documentElement.classList.remove(this.currentTheme);
      }
      if (newTheme) {
        document.documentElement.classList.add(newTheme);

        try {
          localStorage.setItem(THEME_KEY, newTheme);
        } catch (e) {
          // Do nothing
        }

        this.currentTheme = newTheme;
      }
    }

    const hljsTheme = this.themeOptions?.find(
      (themeOption) => themeOption.value === newTheme
    )?.hljsTheme;
    if (hljsTheme) {
      if ((this.hljsLoader as any)._themeLinkElement) {
        this.hljsLoader.setTheme(hljsTheme);
      } else {
        (this.hljsLoader as any).loadTheme(hljsTheme);
      }
    }

    this._theme.next(newTheme);
  }

  getTheme() {
    return this.currentTheme;
  }
}
