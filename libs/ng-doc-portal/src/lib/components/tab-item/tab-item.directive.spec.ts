import { TabItemDirective } from './tab-item.directive';

describe('TabItemComponent', () => {
  let component: TabItemDirective;

  beforeEach(() => {
    component = new TabItemDirective({} as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
