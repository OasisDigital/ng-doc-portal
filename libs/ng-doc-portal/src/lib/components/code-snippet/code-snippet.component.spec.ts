import { fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, skip, take, toArray } from 'rxjs';

import { CodeSnippetComponent } from './code-snippet.component';

describe('CodeSnippetComponent', () => {
  let component: CodeSnippetComponent;

  beforeEach(() => {
    component = new CodeSnippetComponent({} as any);
  });

  describe('buttonText', () => {
    it('should initialize to Copy', async () => {
      const result = await firstValueFrom(component.buttonText);

      expect(result).toEqual('Copy');
    });

    it('should return "Copied" in default scenario', fakeAsync(() => {
      (navigator.clipboard as any) = {
        writeText: jest.fn().mockResolvedValue(''),
      };

      component.buttonText
        .pipe(skip(1), take(2), toArray())
        .subscribe((buttonText) =>
          expect(buttonText).toEqual(['Copied', 'Copy']),
        );

      component.copyTrigger.next();
      tick(2000);
    }));

    it('should return "Failed" in error scenario', fakeAsync(() => {
      (navigator.clipboard as any) = {
        writeText: jest.fn().mockRejectedValue(''),
      };

      component.buttonText
        .pipe(skip(1), take(2), toArray())
        .subscribe((buttonText) =>
          expect(buttonText).toEqual(['Failed', 'Copy']),
        );

      component.copyTrigger.next();
      tick(2000);
    }));
  });
});
