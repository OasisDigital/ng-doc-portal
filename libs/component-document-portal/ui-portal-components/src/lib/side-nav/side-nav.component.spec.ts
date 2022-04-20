import {
  DynamicDocPageConfig,
  DocPagesMenu,
  DocPageMetadata,
} from '@cdp/component-document-portal/util-types';
import { createDocPageRoutes } from './side-nav.component';

const mockDocPageConfigs = {
  'general-button': {
    title: 'General/Button',
    loadConfig: jest.fn(),
  },
  'forms-input': {
    title: 'Forms/Input',
    loadConfig: jest.fn(),
  },
  'general-label': {
    title: 'General/Label',
    loadConfig: jest.fn(),
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
