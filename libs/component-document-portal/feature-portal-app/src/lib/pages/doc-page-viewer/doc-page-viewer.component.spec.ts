import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { firstValueFrom, ReplaySubject } from 'rxjs';

import { docPageRouteParam } from '../../util/constants';

import { DocPageViewerComponent } from './doc-page-viewer.component';
import { DocPageConfigService } from '../../services/doc-page-config.service';

class MockLazyModeComponent {}

class MockRuntimeModeComponent {}

const mockLazyConfigParam = 'mock-lazy-config';
const mockRuntimeConfigParam = 'mock-runtime-config';

describe('DocPageViewerComponent', () => {
  let component: DocPageViewerComponent;
  const navigateSpy = jest.fn();
  const paramMapSpy = new ReplaySubject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: navigateSpy,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSpy,
          },
        },
        {
          provide: DocPageConfigService,
          useValue: {
            configs: {
              [mockLazyConfigParam]: {
                mode: 'lazy',
                loadConfig: () =>
                  Promise.resolve({
                    docPageComponent: MockLazyModeComponent,
                  }),
              },
              [mockRuntimeConfigParam]: {
                mode: 'runtime',
                config: {
                  docPageComponent: MockRuntimeModeComponent,
                },
              },
            },
          },
        },
        DocPageViewerComponent,
      ],
    });

    component = TestBed.inject(DocPageViewerComponent);
  });

  it('should return mock component from the lazy mode config', async () => {
    paramMapSpy.next(
      convertToParamMap({ [docPageRouteParam]: mockLazyConfigParam })
    );

    const result = await firstValueFrom(component.component$);

    expect(result).toEqual(MockLazyModeComponent);
  });

  it('should return mock component from the runtime mode config', async () => {
    paramMapSpy.next(
      convertToParamMap({ [docPageRouteParam]: mockRuntimeConfigParam })
    );

    const result = await firstValueFrom(component.component$);

    expect(result).toEqual(MockRuntimeModeComponent);
  });

  // TODO: Test the path of the observable for the filtering...
  // it('should filter out and navigate to "/" if config does not exist', async () => {
  //   paramMapSpy.next(
  //     convertToParamMap({ [docPageRouteParam]: 'non-existent-config' })
  //   );
  //   await firstValueFrom(component.component$);

  //   expect(navigateSpy).toHaveBeenCalledWith(['/']);
  // });
});
