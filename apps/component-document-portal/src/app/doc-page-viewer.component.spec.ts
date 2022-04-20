import { DocPageViewerComponent } from './doc-page-viewer.component';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { docPageRouteParam } from './app.module';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { docPageConfigs } from './doc-page-configs';
import { DocPageConfig } from '@cdp/component-document-portal/util-types';

describe('DocPageViewerComponent', () => {
  let component: DocPageViewerComponent;
  const targetParam = 'general-buttons'
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
            paramMap: paramMapSpy
          }
        },
        DocPageViewerComponent,
      ]
    });

    component = TestBed.inject(DocPageViewerComponent);
  });

  it('should return a `docPageComponent` from the loaded config', async () => {
    const { docPageComponent } = await docPageConfigs[targetParam].loadConfig()
      .catch(() => ({}) as DocPageConfig);

    paramMapSpy.next(
      convertToParamMap({ [docPageRouteParam]: targetParam })
    );
    const result = await firstValueFrom(component.component$);

    expect(result).toEqual(docPageComponent);
  });

  it('should filter out and navigate to "/" if config does not exist', async () => {
    paramMapSpy.next(
      convertToParamMap({ [docPageRouteParam]: 'non-existent-config' })
    );
    await firstValueFrom(component.component$);

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
