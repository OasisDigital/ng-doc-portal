import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabItemDirective } from './tab-item.directive';

describe('TabItemComponent', () => {
  let component: TabItemDirective;
  let fixture: ComponentFixture<TabItemDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabItemDirective ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabItemDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
