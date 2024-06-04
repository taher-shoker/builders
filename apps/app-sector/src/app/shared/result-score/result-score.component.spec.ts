import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultScoreComponent } from './result-score.component';

describe('ResultScoreComponent', () => {
  let component: ResultScoreComponent;
  let fixture: ComponentFixture<ResultScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultScoreComponent]
    });
    fixture = TestBed.createComponent(ResultScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
