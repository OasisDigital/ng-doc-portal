import { fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, skip, take, toArray } from 'rxjs';

import { CodeRevealComponent } from './code-reveal.component';

describe('CodeRevealComponent', () => {
  let component: CodeRevealComponent;

  beforeEach(() => {
    component = new CodeRevealComponent();
  })

  describe('buttonText', () => {
    it('should initialize to Copy', async () => {
      const result = await firstValueFrom(component.buttonText);

      expect(result).toEqual('Copy');
    });

    it('should return "Copied" in default scenario', fakeAsync(() => {
      (navigator.clipboard as any) = { writeText: jest.fn().mockResolvedValue('') }

      component.buttonText.pipe(skip(1), take(2), toArray()).subscribe(
        (buttonText) => expect(buttonText).toEqual(['Copied', 'Copy'])
      );

      component.copyTrigger.next();
      tick(2000);
    }));

    it('should return "Failed" in error scenario', fakeAsync(() => {
      (navigator.clipboard as any) = { writeText: jest.fn().mockRejectedValue('') }

      component.buttonText.pipe(skip(1), take(2), toArray()).subscribe(
        (buttonText) => expect(buttonText).toEqual(['Failed', 'Copy'])
      );

      component.copyTrigger.next();
      tick(2000);
    }));
  });

  describe('angularReplace', () => {
    it('should remove "_ngcontent" from the input string', () => {
      const html = '<div _ngcontent-abc-c00=""></div>';

      const result = component.angularReplace(html);

      expect(result).toEqual('<div></div>');
    });

    it('should remove "<textarea>" from the input string if language == "html"', () => {
      const html = '<textarea><div></div></textarea>';
      component.language = 'ts';

      const result = component.angularReplace(html);

      expect(result).toEqual('<div></div>');
    });
  });
});
