import {
  DocPageLoaderRecord,
  DocPagesMenu,
  DocPageMetadata,
} from '../../types/doc-page-config.types';

import { createDocPageRoutes } from './side-nav.component';

const mockDocPageConfigs = {
  'general-button': {
    title: 'General/Button',
    loadComponent: jest.fn(),
  },
  'forms-input': {
    title: 'Forms/Input',
    loadComponent: jest.fn(),
  },
  'general-label': {
    title: 'General/Label',
    loadComponent: jest.fn(),
  },
} as DocPageLoaderRecord;

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
