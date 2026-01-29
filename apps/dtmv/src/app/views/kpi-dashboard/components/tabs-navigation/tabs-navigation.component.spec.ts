import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsNavigationComponent } from './tabs-navigation.component';

describe('TabsNavigationComponent', () => {
  let component: TabsNavigationComponent;
  let fixture: ComponentFixture<TabsNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabsNavigationComponent]
    });
    fixture = TestBed.createComponent(TabsNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
