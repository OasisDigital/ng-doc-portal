import {
  DocPageMetadata,
  DocPagesMenu,
  DynamicDocPageConfig,
} from '@cdp/component-document-portal/util-types';

import { createDocPageRoutes } from './app.component';

const mockDocPageConfigs = {
  'general-button': {
    title: 'General/Button',
    loadConfig: () =>
      import(
        '../../../../apps/component-document-portal/src/app/doc-pages/button.doc-page'
      ).then((file) => file.default),
  },
  'forms-input': {
    title: 'Forms/Input',
    loadConfig: () =>
      import(
        '../../../../apps/component-document-portal/src/app/doc-pages/input.doc-page'
      ).then((file) => file.default),
  },
  'general-label': {
    title: 'General/Label',
    loadConfig: () =>
      import(
        '../../../../apps/component-document-portal/src/app/doc-pages/label.doc-page'
      ).then((file) => file.default),
  },
} as Record<string, DynamicDocPageConfig>;

describe('createDocPageRoutes', () => {
  it('should create the DocPagesRoutes array correctly', () => {
    const docPageRoutes = createDocPageRoutes(mockDocPageConfigs);
    expect(docPageRoutes.length).toEqual(2);
    const generalMenu = docPageRoutes.find(
      (menu) => menu.title === 'General'
    ) as DocPagesMenu;
    const buttonMetadata = generalMenu.items.find(
      (routeMetadata) => routeMetadata.title === 'Button'
    ) as DocPageMetadata;
    const labelMetadata = generalMenu.items.find(
      (routeMetadata) => routeMetadata.title === 'Label'
    ) as DocPageMetadata;
    expect(buttonMetadata.route).toEqual('general-button');
    expect(labelMetadata.route).toEqual('general-label');
  });
});