import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCardTabsComponent } from './score-card-tabs.component';

describe('ScoreCardTabsComponent', () => {
  let component: ScoreCardTabsComponent;
  let fixture: ComponentFixture<ScoreCardTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreCardTabsComponent]
    });
    fixture = TestBed.createComponent(ScoreCardTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
